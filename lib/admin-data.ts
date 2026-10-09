// All admin reads and writes. Server-only: callers must have checked requireAdmin().
import { and, asc, desc, eq, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events, links, type Link, type LinkEvent } from "@/db/schema";
import { generateCode, normalizeCode } from "./codes";

export type LinkKindFilter = "all" | "card" | "digital";
export type LinkSort = "activity" | "number";

const visitsSql = sql<number>`coalesce(sum(case when ${events.type} = 'visit' then 1 else 0 end), 0)`;
const sharesSql = sql<number>`coalesce(sum(case when ${events.type} = 'share' then 1 else 0 end), 0)`;
const lastSql = sql<number | null>`max(${events.createdAt})`;
const named = sql`(${links.name} is not null and ${links.name} <> '')`;

export type LinkRow = Link & { visits: number; shares: number; lastActivity: Date | null };

const toDate = (seconds: number | null) => (seconds == null ? null : new Date(seconds * 1000));

/** Overview: the counters, the next unnamed card, and the latest events. */
export async function getOverview() {
  const db = getDb();
  const [counts] = await db
    .select({
      total: sql<number>`count(*)`,
      inUse: sql<number>`coalesce(sum(case when ${named} then 1 else 0 end), 0)`,
      cardsInUse: sql<number>`coalesce(sum(case when ${named} and ${links.kind} = 'card' then 1 else 0 end), 0)`,
      digitalInUse: sql<number>`coalesce(sum(case when ${named} and ${links.kind} = 'digital' then 1 else 0 end), 0)`,
      unnamedCards: sql<number>`coalesce(sum(case when not ${named} and ${links.kind} = 'card' then 1 else 0 end), 0)`,
      nextUnnamed: sql<number | null>`min(case when not ${named} and ${links.kind} = 'card' then ${links.number} end)`,
      lastUnnamed: sql<number | null>`max(case when not ${named} and ${links.kind} = 'card' then ${links.number} end)`,
      firstCard: sql<number | null>`min(${links.number})`,
      lastCard: sql<number | null>`max(${links.number})`,
    })
    .from(links);

  const [totals] = await db
    .select({ visits: visitsSql, shares: sharesSql })
    .from(events);

  const recent = await db
    .select({ event: events, link: links })
    .from(events)
    .innerJoin(links, eq(events.linkId, links.id))
    .orderBy(desc(events.createdAt), desc(events.id))
    .limit(12);

  // Every card number with its code and name, so "Name a link" can preview a
  // match instantly while typing (a few hundred rows at most).
  const cards = await db
    .select({ id: links.id, number: links.number, code: links.code, name: links.name })
    .from(links)
    .where(eq(links.kind, "card"))
    .orderBy(asc(links.number));

  return {
    counts: counts ?? null,
    visits: totals?.visits ?? 0,
    shares: totals?.shares ?? 0,
    recent,
    cards: cards.flatMap((c) => (c.number == null ? [] : [{ ...c, number: c.number }])),
  };
}

/** Links list with per-link totals, filtered and sorted. */
export async function listLinks({ q, kind, sort }: { q: string; kind: LinkKindFilter; sort: LinkSort }) {
  const db = getDb();
  const where: SQL[] = [];
  if (kind !== "all") where.push(eq(links.kind, kind));
  const query = q.trim();
  if (query) {
    const digits = query.replace(/^#/, "");
    const like = `%${query.toLowerCase()}%`;
    const conditions: SQL[] = [
      sql`lower(${links.name}) like ${like}`,
      sql`lower(${links.notes}) like ${like}`,
      sql`${links.code} like ${`%${query.toUpperCase()}%`}`,
    ];
    if (/^\d+$/.test(digits)) conditions.push(eq(links.number, Number(digits)));
    where.push(sql`(${sql.join(conditions, sql` or `)})`);
  }

  const rows = await db
    .select({ link: links, visits: visitsSql, shares: sharesSql, last: lastSql })
    .from(links)
    .leftJoin(events, eq(events.linkId, links.id))
    .where(where.length ? and(...where) : undefined)
    .groupBy(links.id)
    .orderBy(
      ...(sort === "number"
        ? [sql`${links.number} is null`, asc(links.number), desc(links.createdAt)]
        : [sql`${lastSql} is null`, desc(lastSql), asc(links.number)]),
    );

  const [kinds] = await db
    .select({
      all: sql<number>`count(*)`,
      card: sql<number>`coalesce(sum(case when ${links.kind} = 'card' then 1 else 0 end), 0)`,
      digital: sql<number>`coalesce(sum(case when ${links.kind} = 'digital' then 1 else 0 end), 0)`,
      inUse: sql<number>`coalesce(sum(case when ${named} then 1 else 0 end), 0)`,
    })
    .from(links);

  return {
    rows: rows.map((r): LinkRow => ({ ...r.link, visits: r.visits, shares: r.shares, lastActivity: toDate(r.last) })),
    counts: kinds ?? { all: 0, card: 0, digital: 0, inUse: 0 },
  };
}

/** Resolves "?link=" values: a card number ("17", "#017") or a code ("X7K2P9Q"). */
export async function findLink(ref: string): Promise<Link | null> {
  const db = getDb();
  const trimmed = ref.trim().replace(/^#/, "");
  if (/^\d{1,6}$/.test(trimmed)) {
    const [row] = await db.select().from(links).where(eq(links.number, Number(trimmed))).limit(1);
    return row ?? null;
  }
  const code = normalizeCode(trimmed);
  if (!code) return null;
  const [row] = await db.select().from(links).where(eq(links.code, code)).limit(1);
  return row ?? null;
}

export type LinkDetail = {
  link: Link;
  events: LinkEvent[];
  visits: number;
  shares: number;
  byPlatform: { platform: string; count: number }[];
  first: Date | null;
  last: Date | null;
};

export async function getLinkDetail(ref: string): Promise<LinkDetail | null> {
  const link = await findLink(ref);
  if (!link) return null;
  const log = await getDb()
    .select()
    .from(events)
    .where(eq(events.linkId, link.id))
    .orderBy(desc(events.createdAt), desc(events.id));

  const platforms = new Map<string, number>();
  for (const e of log) if (e.type === "share" && e.platform) platforms.set(e.platform, (platforms.get(e.platform) ?? 0) + 1);

  return {
    link,
    events: log,
    visits: log.filter((e) => e.type === "visit").length,
    shares: log.filter((e) => e.type === "share").length,
    byPlatform: [...platforms].map(([platform, count]) => ({ platform, count })).sort((a, b) => b.count - a.count),
    first: log.at(-1)?.createdAt ?? null,
    last: log[0]?.createdAt ?? null,
  };
}

const clean = (value: string | null | undefined, max: number) => {
  const v = (value ?? "").trim().slice(0, max);
  return v === "" ? null : v;
};

export async function updateLink(id: number, fields: { name?: string | null; notes?: string | null }) {
  const patch: Partial<Pick<Link, "name" | "notes">> = {};
  if ("name" in fields) patch.name = clean(fields.name, 80);
  if ("notes" in fields) patch.notes = clean(fields.notes, 500);
  const [row] = await getDb().update(links).set(patch).where(eq(links.id, id)).returning();
  return row ?? null;
}

/**
 * Creates a digital link. Uses the code shown in the form when it's valid,
 * and retries with fresh codes if it collides with an existing one.
 */
export async function createDigitalLink({ code, name, notes }: { code?: string | null; name: string; notes?: string | null }) {
  const db = getDb();
  let candidate = normalizeCode(code) ?? generateCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [row] = await db
        .insert(links)
        .values({ code: candidate, kind: "digital", number: null, name: clean(name, 80), notes: clean(notes, 500), createdAt: new Date() })
        .returning();
      if (row) return row;
    } catch (error) {
      if (!String(error).includes("UNIQUE")) throw error;
    }
    candidate = generateCode();
  }
  throw new Error("Could not find a free code after 5 attempts");
}

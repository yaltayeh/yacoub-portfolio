// TEMPORARY (Phase 1): proves the deployed Worker can read D1. Remove in Phase 6.
import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { count, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events, links } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Health",
  robots: { index: false, follow: false },
};

type Check = { label: string; value: string; ok: boolean };

async function runChecks(): Promise<Check[]> {
  const db = getDb();
  try {
    const migrations = await db.all<{ name: string }>(
      sql`select name from d1_migrations order by id`,
    );
    const [linkCount] = await db.select({ n: count() }).from(links);
    const [eventCount] = await db.select({ n: count() }).from(events);
    return [
      {
        label: "Migrations applied",
        value: migrations.map((m) => m.name).join(", ") || "none",
        ok: migrations.length > 0,
      },
      { label: "links rows", value: String(linkCount?.n ?? 0), ok: true },
      { label: "events rows", value: String(eventCount?.n ?? 0), ok: true },
    ];
  } catch (error) {
    return [{ label: "D1 query", value: String(error), ok: false }];
  }
}

export default async function HealthPage() {
  const checks = await runChecks();
  const healthy = checks.every((c) => c.ok);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "var(--space-52) var(--space-20)" }}>
      <p style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)", color: "var(--ink-faint)", textTransform: "uppercase" }}>
        Temporary · Phase 1
      </p>
      <h1 style={{ font: "var(--text-h2)", margin: "var(--space-8) 0 var(--space-32)" }}>
        {healthy ? "D1 is reachable" : "D1 check failed"}
      </h1>
      <dl style={{ margin: 0, display: "grid", gap: "var(--space-12)" }}>
        <Row label="Environment" value={env.APP_ENV} ok />
        {checks.map((c) => (
          <Row key={c.label} {...c} />
        ))}
      </dl>
    </main>
  );
}

function Row({ label, value, ok }: Check) {
  return (
    <div
      style={{
        padding: "var(--space-12) var(--space-16)",
        borderRadius: "var(--radius-control)",
        background: "var(--surface)",
        border: `1px solid ${ok ? "var(--line-soft)" : "var(--danger)"}`,
      }}
    >
      <dt style={{ font: "var(--text-label)", color: "var(--ink-faint)" }}>{label}</dt>
      <dd style={{ margin: "var(--space-4) 0 0", font: "var(--text-code)", color: ok ? "var(--ink)" : "var(--danger)", overflowWrap: "anywhere" }}>
        {value}
      </dd>
    </div>
  );
}

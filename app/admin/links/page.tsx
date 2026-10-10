import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { getLinkDetail, listLinks, type LinkKindFilter, type LinkRow, type LinkSort } from "@/lib/admin-data";
import { cardNumber, countryName, deviceLabel, fullDate, logTime, platformName, relativeTime } from "@/lib/format";
import { displayLinkUrl, qrLinkUrl, shareLinkUrl } from "@/lib/site";
import { qrSvg } from "@/lib/qr";
import { AdminShell } from "../_components/AdminShell";
import { LinkSheet, type SheetData } from "../_components/LinkSheet";
import { LinkIcon, Plus, QrIcon, Search } from "../_components/admin-icons";

export const metadata: Metadata = { title: "Links" };
export const dynamic = "force-dynamic";

type Params = { q?: string; kind?: string; sort?: string; link?: string; focus?: string; from?: string; created?: string };

export default async function LinksPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").slice(0, 80);
  const kind: LinkKindFilter = params.kind === "card" || params.kind === "digital" ? params.kind : "all";
  const sort: LinkSort = params.sort === "number" ? "number" : "activity";

  const [{ rows, counts }, detail] = await Promise.all([
    listLinks({ q, kind, sort }),
    params.link ? getLinkDetail(params.link) : Promise.resolve(null),
  ]);

  // The list URL without the sheet parameters: where closing the sheet goes.
  const listQuery = new URLSearchParams();
  if (q) listQuery.set("q", q);
  if (kind !== "all") listQuery.set("kind", kind);
  if (sort !== "activity") listQuery.set("sort", sort);
  const listHref = `/admin/links${listQuery.size ? `?${listQuery}` : ""}`;
  const withLink = (code: string) => {
    const p = new URLSearchParams(listQuery);
    p.set("link", code);
    return `/admin/links?${p}`;
  };
  const withParams = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(listQuery);
    for (const [k, v] of Object.entries(patch)) (v == null ? p.delete(k) : p.set(k, v));
    return `/admin/links${p.size ? `?${p}` : ""}`;
  };

  const sheet: SheetData | null = detail
    ? {
        id: detail.link.id,
        code: detail.link.code,
        title: detail.link.kind === "card" ? cardNumber(detail.link.number) : "Digital",
        kind: detail.link.kind,
        name: detail.link.name,
        notes: detail.link.notes,
        displayUrl: displayLinkUrl(detail.link.code),
        shareUrl: shareLinkUrl(detail.link.code),
        qrSvg: qrSvg(qrLinkUrl(detail.link.code)),
        fileBase: detail.link.kind === "card" ? `card-${String(detail.link.number).padStart(3, "0")}` : `link-${detail.link.code}`,
        visits: detail.visits,
        shares: detail.shares,
        first: fullDate(detail.first),
        last: relativeTime(detail.last),
        byPlatform: detail.byPlatform.map((p) => ({ label: platformName(p.platform), count: p.count })),
        log: detail.events.map((e) => ({
          id: e.id,
          share: e.type === "share",
          label: e.type === "share" ? `Shared via ${platformName(e.platform)}` : "Visit",
          at: logTime(e.createdAt),
          meta: e.type === "share" ? countryName(e.country) : `${deviceLabel(e.device, e.os)} · ${countryName(e.country)}`,
        })),
      }
    : null;

  const filters: { key: LinkKindFilter; label: string; n: number }[] = [
    { key: "all", label: "All", n: counts.all },
    { key: "card", label: "Printed", n: counts.card },
    { key: "digital", label: "Digital", n: counts.digital },
  ];

  return (
    <AdminShell section="links" linkCount={counts.all}>
      <main className="page">
        <header className="page__head">
          <div className="page__title">
            <h1>Links</h1>
            <span className="page__sub">
              {counts.all} links · {counts.inUse} in use
            </span>
          </div>
          <div className="page__actions">
            <Link href="/admin/links/new" className="abtn abtn--primary abtn--sm">
              <Plus size={15} />
              New link
            </Link>
            <Link href="/admin/generate" className="abtn abtn--ghost abtn--sm only-desktop">
              <QrIcon />
              Generate batch
            </Link>
          </div>
        </header>

        <div className="toolbar">
          <form className="toolbar__search" action="/admin/links" role="search">
            <Search />
            <label htmlFor="search" className="visually-hidden">
              Search links
            </label>
            <input id="search" name="q" type="search" placeholder="Number, name or code" defaultValue={q} />
            {kind !== "all" ? <input type="hidden" name="kind" value={kind} /> : null}
            {sort !== "activity" ? <input type="hidden" name="sort" value={sort} /> : null}
          </form>
          <div role="group" aria-label="Show" className="segmented">
            {filters.map((f) => (
              <Link
                key={f.key}
                href={withParams({ kind: f.key === "all" ? null : f.key })}
                aria-current={kind === f.key ? "true" : undefined}
                className="segmented__item"
                scroll={false}
              >
                {f.label}
                <span className="segmented__n">{f.n}</span>
              </Link>
            ))}
          </div>
          <div role="group" aria-label="Sort by" className="segmented">
            <span className="segmented__label">Sort</span>
            <Link href={withParams({ sort: null })} aria-current={sort === "activity" ? "true" : undefined} className="segmented__item" scroll={false}>
              Last activity
            </Link>
            <Link href={withParams({ sort: "number" })} aria-current={sort === "number" ? "true" : undefined} className="segmented__item" scroll={false}>
              Number
            </Link>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyLinks searching={Boolean(q) || kind !== "all"} total={counts.all} />
        ) : (
          <>
            <ul className="link-cards only-mobile">
              {rows.map((row) => (
                <li key={row.id}>
                  <Link href={withLink(row.code)} scroll={false} className="link-card">
                    <span className="link-card__top">
                      <LinkBadge row={row} />
                      <LinkName row={row} />
                      <span className="link-card__last">{relativeTime(row.lastActivity)}</span>
                    </span>
                    {row.notes ? <span className="link-card__notes">{row.notes}</span> : null}
                    <span className="link-card__meta">
                      {row.code} · {row.visits} visits · {row.shares} shares
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="table-wrap only-desktop">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="c-link">Link</th>
                    <th scope="col" className="c-name">Name</th>
                    <th scope="col" className="c-code">Code</th>
                    <th scope="col">Notes</th>
                    <th scope="col" className="num-col">Visits</th>
                    <th scope="col" className="num-col">Shares</th>
                    <th scope="col" className="num-col c-last">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <LinkBadge row={row} />
                      </td>
                      <td>
                        <Link href={withLink(row.code)} scroll={false} className="table__open">
                          <LinkName row={row} />
                        </Link>
                      </td>
                      <td className="mono dim">{row.code}</td>
                      <td className="table__notes">{row.notes ?? "—"}</td>
                      <td className="num-col">{row.visits}</td>
                      <td className="num-col">{row.shares}</td>
                      <td className="num-col mono dim">{relativeTime(row.lastActivity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {params.link && !detail ? <p className="toast" role="status">No link matches “{params.link}”.</p> : null}

      {sheet ? (
        <LinkSheet
          key={sheet.id}
          data={sheet}
          closeHref={params.from === "overview" ? "/admin" : listHref}
          focusName={params.focus === "name"}
          created={params.created === "1"}
        />
      ) : null}
    </AdminShell>
  );
}

function LinkBadge({ row }: { row: LinkRow }) {
  return row.kind === "card" ? (
    <span className="badge-num">{cardNumber(row.number)}</span>
  ) : (
    <span className="badge-digital">
      <LinkIcon size={11} />
      Digital
    </span>
  );
}

function LinkName({ row }: { row: LinkRow }) {
  return row.name ? <span className="link-name">{row.name}</span> : <span className="unnamed">Unnamed</span>;
}

function EmptyLinks({ searching, total }: { searching: boolean; total: number }) {
  if (searching && total > 0) {
    return (
      <div className="empty">
        <h2>No links match</h2>
        <p>Try a card number like 17, a name, or part of a code.</p>
        <Link href="/admin/links" className="abtn abtn--ghost abtn--sm">
          Clear search
        </Link>
      </div>
    );
  }
  return (
    <div className="empty">
      <span className="empty__mark" aria-hidden="true">
        <LinkIcon size={26} />
      </span>
      <h2>No links yet</h2>
      <p>
        Create a link for your CV or LinkedIn, or generate a numbered batch to print on business cards. Every visit and share
        will show up here.
      </p>
      <div className="empty__actions">
        <Link href="/admin/links/new" className="abtn abtn--primary">
          <Plus />
          New link
        </Link>
        <Link href="/admin/generate" className="abtn abtn--ghost">
          <QrIcon />
          Generate a printed batch
        </Link>
      </div>
      <p className="empty__note mono">Printed links start at #001</p>
    </div>
  );
}

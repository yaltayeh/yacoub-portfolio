import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { getSiteVisits, type VisitorFilter } from "@/lib/admin-data";
import { countryName, deviceLabel, platformName, relativeTime } from "@/lib/format";
import { sourceLabel } from "@/lib/referrer";
import { AdminShell } from "../_components/AdminShell";
import { Eye, Share } from "../_components/admin-icons";

export const metadata: Metadata = { title: "Visitors" };
export const dynamic = "force-dynamic";

type Params = { type?: string; page?: string };

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin();
  const params = await searchParams;
  const type: VisitorFilter = params.type === "visit" || params.type === "share" ? params.type : "all";
  const page = Math.max(1, Math.floor(Number(params.page)) || 1);
  const { totals, sources, countries, rows, hasMore } = await getSiteVisits({ type, page });

  const href = (patch: { type?: VisitorFilter; page?: number }) => {
    const p = new URLSearchParams();
    const t = patch.type ?? type;
    if (t !== "all") p.set("type", t);
    if (patch.page && patch.page > 1) p.set("page", String(patch.page));
    return `/admin/visitors${p.size ? `?${p}` : ""}`;
  };
  const filters: { key: VisitorFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "visit", label: "Visits" },
    { key: "share", label: "Shares" },
  ];
  const topVisits = sources[0]?.count ?? 1;

  return (
    <AdminShell section="visitors">
      <main className="page">
        <header className="page__head">
          <div className="page__title">
            <h1>Visitors</h1>
            <span className="page__sub">Opens of the site without a tracked link</span>
          </div>
        </header>

        <dl className="stats">
          <div className="stat">
            <dt>Visits</dt>
            <dd>{totals.visits}</dd>
          </div>
          <div className="stat">
            <dt>Last 7 days</dt>
            <dd>{totals.week}</dd>
          </div>
          <div className="stat">
            <dt>Link previews</dt>
            <dd>{totals.shares}</dd>
          </div>
        </dl>

        {sources.length > 0 ? (
          <div className="breakdowns">
            <section aria-labelledby="sources-title" className="panel">
              <div className="panel__head">
                <h2 id="sources-title">Where they came from</h2>
              </div>
              <ul className="breakdown">
                {sources.map((s) => (
                  <li key={`${s.source}-${s.source === "other" ? s.host : ""}`}>
                    <span className="breakdown__label">{sourceLabel(s.source, s.host)}</span>
                    <span className="breakdown__bar" aria-hidden="true">
                      <span style={{ width: `${Math.max(4, (s.count / topVisits) * 100)}%` }} />
                    </span>
                    <span className="breakdown__n">{s.count}</span>
                  </li>
                ))}
              </ul>
              <p className="breakdown__note">
                “Direct / unknown” is a typed address or an app that hides the source. WhatsApp, Telegram and most email apps land here.
              </p>
            </section>
            <section aria-labelledby="countries-title" className="panel">
              <div className="panel__head">
                <h2 id="countries-title">Countries</h2>
              </div>
              <ul className="breakdown">
                {countries.map((c) => (
                  <li key={c.country ?? "unknown"}>
                    <span className="breakdown__label">{countryName(c.country)}</span>
                    <span className="breakdown__bar" aria-hidden="true">
                      <span style={{ width: `${Math.max(4, (c.count / (countries[0]?.count ?? 1)) * 100)}%` }} />
                    </span>
                    <span className="breakdown__n">{c.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}

        <div className="toolbar">
          <div role="group" aria-label="Show" className="segmented">
            {filters.map((f) => (
              <Link key={f.key} href={href({ type: f.key })} aria-current={type === f.key ? "true" : undefined} className="segmented__item" scroll={false}>
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        <section aria-labelledby="log-title" className="panel activity">
          <div className="panel__head">
            <h2 id="log-title">Visitor log</h2>
          </div>
          {rows.length === 0 ? (
            <p className="panel__empty">
              Nothing yet. Opens of altaieh.tech that don’t come through one of your links show up here, with where they came from.
            </p>
          ) : (
            <>
              <div aria-hidden="true" className="activity__cols only-desktop">
                <span />
                <span>From</span>
                <span>Device</span>
                <span>Country</span>
                <span className="right">When</span>
              </div>
              <ul className="events">
                {rows.map((v) => {
                  const share = v.type === "share";
                  const when = relativeTime(v.createdAt);
                  const device = share ? "—" : deviceLabel(v.device, v.os);
                  const place = [v.city, countryName(v.country)].filter(Boolean).join(", ");
                  return (
                    <li key={v.id}>
                      <div className="event">
                        <span aria-hidden="true" className={`event__icon${share ? " event__icon--share" : ""}`}>
                          {share ? <Share /> : <Eye />}
                        </span>
                        <span className="event__main">
                          <span className="event__line">
                            {share ? (
                              <>
                                <span className="verb">Link previewed by</span>
                                <span className="platform">{platformName(v.platform)}</span>
                              </>
                            ) : (
                              <>
                                <strong>{sourceLabel(v.source, v.referrerHost)}</strong>
                                <span className="verb mono">{v.path}</span>
                              </>
                            )}
                          </span>
                          <span className="event__meta">{share ? `${when} · ${place}` : `${when} · ${device} · ${place}`}</span>
                        </span>
                        <span className="event__col">{device}</span>
                        <span className="event__col">{place}</span>
                        <span className="event__col event__col--when">{when}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        {page > 1 || hasMore ? (
          <nav aria-label="Pages" className="pager">
            {page > 1 ? (
              <Link href={href({ page: page - 1 })} className="abtn abtn--ghost abtn--sm">
                Newer
              </Link>
            ) : (
              <span />
            )}
            {hasMore ? (
              <Link href={href({ page: page + 1 })} className="abtn abtn--ghost abtn--sm">
                Older
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>
    </AdminShell>
  );
}

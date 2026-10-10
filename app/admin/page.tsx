import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { getOverview } from "@/lib/admin-data";
import { cardNumber, today } from "@/lib/format";
import { LogoMark } from "@/components/icons";
import { AdminShell } from "./_components/AdminShell";
import { EventRow } from "./_components/EventRow";
import { NameLinkForm } from "./_components/NameLinkForm";
import { Eye, Plus, QrIcon, Share } from "./_components/admin-icons";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  await requireAdmin();
  const { counts, visits, shares, recent, cards } = await getOverview();
  const c = counts ?? { total: 0, inUse: 0, cardsInUse: 0, digitalInUse: 0, unnamedCards: 0, nextUnnamed: null, lastUnnamed: null };

  return (
    <AdminShell section="overview" linkCount={c.total}>
      <main className="page">
        <header className="page__head">
          <div className="page__title">
            <span className="only-mobile page__logo">
              <LogoMark size={22} />
            </span>
            <h1>Overview</h1>
            <span className="page__date only-mobile">{today()}</span>
            <span className="page__date only-desktop">{today(true)}</span>
          </div>
          <div className="page__actions only-desktop">
            <Link href="/admin/links/new" className="abtn abtn--primary abtn--sm">
              <Plus />
              New link
            </Link>
            <Link href="/admin/generate" className="abtn abtn--ghost abtn--sm">
              <QrIcon />
              Generate batch
            </Link>
          </div>
        </header>

        <NameLinkForm cards={cards} nextUnnamed={c.nextUnnamed} />

        <div className="quick only-mobile">
          <Link href="/admin/links/new" className="abtn abtn--ghost">
            <Plus />
            New link
          </Link>
          <Link href="/admin/generate" className="abtn abtn--ghost">
            <QrIcon />
            Generate batch
          </Link>
        </div>

        <dl className="stats">
          <div className="stat">
            <dt>
              Links in use
              <span className="stat__aside">
                {c.cardsInUse} printed · {c.digitalInUse} digital
              </span>
            </dt>
            <dd>{c.inUse}</dd>
          </div>
          <div className="stat">
            <dt>Total visits</dt>
            <dd>{visits}</dd>
          </div>
          <div className="stat">
            <dt>Total shares</dt>
            <dd>{shares}</dd>
          </div>
          <div className="stat stat--accent">
            <dt>
              Unnamed printed links
              {c.nextUnnamed != null && c.lastUnnamed != null ? (
                <span className="stat__aside mono">
                  {cardNumber(c.nextUnnamed)}–{cardNumber(c.lastUnnamed)}
                </span>
              ) : null}
            </dt>
            <dd>{c.unnamedCards}</dd>
          </div>
        </dl>

        <section aria-labelledby="activity-title" className="panel activity">
          <div className="panel__head">
            <h2 id="activity-title">Recent activity</h2>
            <span className="activity__key only-desktop">
              <span>
                <Eye size={14} />
                Visit
              </span>
              <span className="accent">
                <Share size={14} />
                Share
              </span>
            </span>
          </div>
          {recent.length === 0 ? (
            <p className="panel__empty">No visits or shares yet. They appear here as soon as someone opens one of your links.</p>
          ) : (
            <>
              <div aria-hidden="true" className="activity__cols only-desktop">
                <span />
                <span>Event</span>
                <span>Device</span>
                <span>Country</span>
                <span className="right">When</span>
              </div>
              <ul className="events">
                {recent.map(({ event, link }) => (
                  <EventRow key={event.id} event={event} link={link} />
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </AdminShell>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { journey, type Station } from "@/content/journey";
import { currentlyStudying, doneStationIds, lastUpdated, next, nowStationIds, type NextItem } from "@/content/roadmap";
import { projectsEnabled } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactBlock } from "@/components/ContactBlock";
import { SkyBackground } from "@/components/SkyBackground";
import { CommandLine, Legend, StationNode, StatusChip, Tags } from "@/components/journey";
import { RichText } from "@/components/RichText";
import { ArrowDown, ArrowForward, Book, Calendar, Loop } from "@/components/icons";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/roadmap", getDictionary(lang).meta.roadmapTitle);
}

const byId = (ids: string[]) =>
  ids.map((id) => journey.find((s) => s.id === id)).filter((s): s is Station => Boolean(s));

export default async function RoadmapPage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale;
  const t = getDictionary(locale);

  const done = byId(doneStationIds);
  const now = byId(nowStationIds);
  const counts = { completed: done.length, inProgress: now.length, next: next.length };
  // "Evolves into" links: station id → the Next item that grows out of it.
  const evolvesInto = new Map(next.filter((n) => n.evolvesFrom).map((n) => [n.evolvesFrom as string, n]));

  return (
    <>
      <SiteHeader locale={locale} page="roadmap" t={t} />
      <main>
        <section aria-labelledby="page-title" className="page-hero">
          <SkyBackground compact />
          <div className="page-hero__inner">
            <p className="page-hero__eyebrow">{t.roadmap.eyebrow}</p>
            <h1 id="page-title" className="page-hero__title">
              {t.roadmap.title}
            </h1>
            <p className="updated">
              <span aria-hidden="true" className="updated__dot" />
              {t.roadmap.lastUpdated} {lastUpdated[locale]}
            </p>
            <Legend t={t} counts={counts} className="legend--inline only-mobile" />
          </div>
        </section>

        <div className="roadmap">
          <section aria-label={t.roadmap.timeline} className="roadmap__timeline">
            <ol className="timeline">
              <ZoneRow label={t.roadmap.zones.done} zone="done" />
              {done.map((s) => (
                <StationRow key={s.id} station={s} locale={locale} t={t} />
              ))}
              <ZoneRow label={t.roadmap.zones.now} zone="now" />
              {now.map((s, i) => (
                <StationRow
                  key={s.id}
                  station={s}
                  locale={locale}
                  t={t}
                  evolvesInto={evolvesInto.get(s.id)}
                  lineIntoNext={i === now.length - 1}
                />
              ))}
              <ZoneRow label={t.roadmap.zones.next} zone="next" note={t.roadmap.approximate} />
              {next.map((item, i) => (
                <NextRow key={item.id} item={item} locale={locale} t={t} last={i === next.length - 1} />
              ))}
            </ol>
          </section>

          <aside className="roadmap__aside">
            <section aria-labelledby="study-title" className="study">
              <h2 id="study-title" className="study__title">
                <Book className="icon-accent" />
                {t.roadmap.studying}
              </h2>
              <ul className="study__topics">
                {currentlyStudying.map((topic) => (
                  <li key={topic.label.en} className={`study__topic${topic.mono ? " mono" : ""}`}>
                    <RichText text={topic.label[locale]} locale={locale} />
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label={t.roadmap.legend} className="legend-card only-desktop">
              <Legend t={t} counts={counts} />
            </section>
          </aside>
        </div>

        <ContactBlock t={t} eyebrow={t.contact.eyebrow} title={t.contact.title} />
      </main>
      <SiteFooter locale={locale} t={t} />
    </>
  );
}

function ZoneRow({ label, zone, note }: { label: string; zone: "done" | "now" | "next"; note?: string }) {
  return (
    <li className={`tl-row tl-zone tl-zone--${zone}`}>
      <div className="tl-rail">
        <span aria-hidden="true" className={`tl-line tl-line--${zone === "next" ? "dashed" : "solid"} tl-line--from-marker`} />
        <span aria-hidden="true" className={`tl-diamond tl-diamond--${zone}`} />
      </div>
      <div className="tl-zone__head">
        <h2 className="tl-zone__label">
          {label}
          <span aria-hidden="true" className="tl-zone__rule" />
          {note ? <span className="tl-zone__note only-desktop">{note}</span> : null}
        </h2>
        {note ? <p className="tl-zone__note only-mobile">{note}</p> : null}
      </div>
    </li>
  );
}

function StationRow({
  station,
  locale,
  t,
  evolvesInto,
  lineIntoNext,
}: {
  station: Station;
  locale: Locale;
  t: Dictionary;
  evolvesInto?: NextItem;
  lineIntoNext?: boolean;
}) {
  const projectLink =
    projectsEnabled && station.projectSlug ? (
      <a href={`/${locale}/projects/${station.projectSlug}`} className="text-link text-link--sm">
        {t.roadmap.viewProject}
        <ArrowForward size={14} strokeWidth={2} />
      </a>
    ) : null;

  let body: ReactNode;
  if (station.status === "completed") {
    body = (
      <>
        <StatusChip status="completed" t={t} suffix={station.completedOn?.[locale]} />
        <h3 className="station__title">
          <RichText text={station.title[locale]} locale={locale} />
        </h3>
        <p className="station__text">
          <RichText text={station.description[locale]} locale={locale} />
        </p>
        {projectLink}
      </>
    );
  } else {
    body = (
      <div className="card card--glow card--lift tl-card">
        <StatusChip status={station.status} t={t} />
        <h3 className="station__title">
          <RichText text={station.title[locale]} locale={locale} />
        </h3>
        <p className="station__text">
          <RichText text={station.description[locale]} locale={locale} />
        </p>
        {station.command ? <CommandLine command={station.command} /> : null}
        <Tags tags={station.tags} />
        {projectLink || evolvesInto ? (
          <div className="tl-card__links">
            {projectLink}
            {evolvesInto ? (
              <a href={`#${evolvesInto.id}`} className="evolves evolves--into">
                <ArrowDown size={15} className="icon-accent" />
                <span>
                  {t.roadmap.evolvesInto} ·{" "}
                  <span className="mono accent-text" dir="ltr">
                    {evolvesInto.when}
                  </span>
                </span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <li id={station.id} className={`tl-row tl-station tl-station--${station.status}`}>
      <div className="tl-rail">
        {lineIntoNext ? (
          <>
            <span aria-hidden="true" className="tl-line tl-line--solid tl-line--to-node" />
            <span aria-hidden="true" className="tl-line tl-line--dashed tl-line--from-node" />
          </>
        ) : (
          <span aria-hidden="true" className="tl-line tl-line--solid" />
        )}
        <StationNode status={station.status} />
      </div>
      <div className="tl-body">{body}</div>
    </li>
  );
}

function NextRow({ item, locale, t, last }: { item: NextItem; locale: Locale; t: Dictionary; last: boolean }) {
  const origin = item.evolvesFrom ? journey.find((s) => s.id === item.evolvesFrom) : undefined;
  return (
    <li id={item.id} className={`tl-row tl-next${origin ? " tl-next--evolved" : ""}`}>
      <div className="tl-rail">
        <span aria-hidden="true" className={`tl-line tl-line--dashed${last ? " tl-line--stub" : ""}`} />
        <span aria-hidden="true" className={`node node--next${origin ? " node--evolved" : ""}`}>
          {origin ? <span className="node__ghost" /> : null}
        </span>
      </div>
      <div className="tl-body tl-next__body">
        <div className="tl-next__main">
          <h3 className="station__title">
            <RichText text={item.title[locale]} locale={locale} />
          </h3>
          <p className="station__text">
            <RichText text={item.description[locale]} locale={locale} />
          </p>
          {origin ? (
            <a href={`#${origin.id}`} className="evolves evolves--from">
              <Loop size={15} className="icon-accent" />
              <span>
                {t.roadmap.evolvesFrom}{" "}
                <span className="accent-text">
                  <RichText text={origin.title[locale]} locale={locale} />
                </span>
              </span>
            </a>
          ) : null}
        </div>
        <span className="when" dir="ltr">
          <Calendar size={13} strokeWidth={2} />
          {item.when}
        </span>
      </div>
    </li>
  );
}

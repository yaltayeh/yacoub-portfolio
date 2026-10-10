import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n";
import type { Station, StationStatus } from "@/content/journey";
import { Check } from "./icons";
import { RichText } from "./RichText";

export function Tags({ tags, future }: { tags: string[]; future?: boolean }) {
  if (tags.length === 0) return null;
  return (
    <ul className="tags" dir="ltr">
      {tags.map((tag) => (
        <li key={tag} className={`tag${future ? " tag--future" : ""}`}>
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function StatusChip({ status, t, suffix }: { status: StationStatus; t: Dictionary; suffix?: string }) {
  const label = { completed: t.status.completed, inProgress: t.status.inProgress, next: t.status.next }[status];
  return (
    <span className={`status status--${status}`}>
      {label}
      {suffix ? ` · ${suffix}` : null}
    </span>
  );
}

export function CommandLine({ command }: { command: string }) {
  return (
    <code className="command" dir="ltr">
      <span className="command__prompt">$</span> {command}
    </code>
  );
}

export function StationNode({ status }: { status: StationStatus }) {
  return (
    <span aria-hidden="true" className={`node node--${status}`}>
      {status === "completed" ? <Check size={14} /> : null}
      {status === "inProgress" ? <span className="node__pulse" /> : null}
    </span>
  );
}

/** The five-station journey on Home: a rail with nodes and the stations beside it. */
export function JourneyPath({ stations, locale, t }: { stations: Station[]; locale: Locale; t: Dictionary }) {
  return (
    <ol className="path">
      {stations.map((station, i) => {
        const following = stations[i + 1];
        const line = following ? (following.status === "next" ? "dashed" : "solid") : null;
        return (
          <li key={station.id} className={`station station--${station.status}`}>
            <div className="station__rail">
              {line ? <span aria-hidden="true" className={`station__line station__line--${line}`} /> : null}
              <StationNode status={station.status} />
            </div>
            <article className="station__body" aria-labelledby={`${station.id}-title`}>
              <StationContent station={station} locale={locale} t={t} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}

function StationContent({ station, locale, t }: { station: Station; locale: Locale; t: Dictionary }) {
  const heading = (
    <h3 id={`${station.id}-title`} className="station__title">
      <RichText text={station.title[locale]} locale={locale} />
    </h3>
  );
  const description = (
    <p className="station__text">
      <RichText text={station.description[locale]} locale={locale} />
    </p>
  );

  if (station.status === "inProgress") {
    // The card is the one thing "happening now", so it glows.
    return (
      <div className={`card card--glow station-card${station.command ? " station-card--command" : ""}`}>
        <div className="station-card__main">
          <StatusChip status={station.status} t={t} />
          {heading}
          {description}
        </div>
        {station.command ? <CommandLine command={station.command} /> : null}
        <div className="station-card__tags">
          <Tags tags={station.tags} />
        </div>
      </div>
    );
  }

  return (
    <>
      <StatusChip status={station.status} t={t} />
      {heading}
      {description}
      <Tags tags={station.tags} future={station.status === "next"} />
    </>
  );
}

export function Legend({ t, counts, className }: { t: Dictionary; counts?: Record<StationStatus, number>; className?: string }) {
  const rows: { status: StationStatus; label: string }[] = counts
    ? [
        { status: "completed", label: t.roadmap.zones.done },
        { status: "inProgress", label: t.roadmap.zones.now },
        { status: "next", label: t.roadmap.zones.next },
      ]
    : [
        { status: "completed", label: t.status.completed },
        { status: "inProgress", label: t.status.inProgress },
        { status: "next", label: t.status.next },
      ];
  return (
    <ul aria-label={t.roadmap.legend} className={`legend ${className ?? ""}`}>
      {rows.map((row) => (
        <li key={row.status} className="legend__item">
          <span aria-hidden="true" className={`legend__mark legend__mark--${row.status}`} />
          {row.label}
          {counts ? <span className="legend__count">{counts[row.status]}</span> : null}
        </li>
      ))}
    </ul>
  );
}

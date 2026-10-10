import type { ReactNode } from "react";
import { ArrowUpRight, Flag, Globe, Medal, Pin, Trophy } from "./icons";

export type HackathonCardData = {
  title: string;
  year: string;
  location: string;
  country: string;
  countryName: string;
  international: boolean;
  placement: "first" | "second" | "participated";
  postUrl: string;
  details: { label: string; text: string; highlight?: boolean }[];
  tech: string[];
};

export type HackathonCardLabels = {
  placement: Record<HackathonCardData["placement"], string>;
  international: string;
  viewPost: string;
  /** Accessible name for the link; "{title}" is replaced with the hackathon title. */
  viewPostLabel: string;
};

const placementIcon: Record<HackathonCardData["placement"], ReactNode> = {
  first: <Trophy size={15} strokeWidth={2} />,
  second: <Medal size={15} strokeWidth={2} />,
  participated: <Flag size={15} strokeWidth={2} />,
};

/** One hackathon. "View post" opens the LinkedIn post in a new tab; nothing is embedded. */
export function HackathonCard({ item, labels }: { item: HackathonCardData; labels: HackathonCardLabels }) {
  const meta = (
    <span className="hk-card__location">
      <Pin size={15} />
      {item.location}
    </span>
  );

  return (
    <article className={`hk-card hk-card--${item.placement}`}>
      <div className="hk-card__head">
        <div className="hk-card__info">
          <div className="hk-card__meta">
            <time className="hk-card__year" dateTime={item.year}>
              {item.year}
            </time>
            <span aria-hidden="true" className="hk-card__sep" />
            <abbr title={item.countryName} className="hk-card__cc">
              {item.country}
            </abbr>
            <span className="only-desktop">{meta}</span>
            {item.international ? (
              <span className="hk-card__intl">
                <Globe size={12} strokeWidth={2} />
                {labels.international}
              </span>
            ) : null}
          </div>
          <h2 className="hk-card__title">
            <bdi>{item.title}</bdi>
          </h2>
          <p className="only-mobile">{meta}</p>
        </div>
        <div className="hk-card__actions">
          <span className={`place place--${item.placement}`}>
            {placementIcon[item.placement]}
            {labels.placement[item.placement]}
          </span>
          <a
            href={item.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.viewPostLabel.replace("{title}", item.title)}
            className="btn btn--ghost btn--sm hk-card__link"
          >
            {labels.viewPost}
            <ArrowUpRight size={16} strokeWidth={2} className="icon-accent" />
          </a>
        </div>
      </div>

      {item.details.length > 0 || item.tech.length > 0 ? (
        <div className="hk-card__details">
          {item.details.map((d) => (
            <div key={d.label} className={d.highlight ? "hk-detail hk-detail--role" : "hk-detail"}>
              <h3 className="hk-detail__label">{d.label}</h3>
              <p className="hk-detail__text">{d.text}</p>
            </div>
          ))}
          {item.tech.length > 0 ? (
            <ul className="tags" dir="ltr">
              {item.tech.map((tech) => (
                <li key={tech} className="tag">
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

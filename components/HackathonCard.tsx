"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowUpRight, Briefcase, ChevronDown, Flag, Globe, Medal, Pin, Trophy } from "./icons";

export type HackathonCardData = {
  slug: string;
  title: string;
  year: string;
  location: string;
  country: string;
  countryName: string;
  international: boolean;
  placement: "first" | "second" | "participated";
  embedUrl: string;
  postUrl: string;
  details: { label: string; text: string; highlight?: boolean }[];
  tech: string[];
};

export type HackathonCardLabels = {
  placement: Record<HackathonCardData["placement"], string>;
  international: string;
  viewPost: string;
  hidePost: string;
  post: string;
  open: string;
  loadingPost: string;
};

const placementIcon: Record<HackathonCardData["placement"], ReactNode> = {
  first: <Trophy size={15} strokeWidth={2} />,
  second: <Medal size={15} strokeWidth={2} />,
  participated: <Flag size={15} strokeWidth={2} />,
};

/**
 * One hackathon. The LinkedIn embed is never loaded with the page: the iframe
 * is injected only after "View post" is pressed.
 */
export function HackathonCard({ item, labels }: { item: HackathonCardData; labels: HackathonCardLabels }) {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelId = useId();

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
            <span className="hk-card__year">{item.year}</span>
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
          <h3 className="hk-card__title">
            <bdi>{item.title}</bdi>
          </h3>
          <p className="only-mobile">{meta}</p>
        </div>
        <div className="hk-card__actions">
          <span className={`place place--${item.placement}`}>
            {placementIcon[item.placement]}
            {labels.placement[item.placement]}
          </span>
          <button
            type="button"
            className="btn btn--ghost btn--sm hk-card__toggle"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? labels.hidePost : labels.viewPost}
            <ChevronDown size={16} strokeWidth={2} className="hk-card__chevron" />
          </button>
        </div>
      </div>

      <div id={panelId} hidden={!expanded} className="hk-card__panel">
        {item.details.length > 0 || item.tech.length > 0 ? (
          <div className="hk-card__details">
            {item.details.map((d) => (
              <div key={d.label} className={d.highlight ? "hk-detail hk-detail--role" : "hk-detail"}>
                <h4 className="hk-detail__label">{d.label}</h4>
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

        <figure className="embed">
          <figcaption className="embed__bar">
            <span className="embed__label">
              <Briefcase size={14} />
              {labels.post}
            </span>
            <a href={item.postUrl} target="_blank" rel="noopener noreferrer" className="embed__open">
              {labels.open}
              <ArrowUpRight size={13} strokeWidth={2} />
            </a>
          </figcaption>
          <div className="embed__body" aria-busy={expanded && !loaded}>
            {expanded ? (
              <>
                {loaded ? null : (
                  <div role="status" className="embed__skeleton">
                    <div className="embed__skeleton-head">
                      <span className="skel skel--avatar" />
                      <span className="embed__skeleton-lines">
                        <span className="skel" style={{ width: "55%" }} />
                        <span className="skel skel--thin" style={{ width: "35%" }} />
                      </span>
                    </div>
                    <span className="skel" />
                    <span className="skel" style={{ width: "85%" }} />
                    <span className="skel skel--media" />
                    <span className="embed__loading">{labels.loadingPost}</span>
                  </div>
                )}
                <iframe
                  src={item.embedUrl}
                  title={`${labels.post}: ${item.title}`}
                  className={`embed__frame${loaded ? " is-loaded" : ""}`}
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                />
              </>
            ) : null}
          </div>
        </figure>
      </div>
    </article>
  );
}

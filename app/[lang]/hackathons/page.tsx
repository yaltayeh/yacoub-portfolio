import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { hackathons, hackathonStats, type Hackathon, type Placement } from "@/content/hackathons";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactBlock } from "@/components/ContactBlock";
import { SkyBackground } from "@/components/SkyBackground";
import { HackathonCard, type HackathonCardData } from "@/components/HackathonCard";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/hackathons", getDictionary(lang).meta.hackathonsTitle);
}

const placementKey: Record<Placement, HackathonCardData["placement"]> = {
  "1st Place": "first",
  "2nd Place": "second",
  Participated: "participated",
};

export default async function HackathonsPage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale;
  const t = getDictionary(locale);
  const stats = hackathonStats();
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  const toCard = (h: Hackathon): HackathonCardData => ({
    title: h.title,
    year: h.year,
    location: h.location[locale],
    country: h.country,
    countryName: regionNames.of(h.country) ?? h.country,
    international: h.international,
    placement: placementKey[h.placement],
    postUrl: h.postUrl,
    details: [
      { label: t.hackathons.details.problem, text: h.problem?.[locale] },
      { label: t.hackathons.details.built, text: h.built?.[locale] },
      { label: t.hackathons.details.role, text: h.role?.[locale], highlight: true },
      { label: t.hackathons.details.takeaway, text: h.takeaway?.[locale] },
    ].filter((d): d is { label: string; text: string; highlight?: boolean } => Boolean(d.text)),
    tech: h.tech ?? [],
  });

  const labels = {
    placement: {
      first: t.hackathons.placement.first,
      second: t.hackathons.placement.second,
      participated: t.hackathons.placement.participated,
    },
    international: t.hackathons.international,
    viewPost: t.hackathons.viewPost,
    viewPostLabel: t.hackathons.viewPostLabel,
  };

  return (
    <>
      <SiteHeader locale={locale} page="hackathons" t={t} />
      <main>
        <section aria-labelledby="page-title" className="page-hero">
          <SkyBackground compact />
          <div className="page-hero__inner">
            <p className="page-hero__eyebrow">{t.hackathons.eyebrow}</p>
            <h1 id="page-title" className="page-hero__title">
              {t.hackathons.title}
            </h1>
            <dl className="hk-stats">
              <div className="hk-stat">
                <dt>{t.hackathons.stats.total}</dt>
                <dd>{stats.total}</dd>
              </div>
              <div className="hk-stat hk-stat--glow">
                <dt>{t.hackathons.stats.firsts}</dt>
                <dd>
                  {stats.firsts}
                  {t.hackathons.stats.firstsSuffix}
                </dd>
              </div>
              <div className="hk-stat">
                <dt>{t.hackathons.stats.countries}</dt>
                <dd>{stats.countries}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-label={t.hackathons.list} className="hk-list">
          <ol className="hk-list__items">
            {hackathons.map((h) => (
              <li key={h.slug}>
                <HackathonCard item={toCard(h)} labels={labels} />
              </li>
            ))}
          </ol>
        </section>

        <ContactBlock t={t} eyebrow={t.contact.eyebrow} title={t.contact.title} />
      </main>
      <SiteFooter locale={locale} t={t} />
    </>
  );
}

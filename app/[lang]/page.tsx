import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { homeJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { journey } from "@/content/journey";
import { contactLinks, linkedinHandle, profile } from "@/content/profile";
import { projectsEnabled } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactBlock } from "@/components/ContactBlock";
import { SkyBackground } from "@/components/SkyBackground";
import { JourneyPath, Legend } from "@/components/journey";
import { RichText } from "@/components/RichText";
import { AddContact, ArrowDown, ArrowForward, Briefcase, Mail, Trophy } from "@/components/icons";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "home");
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale; // validated by the layout
  const t = getDictionary(locale);

  const explore = [
    { key: "roadmap", href: `/${locale}/roadmap`, title: t.nav.roadmap, text: t.home.explore.roadmap },
    ...(projectsEnabled
      ? [{ key: "projects", href: `/${locale}/projects`, title: t.nav.projects, text: t.home.explore.projects }]
      : []),
    { key: "hackathons", href: `/${locale}/hackathons`, title: t.nav.hackathons, text: t.home.explore.hackathons },
  ];

  return (
    <>
      <JsonLd data={homeJsonLd(locale)} />
      <SiteHeader locale={locale} page="home" t={t} />
      <main>
        <section aria-labelledby="hero-name" className="hero">
          <SkyBackground waves />
          <div className="hero__inner">
            <div className="hero__text">
              <div className="photo-disc only-mobile">
                <img src={profile.photo.small} alt={t.home.photoAlt} width={96} height={96} decoding="async" />
              </div>
              <p className="availability">{t.home.availability}</p>
              <h1 id="hero-name" className="hero__name">
                {profile.name[locale]}
              </h1>
              <p className="hero__lead">
                <RichText text={t.home.tagline.before} locale={locale} />
                <span className="accent-text">{t.home.tagline.accent}</span>
                {t.home.tagline.after}
              </p>
              <a href={`/${locale}/hackathons`} className="hero__cred">
                <Trophy size={16} className="icon-accent" />
                <span>
                  <RichText text={t.home.credibility} locale={locale} />
                </span>
                <ArrowForward size={14} strokeWidth={2} className="icon-accent" />
              </a>
              <div className="hero__actions">
                <a href="/contact.vcf" className="btn btn--primary">
                  <AddContact />
                  {t.home.saveContact}
                </a>
                <a href="#journey" className="btn btn--ghost">
                  <span className="only-mobile">{t.home.followJourneyShort}</span>
                  <span className="only-desktop">{t.home.followJourney}</span>
                  <ArrowDown size={16} />
                </a>
              </div>
              <div className="hero__links">
                <a href={contactLinks.email} aria-disabled={contactLinks.email ? undefined : "true"} className="hero__link" dir="ltr">
                  <Mail className="icon-accent" />
                  {profile.email}
                </a>
                <a
                  href={contactLinks.linkedin}
                  aria-disabled={contactLinks.linkedin ? undefined : "true"}
                  className="hero__link"
                  dir="ltr"
                  {...(contactLinks.linkedin ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Briefcase className="icon-accent" />
                  {linkedinHandle()}
                </a>
              </div>
            </div>
            <div className="orbit only-desktop" aria-hidden="true">
              <span className="orbit__ring orbit__ring--outer" />
              <span className="orbit__ring orbit__ring--dashed" />
              <span className="orbit__ring orbit__ring--inner" />
              <span className="orbit__dot orbit__dot--1" />
              <span className="orbit__dot orbit__dot--2" />
              <span className="orbit__dot orbit__dot--3" />
              <div className="orbit__disc">
                <img src={profile.photo.large} alt="" width={200} height={200} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section id="journey" aria-labelledby="journey-title" className="journey">
          <div className="journey__inner">
            <div className="section-intro">
              <p className="eyebrow">
                <RichText text={t.home.journey.eyebrow} locale={locale} />
              </p>
              <h2 id="journey-title" className="section-title">
                {t.home.journey.title}
              </h2>
              <p className="section-subtitle">{t.home.journey.subtitle}</p>
              <Legend t={t} className="only-desktop journey__legend" />
            </div>
            <JourneyPath stations={journey} locale={locale} t={t} />
          </div>
        </section>

        <section aria-label={t.home.background.eyebrow} className="background-note only-mobile">
          <p className="eyebrow">{t.home.background.eyebrow}</p>
          <p className="background-note__text">{t.home.background.text}</p>
          {projectsEnabled ? (
            <a href={`/${locale}/projects`} className="text-link">
              {t.home.background.projectsLink}
              <ArrowForward size={16} />
            </a>
          ) : null}
        </section>

        <section aria-labelledby="explore-title" className="explore">
          <div className="explore__inner">
            <div className="section-intro">
              <p className="eyebrow">
                <RichText text={t.home.explore.eyebrow} locale={locale} />
              </p>
              <h2 id="explore-title" className="explore__title">
                {t.home.explore.title}
              </h2>
              <p className="explore__note only-desktop">{t.home.background.text}</p>
              {projectsEnabled ? (
                <a href={`/${locale}/projects`} className="text-link only-desktop">
                  {t.home.background.projectsLink}
                  <ArrowForward size={16} />
                </a>
              ) : null}
            </div>
            <div className="explore__cards">
              {explore.map((card) => (
                <a key={card.key} href={card.href} className="explore-card">
                  <span className="explore-card__path only-desktop" dir="ltr">
                    /{card.key}
                  </span>
                  <span className="explore-card__body">
                    <span className="explore-card__title">
                      {card.title}
                      <ArrowForward size={20} className="icon-accent" />
                    </span>
                    <span className="explore-card__text">{card.text}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <ContactBlock
          t={t}
          eyebrow={t.home.contactEyebrow}
          title={t.home.contactTitle}
        />
      </main>
      <SiteFooter locale={locale} t={t} />
    </>
  );
}

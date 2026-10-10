// JSON-LD (schema.org) for search engines and AI assistants, built from the
// content files so it never drifts from what the pages say.
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n";
import { profile } from "@/content/profile";
import { hackathons } from "@/content/hackathons";
import { contentUpdated } from "@/content/site";
import { pageUrl, SITE_URL } from "./metadata";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const jobTitle: Record<Locale, string> = {
  en: "Cryptography student at 42 Amman",
  ar: "طالب تشفير في 42 عمّان",
};

/** "1st Place — MENA Devs Hackathon (Amman, Jordan, 2025)" for every placed result. */
export function hackathonAwards(): string[] {
  return hackathons
    .filter((h) => h.placement !== "Participated")
    .map((h) => `${h.placement} — ${h.title} (${h.location.en}, ${h.year})`);
}

function person(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name.en,
    alternateName: ["Yacoub Altayeh", profile.name.ar],
    url: SITE_URL,
    image: `${SITE_URL}/images/portrait.png`,
    email: `mailto:${profile.email}`,
    jobTitle: jobTitle[locale],
    description: getDictionary(locale).meta.pages.home.description,
    affiliation: { "@type": "EducationalOrganization", name: "42 Amman" },
    knowsAbout: [
      "Cryptography",
      "Post-Quantum Cryptography",
      "ML-KEM",
      "ML-DSA",
      "Embedded Systems",
      "ESP32",
      "Networking",
      "Web Development",
    ],
    sameAs: [profile.linkedin, profile.github],
    award: hackathonAwards(),
  };
}

/** Home: the Person, the WebSite, and the ProfilePage that is about the Person. */
export function homeJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const url = pageUrl(locale, "home");
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(locale),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: profile.name.en,
        inLanguage: ["en", "ar"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: t.meta.pages.home.title,
        description: t.meta.pages.home.description,
        inLanguage: locale,
        dateModified: contentUpdated,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
      },
    ],
  };
}

/** Hackathons: an ItemList of the events, in the order shown on the page. */
export function hackathonsJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const regions = new Intl.DisplayNames(["en"], { type: "region" });
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.meta.pages.hackathons.title,
    url: pageUrl(locale, "hackathons"),
    numberOfItems: hackathons.length,
    itemListElement: hackathons.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: `${h.title} ${h.year}`,
        startDate: h.year,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: h.location.en,
          address: { "@type": "PostalAddress", addressLocality: h.location.en.split(",")[0], addressCountry: h.country },
        },
        url: h.postUrl,
        description: `${profile.name.en}: ${h.placement}${h.international ? " (international)" : ""}, ${h.location.en}, ${regions.of(h.country) ?? h.country}.`,
        performer: { "@id": PERSON_ID },
      },
    })),
  };
}

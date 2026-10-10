// /llms.txt and /llms-full.txt: plain-Markdown versions of the site for AI
// assistants (https://llmstxt.org). Generated from the same content files and
// dictionaries as the pages, so they always say what the site says.
import { locales, type Locale } from "./i18n";
import { getDictionary } from "@/i18n";
import { profile } from "@/content/profile";
import { journey, type Station } from "@/content/journey";
import { currentlyStudying, doneStationIds, lastUpdated, next, nowStationIds } from "@/content/roadmap";
import { hackathons, hackathonStats } from "@/content/hackathons";
import { pageUrl, publicPages, SITE_URL } from "./metadata";

/** Removes the backticks used to mark code names in content. */
const plain = (text: string) => text.replace(/`/g, "");

const stationLine = (s: Station, locale: Locale) => {
  const t = getDictionary(locale);
  const status = { completed: t.status.completed, inProgress: t.status.inProgress, next: t.status.next }[s.status];
  const tags = s.tags.length ? ` (${s.tags.join(", ")})` : "";
  return `- **${plain(s.title[locale])}** — ${status}. ${plain(s.description[locale])}${tags}`;
};

export function llmsTxt(): string {
  const t = getDictionary("en");
  const stats = hackathonStats();
  const placed = hackathons.filter((h) => h.placement !== "Participated");
  const lines = [
    `# ${profile.name.en}`,
    "",
    `> ${t.meta.pages.home.description}`,
    "",
    `${profile.name.en} (Arabic: ${profile.name.ar}; also written Yacoub Altayeh) is a student at 42 Amman in Jordan. He builds cryptography from scratch in C and is heading toward post-quantum cryptography (ML-KEM, ML-DSA). He is open to opportunities in cryptography. Web development is his background and a supporting strength.`,
    "",
    "## Journey",
    "",
    ...journey.map((s) => stationLine(s, "en")),
    "",
    "## Next on the roadmap",
    "",
    ...next.map((n) => `- **${plain(n.title.en)}** (${n.when}): ${plain(n.description.en)}`),
    "",
    "## Hackathons",
    "",
    `${stats.total} hackathons, ${stats.firsts} first places, in ${stats.countries} countries.`,
    "",
    ...hackathons.map((h) => `- ${h.year} — **${h.title}**, ${h.location.en}: ${h.placement}${h.international ? " (international)" : ""}. ${h.postUrl}`),
    "",
    `Awards: ${placed.map((h) => `${h.placement} at ${h.title} (${h.year})`).join("; ")}.`,
    "",
    "## Pages",
    "",
    ...publicPages.map((p) => `- [${t.meta.pages[p.key].title}](${pageUrl("en", p.key)}): ${t.meta.pages[p.key].description}`),
    ...publicPages.map((p) => `- [${getDictionary("ar").meta.pages[p.key].title}](${pageUrl("ar", p.key)}): Arabic version.`),
    "",
    "## Contact",
    "",
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    `- Contact card (vCard): ${SITE_URL}/contact.vcf`,
    "",
    "## Optional",
    "",
    `- [Full text of every page in English and Arabic](${SITE_URL}/llms-full.txt)`,
    "",
  ];
  return lines.join("\n");
}

function pageText(locale: Locale): string[] {
  const t = getDictionary(locale);
  const stats = hackathonStats();
  const byId = (ids: string[]) => ids.map((id) => journey.find((s) => s.id === id)).filter((s): s is Station => Boolean(s));
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const placement = { "1st Place": t.hackathons.placement.first, "2nd Place": t.hackathons.placement.second, Participated: t.hackathons.placement.participated };

  return [
    `## ${t.meta.pages.home.title}`,
    `URL: ${pageUrl(locale, "home")}`,
    "",
    `# ${profile.name[locale]}`,
    "",
    t.home.availability,
    "",
    `${t.home.tagline.before}${t.home.tagline.accent}${t.home.tagline.after}`,
    "",
    t.home.credibility,
    "",
    `### ${t.home.journey.title}`,
    "",
    t.home.journey.subtitle,
    "",
    ...journey.map((s) => stationLine(s, locale)),
    "",
    t.home.background.text,
    "",
    `### ${t.home.contactTitle}`,
    "",
    `${t.contact.email}: ${profile.email} · ${t.contact.linkedin}: ${profile.linkedin} · ${t.contact.github}: ${profile.github}`,
    "",
    `## ${t.meta.pages.roadmap.title}`,
    `URL: ${pageUrl(locale, "roadmap")}`,
    "",
    `# ${t.roadmap.title}`,
    "",
    `${t.roadmap.lastUpdated} ${lastUpdated[locale]}`,
    "",
    `### ${t.roadmap.zones.done}`,
    ...byId(doneStationIds).map((s) => stationLine(s, locale)),
    "",
    `### ${t.roadmap.zones.now}`,
    ...byId(nowStationIds).map((s) => stationLine(s, locale)),
    "",
    `### ${t.roadmap.zones.next} (${t.roadmap.approximate})`,
    ...next.map((n) => `- **${plain(n.title[locale])}** (${n.when}): ${plain(n.description[locale])}`),
    "",
    `### ${t.roadmap.studying}`,
    currentlyStudying.map((c) => c.label[locale]).join(", "),
    "",
    `## ${t.meta.pages.hackathons.title}`,
    `URL: ${pageUrl(locale, "hackathons")}`,
    "",
    `# ${t.hackathons.title}`,
    "",
    `${t.hackathons.stats.total}: ${stats.total} · ${t.hackathons.stats.firsts}: ${stats.firsts} · ${t.hackathons.stats.countries}: ${stats.countries}`,
    "",
    ...hackathons.map(
      (h) =>
        `- ${h.year} — **${h.title}**, ${h.location[locale]} (${regions.of(h.country) ?? h.country}): ${placement[h.placement]}${h.international ? ` · ${t.hackathons.international}` : ""}. ${h.postUrl}`,
    ),
    "",
  ];
}

export function llmsFullTxt(): string {
  return [
    `# ${profile.name.en} — full site text`,
    "",
    `> Every public page of ${SITE_URL}, in English and Arabic. Summary: ${SITE_URL}/llms.txt`,
    "",
    ...locales.flatMap((l) => [`# ${l === "en" ? "English" : "العربية (Arabic)"}`, "", ...pageText(l)]),
  ].join("\n");
}

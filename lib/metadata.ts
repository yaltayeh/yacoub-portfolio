import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n";
import { SITE_HOST } from "./site";

export const SITE_URL = `https://${SITE_HOST}`;

/** The public pages, in nav order. Shared by metadata, the sitemap and llms.txt. */
export const publicPages = [
  { key: "home", path: "" },
  { key: "roadmap", path: "/roadmap" },
  { key: "hackathons", path: "/hackathons" },
] as const;
export type PublicPage = (typeof publicPages)[number]["key"];

export const pagePath = (page: PublicPage) => publicPages.find((p) => p.key === page)?.path ?? "";
export const pageUrl = (locale: Locale, page: PublicPage) => `${SITE_URL}/${locale}${pagePath(page)}`;

const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_AR" };

/**
 * Metadata for a public page:
 * - `<title>` and description for search: unique per page and locale.
 * - Open Graph / Twitter for shares: the same personal greeting on every page.
 * - Canonical URL never with ?l= (shares of tracked links point at the clean
 *   page), plus hreflang alternates (en, ar, x-default → en).
 */
export function pageMetadata(locale: Locale, page: PublicPage): Metadata {
  const t = getDictionary(locale);
  const { title, description } = t.meta.pages[page];
  const path = pagePath(page);
  const url = `/${locale}${path}`;
  const image = {
    url: `/og/og-${locale}.png`,
    width: 1200,
    height: 630,
    alt: t.meta.ogTitle,
    type: "image/png",
  };
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `/en${path}`, ar: `/ar${path}`, "x-default": `/en${path}` },
    },
    openGraph: {
      type: page === "home" ? "profile" : "website",
      siteName: "Yacoub Altaieh",
      url,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[locale === "en" ? "ar" : "en"]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      images: [image.url],
    },
  };
}

export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.ico", sizes: "48x48" },
  ],
  apple: "/apple-touch-icon.png",
};

import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n";
import { SITE_HOST } from "./site";

export const SITE_URL = `https://${SITE_HOST}`;

const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_AR" };

/**
 * Metadata for a public page: title, description, canonical URL (never with
 * ?l=, so shares of tracked links point at the clean page), hreflang
 * alternates, and Open Graph / Twitter tags with the per-locale preview image.
 *
 * `path` is the page path without the locale: "" for Home, "/roadmap", ...
 */
export function pageMetadata(locale: Locale, path: string, title?: string): Metadata {
  const t = getDictionary(locale);
  const pageTitle = title ?? t.meta.homeTitle;
  const url = `/${locale}${path}`;
  const image = {
    url: `/og/og-${locale}.png`,
    width: 1200,
    height: 630,
    alt: t.meta.homeTitle,
    type: "image/png",
  };
  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description: t.meta.description,
    alternates: {
      canonical: url,
      languages: { en: `/en${path}`, ar: `/ar${path}`, "x-default": `/en${path}` },
    },
    openGraph: {
      type: "website",
      siteName: "Yacoub Altaieh",
      url,
      // The Home share title is the BUILD.md one; other pages keep their own name.
      title: pageTitle,
      description: t.meta.description,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[locale === "en" ? "ar" : "en"]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: t.meta.description,
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

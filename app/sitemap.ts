import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { pageUrl, publicPages } from "@/lib/metadata";
import { lastUpdatedISO } from "@/content/roadmap";
import { contentUpdated } from "@/content/site";

// Every public page in both locales, with hreflang alternates and lastmod
// taken from the content files (the Roadmap has its own "last updated").
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.flatMap(({ key }) =>
    locales.map((locale) => ({
      url: pageUrl(locale, key),
      lastModified: key === "roadmap" ? `${lastUpdatedISO}-01` : contentUpdated,
      changeFrequency: "monthly" as const,
      priority: key === "home" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, pageUrl(l, key)])),
          "x-default": pageUrl("en", key),
        },
      },
    })),
  );
}

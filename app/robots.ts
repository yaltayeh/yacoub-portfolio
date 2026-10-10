import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

// The admin and API are private, and tracked links (/l/, /L/) are personal entry
// points, not pages. Everything else is open, to search engines and to AI
// crawlers alike (named explicitly so it's a clear choice, not an accident).
const disallow = ["/admin", "/api/", "/l/", "/L/"];
const aiCrawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

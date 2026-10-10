import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin is private, and tracked links are personal entry points, not pages.
      disallow: ["/admin", "/api/", "/l/", "/L/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

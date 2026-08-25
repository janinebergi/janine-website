import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nur die Such-API wird ausgesperrt. Impressum und Datenschutz stehen
      // bewusst NICHT hier: Sie tragen ein noindex im <head>, und das kann
      // Google nur lesen, wenn die Seiten crawlbar bleiben.
      disallow: ["/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

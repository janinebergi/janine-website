import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/leistungen", "/arbeiten", "/ueber-mich", "/blog", "/kontakt"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
    }),
  );

  const posts = getPostSlugs().map((slug) => ({
    url: `${site.url}/blog/${slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...posts];
}

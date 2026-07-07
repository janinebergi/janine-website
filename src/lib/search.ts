import { getAllPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";

export type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: "page" | "blog";
};

// metaTitle-Felder enthalten den Marken-Suffix ("… | Janine"), für die
// Sucherergebnisse reicht der erste Teil.
function shortTitle(raw: string): string {
  return raw.split("|")[0].trim();
}

export function getSearchIndex(lang: Lang): SearchItem[] {
  const { site, pages } = getSiteContent(lang);

  const staticPages: SearchItem[] = [
    {
      title: `${site.name} — ${site.role}`,
      description: site.description,
      url: "/",
      type: "page",
    },
    {
      title: shortTitle(pages.leistungen.metaTitle),
      description: pages.leistungen.metaDescription,
      url: "/leistungen",
      type: "page",
    },
    {
      title: shortTitle(pages.ueberMich.metaTitle),
      description: pages.ueberMich.metaDescription,
      url: "/ueber-mich",
      type: "page",
    },
    {
      title: shortTitle(pages.blog.metaTitle),
      description: pages.blog.metaDescription,
      url: "/blog",
      type: "page",
    },
    {
      title: shortTitle(pages.mediakit.metaTitle),
      description: pages.mediakit.metaDescription,
      url: "/mediakit",
      type: "page",
    },
    {
      title: shortTitle(pages.kontakt.metaTitle),
      description: pages.kontakt.metaDescription,
      url: "/kontakt",
      type: "page",
    },
    {
      title: shortTitle(pages.impressum.metaTitle),
      description: pages.impressum.metaDescription,
      url: "/impressum",
      type: "page",
    },
    {
      title: shortTitle(pages.datenschutz.metaTitle),
      description: pages.datenschutz.metaDescription,
      url: "/datenschutz",
      type: "page",
    },
  ];

  const blogPosts: SearchItem[] = getAllPosts(lang).map((post) => ({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    type: "blog",
  }));

  return [...staticPages, ...blogPosts];
}

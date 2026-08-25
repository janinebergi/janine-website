import { getPostSlugs, getPostBySlug } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import {
  aboutPath,
  blogPath,
  contactPath,
  homePath,
  imprintPath,
  postPath,
  privacyPath,
} from "@/lib/routes";

export type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: "page" | "blog";
  // Zusätzlicher, nicht angezeigter Text (Seiteninhalt, Blogtext, FAQ, Tags)
  // für die Volltextsuche – nur Titel & description werden im Dropdown gezeigt.
  content: string;
};

// metaTitle-Felder enthalten den Marken-Suffix ("… | Janine"), für die
// Sucherergebnisse reicht der erste Teil.
function shortTitle(raw: string): string {
  return raw.split("|")[0].trim();
}

// Sammelt rekursiv alle String-Werte eines Content-Objekts (z. B. einer
// kompletten Seite aus site.json) – Bild-/Datei-Pfade werden ausgeschlossen,
// damit die Suche nicht auf Asset-URLs anschlägt.
function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    if (!/^(https?:\/\/|\/)/.test(value)) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, out));
  }
}

function pageContentText(pageContent: unknown): string {
  const parts: string[] = [];
  collectStrings(pageContent, parts);
  return parts.join(" ");
}

// Entfernt Markdown-/JSX-Syntax aus dem Blog-Body, damit reiner Lesetext für
// die Volltextsuche übrig bleibt.
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchIndex(lang: Lang): SearchItem[] {
  const { site, pages } = getSiteContent(lang);

  const staticPages: SearchItem[] = [
    {
      title: `${site.name} — ${site.role}`,
      description: site.description,
      url: homePath(lang),
      type: "page",
      content: pageContentText(pages.home),
    },
    {
      title: shortTitle(pages.ueberMich.metaTitle),
      description: pages.ueberMich.metaDescription,
      url: aboutPath(lang),
      type: "page",
      content: pageContentText(pages.ueberMich),
    },
    {
      title: shortTitle(pages.blog.metaTitle),
      description: pages.blog.metaDescription,
      url: blogPath(lang),
      type: "page",
      content: pageContentText(pages.blog),
    },
    {
      title: shortTitle(pages.kontakt.metaTitle),
      description: pages.kontakt.metaDescription,
      url: contactPath(lang),
      type: "page",
      content: pageContentText(pages.kontakt),
    },
    {
      title: shortTitle(pages.impressum.metaTitle),
      description: pages.impressum.metaDescription,
      url: imprintPath(lang),
      type: "page",
      content: pageContentText(pages.impressum),
    },
    {
      title: shortTitle(pages.datenschutz.metaTitle),
      description: pages.datenschutz.metaDescription,
      url: privacyPath(lang),
      type: "page",
      content: pageContentText(pages.datenschutz),
    },
  ];

  const blogPosts: SearchItem[] = getPostSlugs()
    .map((slug) => getPostBySlug(slug, lang))
    .filter((post) => post !== null)
    .map((post) => ({
      title: post.title,
      description: post.excerpt,
      url: postPath(lang, post.slug),
      type: "blog" as const,
      content: [
        post.country,
        post.tags.join(" "),
        stripMarkdown(post.content),
        post.faq.map((item) => `${item.question} ${item.answer}`).join(" "),
      ].join(" "),
    }));

  return [...staticPages, ...blogPosts];
}

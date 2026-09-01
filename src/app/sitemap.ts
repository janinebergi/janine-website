import type { MetadataRoute } from "next";
import { getAllPosts, getPostIds, getPostById, postSlugFor } from "@/lib/blog";
import { getCountries, getTopics, isIndexable } from "@/lib/archives";
import type { Lang } from "@/lib/i18n-constants";
import type { PathSet } from "@/lib/routes";
import {
  aboutPath,
  absoluteUrl,
  blogPath,
  contactPath,
  countryPath,
  homePath,
  postPath,
  topicPath,
} from "@/lib/routes";

type Entry = MetadataRoute.Sitemap[number];

function archivePaths(
  build: (lang: Lang, slug: string) => string,
  lang: Lang,
  slug: string,
  altSlug: string | null,
): PathSet {
  const other: Lang = lang === "de" ? "en" : "de";
  return {
    [lang]: build(lang, slug),
    ...(altSlug ? { [other]: build(other, altSlug) } : {}),
  };
}

const countryPaths = (lang: Lang, slug: string, alt: string | null) =>
  archivePaths(countryPath, lang, slug, alt);
const topicPaths = (lang: Lang, slug: string, alt: string | null) =>
  archivePaths(topicPath, lang, slug, alt);

// Bild-Sitemap: Zu jeder Beitrags-URL kommen Titelbild und Galeriefotos.
// Damit findet Google die Fotos für die Bildersuche – bei einem Reiseblog
// eine eigene Besucherquelle. Die Dateinamen enthalten Leer- und Sonderzeichen
// und müssen deshalb kodiert werden.
function postImages(post: { coverImage: string; gallery: { src: string }[] }): string[] {
  return [post.coverImage, ...post.gallery.map((image) => image.src)]
    .filter((src) => src.startsWith("/"))
    .map((src) => absoluteUrl(encodePath(src)));
}

// Die Bilddateien heißen z. B. "Janine&Philipp.avif" oder enthalten
// Leerzeichen. encodeURI lässt das & stehen, und ein rohes & macht die
// Sitemap als XML ungültig – deshalb Segment für Segment kodieren.
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

function alternateLanguages(paths: PathSet): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const [code, path] of Object.entries(paths)) {
    if (path) languages[code] = absoluteUrl(path);
  }
  const fallback = paths.de ?? paths.en;
  if (fallback) languages["x-default"] = absoluteUrl(fallback);
  return languages;
}

// Jede Seite steht einmal pro Sprache drin und verweist über `alternates` auf
// die jeweils andere Fassung – das ist dasselbe hreflang-Signal wie im <head>,
// nur an der Stelle, an der Google es beim Crawlen zuerst sieht.
function entry(
  paths: PathSet,
  lang: Lang,
  extra: Omit<Entry, "url" | "alternates"> = {},
): Entry {
  return {
    url: absoluteUrl(paths[lang]!),
    alternates: { languages: alternateLanguages(paths) },
    ...extra,
  };
}

// Jüngstes Beitragsdatum – als lastModified für die Übersichtsseiten.
function latestDate(lang: Lang): Date {
  const posts = getAllPosts(lang);
  return new Date(posts[0]?.date ?? Date.now());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const langs: Lang[] = ["de", "en"];
  const urls: Entry[] = [];

  for (const lang of langs) {
    const newest = latestDate(lang);

    urls.push(
      entry({ de: homePath("de"), en: homePath("en") }, lang, {
        lastModified: newest,
        changeFrequency: "weekly",
        priority: 1,
      }),
      entry({ de: blogPath("de"), en: blogPath("en") }, lang, {
        lastModified: newest,
        changeFrequency: "weekly",
        priority: 0.9,
      }),
      entry({ de: aboutPath("de"), en: aboutPath("en") }, lang, {
        changeFrequency: "monthly",
        priority: 0.7,
      }),
      entry({ de: contactPath("de"), en: contactPath("en") }, lang, {
        changeFrequency: "yearly",
        priority: 0.5,
      }),
    );

    // Beiträge: echtes Veröffentlichungsdatum statt "heute".
    for (const id of getPostIds()) {
      const post = getPostById(id, lang);
      if (!post) continue;
      urls.push(
        entry(
          {
            de: postPath("de", postSlugFor(id, "de")),
            en: postPath("en", postSlugFor(id, "en")),
          },
          lang,
          {
            lastModified: new Date(post.date),
            changeFrequency: "yearly",
            priority: 0.8,
            images: postImages(post),
          },
        ),
      );
    }

    // Nur Archive, die auch ein index-Signal tragen. Eine Sitemap, die auf
    // noindex-Seiten zeigt, sendet zwei widersprüchliche Signale.
    for (const country of getCountries(lang).filter(isIndexable)) {
      urls.push(
        entry(
          countryPaths(lang, country.slug, country.altSlug),
          lang,
          {
            lastModified: new Date(country.posts[0].date),
            changeFrequency: "monthly",
            priority: 0.6,
          },
        ),
      );
    }

    for (const topic of getTopics(lang)) {
      urls.push(
        entry(
          topicPaths(lang, topic.slug, topic.altSlug),
          lang,
          {
            lastModified: new Date(topic.posts[0].date),
            changeFrequency: "monthly",
            priority: 0.6,
          },
        ),
      );
    }
  }

  return urls;
}

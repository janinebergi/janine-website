import type { MetadataRoute } from "next";
import { getAllPosts, getPostSlugs, getPostBySlug } from "@/lib/blog";
import { getCountries, getTopics } from "@/lib/archives";
import type { Lang } from "@/lib/i18n-constants";
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

// Jede Seite steht einmal pro Sprache drin und verweist über `alternates` auf
// die jeweils andere Fassung – das ist dasselbe hreflang-Signal wie im <head>,
// nur an der Stelle, an der Google es beim Crawlen zuerst sieht.
function entry(
  paths: Record<Lang, string>,
  lang: Lang,
  extra: Omit<Entry, "url" | "alternates"> = {},
): Entry {
  return {
    url: absoluteUrl(paths[lang]),
    alternates: {
      languages: {
        de: absoluteUrl(paths.de),
        en: absoluteUrl(paths.en),
        "x-default": absoluteUrl(paths.de),
      },
    },
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
    for (const slug of getPostSlugs()) {
      const post = getPostBySlug(slug, lang);
      if (!post) continue;
      urls.push(
        entry({ de: postPath("de", slug), en: postPath("en", slug) }, lang, {
          lastModified: new Date(post.date),
          changeFrequency: "yearly",
          priority: 0.8,
        }),
      );
    }

    for (const country of getCountries(lang)) {
      const own = country.slug;
      const alt = country.altSlug;
      urls.push(
        entry(
          {
            de: countryPath("de", lang === "de" ? own : alt),
            en: countryPath("en", lang === "en" ? own : alt),
          },
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
      const own = topic.slug;
      const alt = topic.altSlug;
      urls.push(
        entry(
          {
            de: topicPath("de", lang === "de" ? own : alt),
            en: topicPath("en", lang === "en" ? own : alt),
          },
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

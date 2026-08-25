// Einzige Quelle der Wahrheit für alle internen Pfade. Deutsch liegt auf der
// Wurzel (/blog, /ueber-mich …), Englisch unter /en (/en/blog, /en/about …).
// Jede Seite existiert damit unter einer eigenen URL – Voraussetzung dafür,
// dass Google beide Sprachfassungen indexieren und per hreflang verknüpfen
// kann.
import { site } from "@/lib/site";
import { slugify } from "@/lib/slugify";
import type { Lang } from "@/lib/i18n-constants";

export const LANGS: readonly Lang[] = ["de", "en"] as const;

const PREFIX: Record<Lang, string> = { de: "", en: "/en" };

const SEGMENT = {
  de: {
    blog: "blog",
    about: "ueber-mich",
    contact: "kontakt",
    imprint: "impressum",
    privacy: "datenschutz",
    country: "land",
    topic: "thema",
  },
  en: {
    blog: "blog",
    about: "about",
    contact: "contact",
    imprint: "imprint",
    privacy: "privacy",
    country: "country",
    topic: "topic",
  },
} as const;

function join(lang: Lang, ...parts: string[]): string {
  const path = [PREFIX[lang], ...parts].filter(Boolean).join("/");
  return path.startsWith("/") ? path : `/${path}`;
}

export const homePath = (lang: Lang): string => PREFIX[lang] || "/";
export const blogPath = (lang: Lang): string => join(lang, SEGMENT[lang].blog);
export const postPath = (lang: Lang, slug: string): string =>
  join(lang, SEGMENT[lang].blog, slug);
export const countryPath = (lang: Lang, country: string): string =>
  join(lang, SEGMENT[lang].blog, SEGMENT[lang].country, slugify(country));
export const topicPath = (lang: Lang, tag: string): string =>
  join(lang, SEGMENT[lang].blog, SEGMENT[lang].topic, slugify(tag));
export const aboutPath = (lang: Lang): string => join(lang, SEGMENT[lang].about);
export const contactPath = (lang: Lang): string => join(lang, SEGMENT[lang].contact);
export const imprintPath = (lang: Lang): string => join(lang, SEGMENT[lang].imprint);
export const privacyPath = (lang: Lang): string => join(lang, SEGMENT[lang].privacy);
export const feedPath = (lang: Lang): string => join(lang, "feed.xml");

export function absoluteUrl(path: string): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}

// Baut `canonical` plus die hreflang-Verweise auf die jeweils andere Sprache.
// x-default zeigt auf die deutsche Fassung, weil das die Hauptsprache ist.
export type PathSet = Partial<Record<Lang, string>>;

export function localeAlternates(lang: Lang, paths: PathSet) {
  const own = paths[lang];
  if (!own) throw new Error(`Kein Pfad für Sprache ${lang}`);

  const languages: Record<string, string> = {};
  for (const code of LANGS) {
    const path = paths[code];
    if (path) languages[code] = absoluteUrl(path);
  }
  languages["x-default"] = absoluteUrl(paths.de ?? own);

  return { canonical: absoluteUrl(own), languages };
}

// Kürzel für Seiten, die in beiden Sprachen über denselben Builder laufen.
export function pathsFor(build: (lang: Lang) => string): PathSet {
  return { de: build("de"), en: build("en") };
}

export const OPEN_GRAPH_LOCALE: Record<Lang, string> = {
  de: "de_DE",
  en: "en_US",
};

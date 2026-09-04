// Länder- und Themenseiten. Sie bündeln die Beiträge zu einem Reiseziel bzw.
// Thema unter einer eigenen URL – das gibt der Seite zusätzliche Landepunkte
// für Suchanfragen wie „Reisebericht Marokko" und verlinkt die Beiträge
// untereinander.
import { getPostIds, getPostById, type PostMeta } from "@/lib/blog";
import { slugify } from "@/lib/slugify";
import type { Lang } from "@/lib/i18n-constants";

export type ArchiveEntry = {
  // Anzeigename in der jeweiligen Sprache ("Indonesien" / "Indonesia")
  name: string;
  // URL-Segment in der jeweiligen Sprache
  slug: string;
  // Dasselbe Archiv in der anderen Sprache – für Sprachumschalter und
  // hreflang. null, wenn es dort kein Gegenstück gibt (dann darf auch kein
  // hreflang darauf zeigen, sonst verweist es ins Leere).
  altSlug: string | null;
  posts: PostMeta[];
};

type Pair = { de: PostMeta; en: PostMeta };

function pairs(): Pair[] {
  return getPostIds().map((id) => ({
    // getPostById fällt für fehlende Übersetzungen auf Deutsch zurück,
    // beide Seiten sind also immer belegt.
    de: getPostById(id, "de")!,
    en: getPostById(id, "en")!,
  }));
}

const OTHER: Record<Lang, Lang> = { de: "en", en: "de" };

// Sammelt Archive aus einer Wertfunktion (Land oder Tags) und hält dabei die
// Zuordnung zwischen deutscher und englischer Schreibweise fest.
function collect(
  lang: Lang,
  values: (post: PostMeta) => string[],
): ArchiveEntry[] {
  const other = OTHER[lang];
  const bySlug = new Map<string, ArchiveEntry>();

  for (const pair of pairs()) {
    const own = values(pair[lang]);
    const alt = values(pair[other]);

    own.forEach((name, index) => {
      if (!name) return;
      const slug = slugify(name);
      if (!slug) return;
      const entry = bySlug.get(slug) ?? {
        name,
        slug,
        altSlug: slugify(alt[index] ?? name) || slug,
        posts: [],
      };
      entry.posts.push(pair[lang]);
      bySlug.set(slug, entry);
    });
  }

  return [...bySlug.values()]
    .map((entry) => ({
      ...entry,
      posts: entry.posts.sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

const countryValues = (post: PostMeta) => (post.country ? [post.country] : []);

export function getCountries(lang: Lang): ArchiveEntry[] {
  return withValidAlt(collect(lang, countryValues), collect(OTHER[lang], countryValues));
}

// Entfernt Verweise auf Archive, die es in der anderen Sprache nicht gibt.
function withValidAlt(own: ArchiveEntry[], other: ArchiveEntry[]): ArchiveEntry[] {
  const available = new Set(other.map((entry) => entry.slug));
  return own.map((entry) => ({
    ...entry,
    altSlug: entry.altSlug && available.has(entry.altSlug) ? entry.altSlug : null,
  }));
}

// Ein Archiv mit nur einem Beitrag wiederholt bloß dessen Link und hat sonst
// keinen eigenen Inhalt – für Suchmaschinen eine leere Seite. Ab zwei Beiträgen
// ist es eine echte Übersicht.
export const MIN_POSTS_FOR_INDEX = 2;

export function isIndexable(entry: ArchiveEntry): boolean {
  return entry.posts.length >= MIN_POSTS_FOR_INDEX;
}

// Ein Tag, den *jeder* Beitrag trägt (z. B. „Reise"), wäre nur eine Kopie der
// Blog-Übersicht; Tags mit nur einem Beitrag wären zu dünn. Beides fliegt raus,
// damit keine überflüssigen Seiten in den Index geraten.
export function getTopics(lang: Lang): ArchiveEntry[] {
  const total = getPostIds().length;
  const worthOwnPage = (entry: ArchiveEntry) =>
    isIndexable(entry) && entry.posts.length < total;

  return withValidAlt(
    collect(lang, (post) => post.tags).filter(worthOwnPage),
    collect(OTHER[lang], (post) => post.tags).filter(worthOwnPage),
  );
}

export function getCountry(lang: Lang, slug: string): ArchiveEntry | null {
  return getCountries(lang).find((entry) => entry.slug === slug) ?? null;
}

export function getTopic(lang: Lang, slug: string): ArchiveEntry | null {
  return getTopics(lang).find((entry) => entry.slug === slug) ?? null;
}

// „Thema USA" und „Land USA" listen dieselben zwei Beiträge – für Google sind
// das zwei Fassungen derselben Seite. Doppelte Seiten teilen ihre Signale auf
// und kosten Crawl-Budget, das gerade bei einer jungen Domain knapp ist.
// Deshalb bleibt nur das Länder-Archiv im Index; das Themen-Archiv trägt ein
// noindex und fehlt in der Sitemap, bleibt für Besucher aber erreichbar.
export function duplicatesCountry(lang: Lang, entry: ArchiveEntry): boolean {
  const own = postKey(entry);
  return getCountries(lang).some((country) => postKey(country) === own);
}

// Vergleicht Archive über ihre Beiträge, nicht über den Namen: Es geht darum,
// ob dieselbe Liste zweimal unter verschiedenen Adressen steht.
function postKey(entry: ArchiveEntry): string {
  return entry.posts
    .map((post) => post.id)
    .sort()
    .join("|");
}

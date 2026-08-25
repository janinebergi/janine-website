// Länder- und Themenseiten. Sie bündeln die Beiträge zu einem Reiseziel bzw.
// Thema unter einer eigenen URL – das gibt der Seite zusätzliche Landepunkte
// für Suchanfragen wie „Reisebericht Marokko" und verlinkt die Beiträge
// untereinander.
import { getPostSlugs, getPostBySlug, type PostMeta } from "@/lib/blog";
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
  return getPostSlugs().map((slug) => ({
    // getPostBySlug fällt für fehlende Übersetzungen auf Deutsch zurück,
    // beide Seiten sind also immer belegt.
    de: getPostBySlug(slug, "de")!,
    en: getPostBySlug(slug, "en")!,
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

// Ein Tag, den *jeder* Beitrag trägt (z. B. „Reise"), wäre nur eine Kopie der
// Blog-Übersicht; Tags mit nur einem Beitrag wären zu dünn. Beides fliegt raus,
// damit keine überflüssigen Seiten in den Index geraten.
export function getTopics(lang: Lang): ArchiveEntry[] {
  const total = getPostSlugs().length;
  const worthOwnPage = (entry: ArchiveEntry) =>
    entry.posts.length >= 2 && entry.posts.length < total;

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

// Zuordnung „Pfad in Sprache A → derselbe Inhalt in Sprache B". Der
// Sprachumschalter im Header bekommt diese Tabelle als Prop und wird dadurch
// zu einem echten Link auf die Übersetzung – statt wie vorher nur ein Cookie
// zu setzen. Genau diese Links braucht Google, um beide Fassungen zu finden.
import { getPostIds, postSlugFor } from "@/lib/blog";
import { getCountries, getTopics } from "@/lib/archives";
import type { Lang } from "@/lib/i18n-constants";
import {
  aboutPath,
  blogPath,
  contactPath,
  countryPath,
  homePath,
  imprintPath,
  postPath,
  privacyPath,
  topicPath,
} from "@/lib/routes";

const OTHER: Record<Lang, Lang> = { de: "en", en: "de" };

export function getLangPaths(from: Lang): Record<string, string> {
  const to = OTHER[from];
  const map: Record<string, string> = {
    [homePath(from)]: homePath(to),
    [blogPath(from)]: blogPath(to),
    [aboutPath(from)]: aboutPath(to),
    [contactPath(from)]: contactPath(to),
    [imprintPath(from)]: imprintPath(to),
    [privacyPath(from)]: privacyPath(to),
  };

  for (const id of getPostIds()) {
    map[postPath(from, postSlugFor(id, from))] = postPath(to, postSlugFor(id, to));
  }

  // Länder und Themen heißen in beiden Sprachen anders ("Indonesien" /
  // "Indonesia"), deshalb die in archives.ts mitgeführte altSlug-Zuordnung.
  for (const entry of getCountries(from)) {
    map[countryPath(from, entry.name)] = entry.altSlug
      ? countryPath(to, entry.altSlug)
      : blogPath(to);
  }
  for (const entry of getTopics(from)) {
    map[topicPath(from, entry.name)] = entry.altSlug
      ? topicPath(to, entry.altSlug)
      : blogPath(to);
  }

  return map;
}

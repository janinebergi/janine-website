// Alle bearbeitbaren Texte der Website liegen zentral in src/content/site.json
// (deutsch) und src/content/site.en.json (englisch). Beide Dateien haben
// dieselbe Struktur und werden direkt im Repo gepflegt.
import contentDe from "@/content/site.json";
import contentEn from "@/content/site.en.json";
import type { Lang } from "@/lib/i18n-constants";

export const site = contentDe.site;
export const nav = contentDe.nav;
export const stats = contentDe.stats;

// Seiten-spezifische Texte (Überschriften, Absätze, Buttons …)
export const pages = contentDe.pages;

// Sprachabhängiger Content-Zugriff: liefert dieselbe Struktur wie oben,
// aber je nach gewählter Sprache aus site.json oder site.en.json.
export type SiteContent = typeof contentDe;

export function getSiteContent(lang: Lang): SiteContent {
  return lang === "en" ? contentEn : contentDe;
}

// Alle bearbeitbaren Texte der Website liegen zentral in src/content/site.json.
// Diese Datei kann über die Editor-Seite /admin bearbeitet werden – die Änderungen
// werden zurück in die JSON-Datei geschrieben (und landen so in Git).
import contentDe from "@/content/site.json";
import contentEn from "@/content/site.en.json";
import type { Lang } from "@/lib/i18n-constants";

export const site = contentDe.site;
export const nav = contentDe.nav;
export const services = contentDe.services;
export const stats = contentDe.stats;
export const testimonials = contentDe.testimonials;

// Seiten-spezifische Texte (Überschriften, Absätze, Buttons …)
export const pages = contentDe.pages;

// Media Kit (eigene Downloadseite unter /mediakit)
export const mediakit = contentDe.pages.mediakit;

// Das komplette Content-Objekt – wird u. a. vom Editor unter /admin genutzt
// (der Editor bearbeitet ausschließlich die deutschen Originaltexte).
export const siteContent = contentDe;

// Sprachabhängiger Content-Zugriff: liefert dieselbe Struktur wie oben,
// aber je nach gewählter Sprache aus site.json oder site.en.json.
export type SiteContent = typeof contentDe;

export function getSiteContent(lang: Lang): SiteContent {
  return lang === "en" ? contentEn : contentDe;
}

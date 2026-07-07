// Alle bearbeitbaren Texte der Website liegen zentral in src/content/site.json.
// Diese Datei kann über die Editor-Seite /admin bearbeitet werden – die Änderungen
// werden zurück in die JSON-Datei geschrieben (und landen so in Git).
import content from "@/content/site.json";

export const site = content.site;
export const nav = content.nav;
export const services = content.services;
export const stats = content.stats;
export const testimonials = content.testimonials;

// Seiten-spezifische Texte (Überschriften, Absätze, Buttons …)
export const pages = content.pages;

// Media Kit (eigene Downloadseite unter /mediakit)
export const mediakit = content.pages.mediakit;

// Das komplette Content-Objekt – wird u. a. vom Editor unter /admin genutzt.
export const siteContent = content;

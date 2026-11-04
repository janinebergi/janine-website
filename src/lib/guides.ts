import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";

// Alle Reiseführer stehen in site.json unter pages.reisefuehrer.<id>. Ein
// neuer Reiseführer ist ein neuer Eintrag dort (in beiden Sprachdateien,
// unter derselben id) plus die PDF-Datei in public/downloads/ – die Kachel in
// der Übersicht ergibt sich daraus von selbst. Die id bleibt intern
// (<Reisefuehrer id="indonesien" /> in den Beiträgen).

export type Guide = {
  id: string;
  // Länder wie im Frontmatter der Beiträge: auf deren Länderseite steht der
  // Download-Kasten.
  countries: string[];
  // Download-Kasten
  eyebrow: string;
  title: string;
  text: string;
  note: string;
  cta: string;
  ctaExternal: string;
  file: string;
  // Kachel in der Übersicht (heißt „hero“, weil das Bild im Header-Werkzeug
  // eingestellt wird)
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition: string;
  heroImagePositionMobile: string;
  heroZoom: number;
  heroZoomMobile: number;
  heroTitle: string;
  heroText: string;
};

export function getGuides(lang: Lang): Guide[] {
  const entries = getSiteContent(lang).pages.reisefuehrer as unknown as Record<
    string,
    Omit<Guide, "id">
  >;
  return Object.entries(entries).map(([id, guide]) => ({ id, ...guide }));
}

export function getGuide(lang: Lang, id: string): Guide | null {
  return getGuides(lang).find((guide) => guide.id === id) ?? null;
}

// Für die Länderseiten im Blog: der Reiseführer zu genau diesem Land.
export function getGuideForCountry(lang: Lang, country: string): Guide | null {
  return getGuides(lang).find((guide) => guide.countries.includes(country)) ?? null;
}

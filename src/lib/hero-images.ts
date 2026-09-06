import fs from "node:fs";
import path from "node:path";
import { getSiteContent } from "@/lib/site";

// Die vier Header-Bilder der Website und wo ihre Werte in site.json stehen.
// Nur diese Pfade dürfen vom Dev-Werkzeug beschrieben werden.
export const HEROES = [
  {
    id: "startseite",
    label: "Startseite",
    // Die Startseite ist deutlich höher als die Unterseiten-Banner.
    minHeight: { mobile: "88vh", desktop: "88vh" },
    keys: ["site"],
  },
  {
    id: "blog",
    label: "Blog-Übersicht",
    minHeight: { mobile: "45vh", desktop: "52vh" },
    keys: ["pages", "blog"],
  },
  {
    id: "ueber-mich",
    label: "Über mich",
    minHeight: { mobile: "45vh", desktop: "52vh" },
    keys: ["pages", "ueberMich"],
  },
  {
    id: "kontakt",
    label: "Kontakt",
    minHeight: { mobile: "45vh", desktop: "52vh" },
    keys: ["pages", "kontakt"],
  },
] as const;

export type HeroId = (typeof HEROES)[number]["id"];

export type HeroImage = {
  id: HeroId;
  label: string;
  image: string;
  imageAlt: string;
  imageAltEn: string;
  position: string;
  positionMobile: string;
  zoom: number;
  zoomMobile: number;
  minHeight: { mobile: string; desktop: string };
};

export function isHeroId(value: unknown): value is HeroId {
  return HEROES.some((hero) => hero.id === value);
}

type Node = Record<string, unknown>;

function at(root: Node, keys: readonly string[]): Node {
  return keys.reduce<Node>((node, key) => node[key] as Node, root);
}

export function getHeroImages(): HeroImage[] {
  const content = getSiteContent("de") as unknown as Node;
  const contentEn = getSiteContent("en") as unknown as Node;

  return HEROES.map((hero) => {
    const node = at(content, hero.keys);
    return {
      id: hero.id,
      label: hero.label,
      image: node.heroImage as string,
      imageAlt: node.heroImageAlt as string,
      imageAltEn: at(contentEn, hero.keys).heroImageAlt as string,
      position: node.heroImagePosition as string,
      positionMobile: node.heroImagePositionMobile as string,
      zoom: node.heroZoom as number,
      zoomMobile: node.heroZoomMobile as number,
      minHeight: hero.minHeight,
    };
  });
}

const FILES = {
  de: "src/content/site.json",
  en: "src/content/site.en.json",
} as const;

export type HeroLang = keyof typeof FILES;

// Bild, Ausschnitt und Zoom bekommen beide Sprachfassungen – es ist dasselbe
// Bild. Der Alternativtext nicht: der ist übersetzt und wird deshalb nur in
// die Datei der jeweiligen Sprache geschrieben.
// JSON wird komplett neu geschrieben; mit zwei Leerzeichen Einrückung und
// ohne \\u-Escapes kommt exakt das Format heraus, das die Dateien schon haben.
export function writeHeroValue(
  id: HeroId,
  mobile: boolean,
  what: "position" | "zoom" | "image" | "alt",
  value: string | number,
  lang?: HeroLang,
): string[] {
  const hero = HEROES.find((entry) => entry.id === id);
  if (!hero) throw new Error(`Unbekannter Header: ${id}`);

  // Bild und Alternativtext gelten für beide Breiten, nur Position und Zoom
  // haben eine eigene Mobilfassung.
  const field =
    what === "image"
      ? "heroImage"
      : what === "alt"
        ? "heroImageAlt"
        : what === "zoom"
          ? mobile
            ? "heroZoomMobile"
            : "heroZoom"
          : mobile
            ? "heroImagePositionMobile"
            : "heroImagePosition";

  const targets =
    what === "alt" && lang ? [FILES[lang]] : [FILES.de, FILES.en];

  return targets.map((relative) => {
    const file = path.join(process.cwd(), relative);
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as Node;
    at(data, hero.keys)[field] = value;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    return relative;
  });
}

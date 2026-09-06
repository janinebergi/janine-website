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
  position: string;
  positionMobile: string;
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

  return HEROES.map((hero) => {
    const node = at(content, hero.keys);
    return {
      id: hero.id,
      label: hero.label,
      image: node.heroImage as string,
      position: node.heroImagePosition as string,
      positionMobile: node.heroImagePositionMobile as string,
      minHeight: hero.minHeight,
    };
  });
}

const FILES = ["src/content/site.json", "src/content/site.en.json"];

// Beide Sprachfassungen bekommen denselben Ausschnitt – es ist dasselbe Bild.
// JSON wird komplett neu geschrieben; mit zwei Leerzeichen Einrückung und
// ohne \\u-Escapes kommt exakt das Format heraus, das die Dateien schon haben.
export function writeHeroPosition(
  id: HeroId,
  mobile: boolean,
  value: string,
): string[] {
  const hero = HEROES.find((entry) => entry.id === id);
  if (!hero) throw new Error(`Unbekannter Header: ${id}`);

  const field = mobile ? "heroImagePositionMobile" : "heroImagePosition";

  return FILES.map((relative) => {
    const file = path.join(process.cwd(), relative);
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as Node;
    at(data, hero.keys)[field] = value;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    return relative;
  });
}

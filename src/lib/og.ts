// Helfer für die generierten Open-Graph-Bilder (siehe
// src/app/blog/[slug]/opengraph-image.tsx). Beides läuft nur zur Build-Zeit,
// weil die OG-Bilder statisch vorgerendert werden.
import path from "node:path";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 };

// Farben aus globals.css, damit die Karten zum Rest der Seite passen.
export const OG_COLORS = {
  bg: "#060f18",
  surface: "#0c1826",
  border: "#24384f",
  foreground: "#e6eef5",
  muted: "#8ca3b8",
  accent: "#3d92c9",
  accentHover: "#5aa9db",
};

// Lädt eine Google-Schrift als TTF. Ohne `text` würde Google den kompletten
// Zeichensatz liefern – so wird nur das geladen, was auf der Karte steht.
// Schlägt der Abruf fehl (kein Netz im Build), rendert ImageResponse mit
// seiner mitgelieferten Standardschrift weiter.
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}`;
  try {
    const cssResponse = await fetch(url);
    if (!cssResponse.ok) return null;
    const css = await cssResponse.text();
    const match = css.match(/src: url\((\S+)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    const fontResponse = await fetch(match[1]);
    if (!fontResponse.ok) return null;
    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}

// Satori kann weder AVIF noch lokale Dateipfade – deshalb wird das Coverbild
// mit sharp auf OG-Format geschnitten und als data-URI eingebettet.
export async function coverImageDataUri(
  coverImage: string,
  coverPosition?: string,
): Promise<string | null> {
  if (!coverImage.startsWith("/")) return null;
  const file = path.join(process.cwd(), "public", coverImage);
  try {
    const buffer = await sharp(file)
      .resize(OG_SIZE.width, OG_SIZE.height, {
        fit: "cover",
        position: cropPosition(coverPosition),
      })
      .jpeg({ quality: 78 })
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

// Übersetzt das CSS-`object-position` aus dem Frontmatter (z. B. "center 40%")
// in die grobe Zuschnitt-Richtung, die sharp versteht.
function cropPosition(coverPosition?: string): string {
  const match = coverPosition?.match(/(\d+)%/);
  if (!match) return "centre";
  const y = Number(match[1]);
  if (y < 35) return "top";
  if (y > 65) return "bottom";
  return "centre";
}

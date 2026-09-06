import fs from "node:fs";
import path from "node:path";

// Listet die Bilder unter public/assets/website für die Auswahl im
// Dev-Werkzeug. Gleichzeitig die Prüfliste beim Speichern: getauscht werden
// darf nur gegen ein Bild, das hier auch wirklich liegt.

const ROOT = path.join(process.cwd(), "public", "assets", "website");
const EXTENSIONS = [".avif", ".webp", ".jpg", ".jpeg", ".png"];

export type AssetFolder = { folder: string; images: string[] };

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) return [];
    return [`/${path.relative(path.join(process.cwd(), "public"), full)}`];
  });
}

// Nach Ordner gruppiert – 200 Bilder am Stück wären nicht zu überblicken.
export function getAssetImages(): AssetFolder[] {
  const byFolder = new Map<string, string[]>();

  for (const image of walk(ROOT).sort()) {
    const folder = path.dirname(image).split("/").pop() ?? "";
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), image]);
  }

  return [...byFolder.entries()]
    .map(([folder, images]) => ({ folder, images }))
    .sort((a, b) => a.folder.localeCompare(b.folder, "de"));
}

export function isKnownImage(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return getAssetImages().some((entry) => entry.images.includes(value));
}

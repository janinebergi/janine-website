import fs from "node:fs";
import path from "node:path";

// Schreibt die Bildausschnitt-Felder ins Frontmatter zurück – für das
// Dev-Werkzeug unter /dev/bildausschnitt. Bewusst zeilenweise statt über
// gray-matter: das würde beim Zurückschreiben das ganze Frontmatter neu
// formatieren (Anführungszeichen, Arrays, Reihenfolge) und die Diffs
// unlesbar machen.

const BLOG_DIR_DE = path.join(process.cwd(), "content", "blog");
const BLOG_DIR_EN = path.join(BLOG_DIR_DE, "en");

export const COVER_FIELDS = [
  "coverPosition",
  "coverPositionMobile",
  "coverPositionTile",
] as const;

export type CoverField = (typeof COVER_FIELDS)[number];

// Nach welcher Zeile ein neues Feld eingefügt wird, wenn es noch fehlt.
// So bleibt die Reihenfolge im Frontmatter immer dieselbe.
const ORDER = ["coverImage", ...COVER_FIELDS];

export function isCoverField(value: unknown): value is CoverField {
  return COVER_FIELDS.includes(value as CoverField);
}

// Erlaubt ist genau das, was auch objectPosition versteht und was wir
// selbst erzeugen: zwei Werte, jeder eine Prozentzahl oder ein Schlüsselwort.
const VALUE = /^(left|center|right|(100|\d{1,2})%) (top|center|bottom|(100|\d{1,2})%)$/;

export function isCoverValue(value: unknown): value is string {
  return typeof value === "string" && VALUE.test(value);
}

function updateFrontmatter(
  source: string,
  field: CoverField,
  value: string | null,
): string {
  const lines = source.split("\n");
  if (lines[0] !== "---") throw new Error("Kein Frontmatter am Dateianfang");

  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("Frontmatter wird nicht geschlossen");

  const at = lines.findIndex(
    (line, i) => i > 0 && i < end && line.startsWith(`${field}:`),
  );

  if (value === null) {
    if (at !== -1) lines.splice(at, 1);
    return lines.join("\n");
  }

  const line = `${field}: "${value}"`;
  if (at !== -1) {
    lines[at] = line;
    return lines.join("\n");
  }

  // Hinter das letzte bereits vorhandene Feld, das laut ORDER davor gehört.
  const before = ORDER.slice(0, ORDER.indexOf(field));
  let insertAt = -1;
  for (let i = 1; i < end; i++) {
    if (before.some((key) => lines[i].startsWith(`${key}:`))) insertAt = i;
  }
  if (insertAt === -1) throw new Error("coverImage fehlt, Einfügepunkt unklar");

  lines.splice(insertAt + 1, 0, line);
  return lines.join("\n");
}

// Deutsch ist die Leitfassung, aber das Bild ist in beiden Sprachen dasselbe –
// der Ausschnitt wird deshalb immer in beide Dateien geschrieben.
export function writeCoverField(
  id: string,
  field: CoverField,
  value: string | null,
): string[] {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Unerwartete Beitrags-ID: ${id}`);

  const written: string[] = [];
  for (const dir of [BLOG_DIR_DE, BLOG_DIR_EN]) {
    const file = path.join(dir, `${id}.mdx`);
    if (!fs.existsSync(file)) continue;
    fs.writeFileSync(file, updateFrontmatter(fs.readFileSync(file, "utf8"), field, value));
    written.push(path.relative(process.cwd(), file));
  }

  if (written.length === 0) throw new Error(`Keine Datei zu ${id} gefunden`);
  return written;
}

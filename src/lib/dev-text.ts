import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPostBySlug, getPostIds } from "@/lib/blog";
import type { Lang } from "@/lib/i18n-constants";

// Liest und schreibt die Texte für das Dev-Werkzeug „Texte bearbeiten“, das
// lokal unten links auf jeder Seite sitzt. Anklickbar ist dort alles, was aus
// src/content/site.json kommt, und auf einer Beitragsseite zusätzlich Titel,
// Teaser, Q&A und die einzelnen Absätze der .mdx-Datei.
//
// Geschrieben wird immer nur die Sprachfassung, die gerade im Browser offen
// ist: Deutsch bleibt die Leitfassung, die englische wird unter /en… getrennt
// bearbeitet. In den .mdx-Dateien wird – wie beim Bildausschnitt-Werkzeug –
// zeilenweise ersetzt und nicht über gray-matter zurückgeschrieben: das würde
// Reihenfolge und Anführungszeichen des ganzen Frontmatters umwerfen und die
// Diffs unlesbar machen.

const SITE_FILES: Record<Lang, string> = {
  de: path.join(process.cwd(), "src", "content", "site.json"),
  en: path.join(process.cwd(), "src", "content", "site.en.json"),
};

const BLOG_DIR_DE = path.join(process.cwd(), "content", "blog");

export type TextTarget =
  // Ein Oberflächentext in site.json, adressiert über seinen Pfad
  // ("pages.home.heroText", "pages.ueberMich.paragraphs.2").
  | { kind: "site"; path: string }
  // Titel oder Teaser eines Beitrags (Frontmatter).
  | { kind: "frontmatter"; id: string; field: "title" | "excerpt" }
  // Frage oder Antwort im Q&A-Block eines Beitrags (Frontmatter).
  | { kind: "faq"; id: string; index: number; field: "question" | "answer" }
  // Ein Absatz im Fließtext eines Beitrags.
  | { kind: "block"; id: string; index: number };

export type TextEntry = {
  target: TextTarget;
  // Datei und Stelle – steht im Bearbeiten-Fenster, damit immer sichtbar ist,
  // wohin gespeichert wird.
  file: string;
  label: string;
  // Der Text, wie er auf der Seite steht. Daran erkennt das Werkzeug im
  // Browser, welches Element zu welchem Eintrag gehört.
  text: string;
  // Der Text, wie er in der Datei steht – bei Absätzen also mit Markdown.
  value: string;
  markdown: boolean;
};

// Nicht jeder Text in site.json steht auch auf der Seite: Suchmaschinen-Titel
// sind wortgleich mit sichtbaren Überschriften ("Blog", "Kontakt") und würden
// beim Abgleich im Browser nur falsche Treffer erzeugen.
const SKIP_KEYS = /^(metaTitle|metaDescription|url)$/;

// Keine Texte, sondern Schalter: die Adresse eines Reiseführers
// (/reisefuehrer/<slug>) und die Länder, deren Beiträge er verlinkt.
const SKIP_PATHS = /\.(slug|countries\.\d+)$/;

// Bildpfade, Adressen und Bildausschnitte ("center 38%") sind keine Texte –
// letztere haben ihr eigenes Werkzeug unter /dev/bildausschnitt.
const SKIP_VALUES =
  /^(\/|https?:|#)|^(left|right|center|\d{1,3}%) (top|bottom|center|\d{1,3}%)$/;

function relative(file: string): string {
  return path.relative(process.cwd(), file);
}

function postFile(id: string, lang: Lang): string {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Unerwartete Beitrags-ID: ${id}`);
  return path.join(BLOG_DIR_DE, lang === "en" ? "en" : "", `${id}.mdx`);
}

// Mehrzeiliges in einzeiligen Feldern (Frontmatter, site.json) zu einer Zeile
// zusammenziehen: ein Zeilenumbruch wäre dort nur ein Leerzeichen im Ergebnis.
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeYaml(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function readLines(file: string): string[] {
  if (!fs.existsSync(file)) throw new Error(`Datei fehlt: ${relative(file)}`);
  return fs.readFileSync(file, "utf8").split("\n");
}

function writeLines(file: string, lines: string[]): string {
  fs.writeFileSync(file, lines.join("\n"), "utf8");
  return relative(file);
}

function frontmatterEnd(lines: string[]): number {
  if (lines[0] !== "---") throw new Error("Kein Frontmatter am Dateianfang");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("Frontmatter wird nicht geschlossen");
  return end;
}

// Ein Absatz ist alles zwischen zwei Leerzeilen – genauso trennt Markdown
// selbst. Die Nummerierung gilt nur für den Moment: wird beim Bearbeiten ein
// Absatz geteilt, verschieben sich die folgenden Nummern, deshalb holt sich
// das Werkzeug die Liste nach jedem Speichern neu.
type Block = { index: number; start: number; end: number; source: string };

function blocksOf(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let start = -1;
  for (let i = frontmatterEnd(lines) + 1; i <= lines.length; i++) {
    const blank = i === lines.length || lines[i].trim() === "";
    if (!blank && start === -1) start = i;
    if (blank && start !== -1) {
      blocks.push({
        index: blocks.length,
        start,
        end: i - 1,
        source: lines.slice(start, i).join("\n"),
      });
      start = -1;
    }
  }
  return blocks;
}

// Aus einem Absatz das herausziehen, was später als Text auf der Seite steht:
// dieselbe Reduktion wie in post-text.ts, nur für einen einzelnen Absatz.
export function blockToPlainText(source: string): string {
  return source
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+\.\s+/gm, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__|\*|_)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collectSite(value: unknown, keyPath: string, file: string, out: TextEntry[]) {
  if (typeof value === "string") {
    const key = keyPath.split(".").pop() ?? "";
    if (
      SKIP_KEYS.test(key) ||
      SKIP_PATHS.test(keyPath) ||
      SKIP_VALUES.test(value) ||
      value.trim() === ""
    )
      return;
    out.push({
      target: { kind: "site", path: keyPath },
      file,
      label: keyPath,
      text: value,
      value,
      markdown: false,
    });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectSite(item, `${keyPath}.${index}`, file, out));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collectSite(item, keyPath ? `${keyPath}.${key}` : key, file, out);
    }
  }
}

// Alle Texte, die auf der gerade offenen Seite vorkommen können. Titel und
// Teaser aller Beiträge sind immer dabei – die stehen auch in den Kacheln auf
// der Startseite und im Blog; Q&A und Absätze nur beim offenen Beitrag.
export function buildTextIndex(lang: Lang, slug?: string | null): TextEntry[] {
  const entries: TextEntry[] = [];

  const siteFile = SITE_FILES[lang];
  collectSite(
    JSON.parse(fs.readFileSync(siteFile, "utf8")),
    "",
    relative(siteFile),
    entries,
  );

  const openId = slug ? (getPostBySlug(slug, lang)?.id ?? null) : null;

  for (const id of getPostIds()) {
    const file = postFile(id, lang);
    // Fehlt die Übersetzung, gibt es hier nichts zu bearbeiten: die Seite
    // zeigt dann die deutsche Fassung, die auch in /blog bearbeitet wird.
    if (!fs.existsSync(file)) continue;

    const lines = readLines(file);
    const { data } = matter(lines.join("\n"));
    const rel = relative(file);

    for (const field of ["title", "excerpt"] as const) {
      const value = data[field];
      if (typeof value !== "string" || value.trim() === "") continue;
      entries.push({
        target: { kind: "frontmatter", id, field },
        file: rel,
        label: field === "title" ? "Titel" : "Teaser",
        text: value,
        value,
        markdown: false,
      });
    }

    if (id !== openId) continue;

    const faq = Array.isArray(data.faq) ? data.faq : [];
    faq.forEach((item: Record<string, unknown>, index: number) => {
      for (const field of ["question", "answer"] as const) {
        const value = item?.[field];
        if (typeof value !== "string" || value.trim() === "") continue;
        entries.push({
          target: { kind: "faq", id, index, field },
          file: rel,
          label: `Q&A ${index + 1} · ${field === "question" ? "Frage" : "Antwort"}`,
          text: value,
          value,
          markdown: false,
        });
      }
    });

    for (const block of blocksOf(lines)) {
      // Bildstreifen, Kostenübersicht und einzelne Bilder enthalten keinen
      // Text, der sich hier sinnvoll bearbeiten ließe.
      if (block.source.trimStart().startsWith("<")) continue;
      const text = blockToPlainText(block.source);
      if (text === "") continue;
      entries.push({
        target: { kind: "block", id, index: block.index },
        file: rel,
        label: `Absatz ${block.index + 1}`,
        text,
        value: block.source,
        markdown: true,
      });
    }
  }

  return entries;
}

function writeSite(lang: Lang, keyPath: string, value: string): string {
  const file = SITE_FILES[lang];
  const keys = keyPath.split(".");
  if (!keys.every((key) => /^[A-Za-z0-9_]+$/.test(key))) {
    throw new Error(`Unerwarteter Pfad: ${keyPath}`);
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  let node: Record<string, unknown> = data;
  for (const key of keys.slice(0, -1)) {
    const next = node[key];
    if (next === null || typeof next !== "object") {
      throw new Error(`Pfad ${keyPath} gibt es nicht`);
    }
    node = next as Record<string, unknown>;
  }

  const last = keys[keys.length - 1];
  if (typeof node[last] !== "string") throw new Error(`Pfad ${keyPath} ist kein Text`);
  node[last] = oneLine(value);

  // site.json ist genau so formatiert, wie JSON.stringify es schreibt (zwei
  // Leerzeichen Einrückung, Zeilenumbruch am Ende) – damit bleibt das Diff auf
  // die geänderte Zeile beschränkt.
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return relative(file);
}

function writeFrontmatter(
  id: string,
  lang: Lang,
  field: "title" | "excerpt",
  value: string,
): string {
  const file = postFile(id, lang);
  const lines = readLines(file);
  const end = frontmatterEnd(lines);
  const at = lines.findIndex(
    (line, i) => i > 0 && i < end && line.startsWith(`${field}:`),
  );
  if (at === -1) throw new Error(`${field} fehlt im Frontmatter`);

  lines[at] = `${field}: "${escapeYaml(oneLine(value))}"`;
  return writeLines(file, lines);
}

function writeFaq(
  id: string,
  lang: Lang,
  index: number,
  field: "question" | "answer",
  value: string,
): string {
  const file = postFile(id, lang);
  const lines = readLines(file);
  const end = frontmatterEnd(lines);
  const faqAt = lines.findIndex((line, i) => i > 0 && i < end && line.startsWith("faq:"));
  if (faqAt === -1) throw new Error("faq fehlt im Frontmatter");

  let item = -1;
  for (let i = faqAt + 1; i < end; i++) {
    const line = lines[i];
    // Ein nicht eingerückter Eintrag beendet den faq-Block.
    if (line.trim() !== "" && !/^\s/.test(line)) break;
    if (/^\s*-\s/.test(line)) item++;
    if (item !== index) continue;

    const indent = line.match(new RegExp(`^(\\s*(?:-\\s+)?)${field}:\\s`))?.[1];
    if (indent === undefined) continue;
    lines[i] = `${indent}${field}: "${escapeYaml(oneLine(value))}"`;
    return writeLines(file, lines);
  }

  throw new Error(`Q&A-Eintrag ${index + 1} hat kein Feld ${field}`);
}

function writeBlock(id: string, lang: Lang, index: number, value: string): string {
  const file = postFile(id, lang);
  const lines = readLines(file);
  const block = blocksOf(lines).find((entry) => entry.index === index);
  if (!block) throw new Error(`Absatz ${index + 1} gibt es nicht`);

  const replacement = value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (replacement === "") {
    throw new Error("Leerer Absatz – zum Löschen bitte direkt in die Datei gehen");
  }

  lines.splice(block.start, block.end - block.start + 1, ...replacement.split("\n"));
  return writeLines(file, lines);
}

export function writeText(lang: Lang, target: TextTarget, value: string): string {
  switch (target.kind) {
    case "site":
      return writeSite(lang, target.path, value);
    case "frontmatter":
      return writeFrontmatter(target.id, lang, target.field, value);
    case "faq":
      return writeFaq(target.id, lang, target.index, target.field, value);
    case "block":
      return writeBlock(target.id, lang, target.index, value);
  }
}

// Prüft, was aus dem Browser kommt, bevor irgendetwas geschrieben wird.
export function isTextTarget(value: unknown): value is TextTarget {
  if (!value || typeof value !== "object") return false;
  const target = value as Record<string, unknown>;
  const id = typeof target.id === "string" && /^[a-z0-9-]+$/.test(target.id);
  const index = typeof target.index === "number" && Number.isInteger(target.index) && target.index >= 0;

  switch (target.kind) {
    case "site":
      return typeof target.path === "string" && target.path.length > 0;
    case "frontmatter":
      return id && (target.field === "title" || target.field === "excerpt");
    case "faq":
      return id && index && (target.field === "question" || target.field === "answer");
    case "block":
      return id && index;
    default:
      return false;
  }
}

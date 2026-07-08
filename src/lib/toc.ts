import { slugify } from "@/lib/slugify";

export type TocHeading = {
  id: string;
  text: string;
};

// Nur H2-Überschriften – H3 würde das Mini-Inhaltsverzeichnis überladen.
const H2_LINE = /^##\s+(.+)$/gm;

export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  for (const match of markdown.matchAll(H2_LINE)) {
    const text = match[1].replace(/[*_`]/g, "").trim();
    headings.push({ id: slugify(text), text });
  }
  return headings;
}

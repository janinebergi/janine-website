import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Lang } from "@/lib/i18n-constants";

const BLOG_DIR_DE = path.join(process.cwd(), "content", "blog");
const BLOG_DIR_EN = path.join(BLOG_DIR_DE, "en");

function blogDir(lang: Lang): string {
  return lang === "en" ? BLOG_DIR_EN : BLOG_DIR_DE;
}

export type GalleryImage = {
  src: string;
  alt: string;
  // Überschreibt für dieses eine Bild das Galerie-Copyright (z. B. Fotos von
  // Gästen). Fehlt es, gilt der credit-Wert der Galerie.
  credit?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PostMeta = {
  // Dateiname der deutschen Fassung. Sprachunabhängige ID, über die deutsche
  // und englische Fassung eines Beitrags zusammengehören.
  id: string;
  // Öffentlicher Slug in DIESER Sprache. Englische Beiträge können im
  // Frontmatter ein eigenes `slug` setzen, sonst gilt die ID.
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  // Nur für die Suchergebnisse. Fehlen sie, gelten title bzw. excerpt –
  // die sind aber auf Seitenüberschrift und Teaser hin geschrieben und
  // meist zu lang für Google.
  metaTitle?: string;
  metaDescription?: string;
  coverImage: string;
  coverPosition?: string;
  country: string;
  travelBuddy?: string;
  tags: string[];
  readingTime: number;
  gallery: GalleryImage[];
  faq: FaqItem[];
};

export type Post = PostMeta & {
  content: string;
};

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function fileToPost(dir: string, fileName: string, id: string): Post {
  const raw = fs.readFileSync(path.join(dir, fileName), "utf8");
  const { data, content } = matter(raw);
  const slug = typeof data.slug === "string" && data.slug ? data.slug : id;

  return {
    id,
    slug,
    title: data.title ?? id,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? `https://picsum.photos/seed/${id}/1200/700`,
    coverPosition: data.coverPosition,
    country: data.country ?? "",
    travelBuddy: data.travelBuddy,
    tags: data.tags ?? [],
    readingTime: readingTime(content),
    gallery: data.gallery ?? [],
    faq: data.faq ?? [],
    content,
  };
}

// Die deutschen Dateinamen sind die Quelle der Wahrheit dafür, welche
// Beiträge existieren – unabhängig davon, wie sie in einer Sprache heißen.
export function getPostIds(): string[] {
  if (!fs.existsSync(BLOG_DIR_DE)) return [];
  return fs
    .readdirSync(BLOG_DIR_DE)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

// Die öffentlichen Slugs einer Sprache – das, was in der URL steht.
export function getPostSlugs(lang: Lang = "de"): string[] {
  return getPostIds().map((id) => getPostById(id, lang)?.slug ?? id);
}

export function getAllPosts(lang: Lang = "de"): PostMeta[] {
  return getPostIds()
    .map((id) => {
      const { content: _content, ...meta } = getPostById(id, lang)!;
      return meta;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

// Liest den Beitrag in der gewünschten Sprache; fällt auf Deutsch zurück,
// falls für eine ID (noch) keine englische Übersetzung existiert.
export function getPostById(id: string, lang: Lang = "de"): Post | null {
  const dir = blogDir(lang);
  const mdx = path.join(dir, `${id}.mdx`);
  const md = path.join(dir, `${id}.md`);
  const file = fs.existsSync(mdx) ? `${id}.mdx` : fs.existsSync(md) ? `${id}.md` : null;
  if (file) return fileToPost(dir, file, id);
  if (lang === "en") return getPostById(id, "de");
  return null;
}

// Auflösung aus der URL: Bei Englisch kann der Slug vom Dateinamen abweichen,
// deshalb wird über alle Beiträge der Sprache gesucht (neun Dateien, das ist
// zur Build-Zeit vernachlässigbar).
export function getPostBySlug(slug: string, lang: Lang = "de"): Post | null {
  for (const id of getPostIds()) {
    const post = getPostById(id, lang);
    if (post?.slug === slug) return post;
  }
  return null;
}

// Der Slug eines Beitrags in einer bestimmten Sprache – für hreflang,
// Sitemap und den Sprachumschalter.
export function postSlugFor(id: string, lang: Lang): string {
  return getPostById(id, lang)?.slug ?? id;
}

export function formatDate(date: string, lang: Lang = "de"): string {
  return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  coverPosition?: string;
  country: string;
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

function fileToPost(dir: string, fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(dir, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? `https://picsum.photos/seed/${slug}/1200/700`,
    coverPosition: data.coverPosition,
    country: data.country ?? "",
    tags: data.tags ?? [],
    readingTime: readingTime(content),
    gallery: data.gallery ?? [],
    faq: data.faq ?? [],
    content,
  };
}

// Slugs sind immer die deutschen Originaldateien – das ist die Quelle der
// Wahrheit dafür, welche Beiträge existieren.
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR_DE)) return [];
  return fs
    .readdirSync(BLOG_DIR_DE)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export function getAllPosts(lang: Lang = "de"): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = getPostBySlug(slug, lang)!;
      return meta;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

// Liest den Beitrag in der gewünschten Sprache; fällt auf Deutsch zurück,
// falls für einen Slug (noch) keine englische Übersetzung existiert.
export function getPostBySlug(slug: string, lang: Lang = "de"): Post | null {
  const dir = blogDir(lang);
  const mdx = path.join(dir, `${slug}.mdx`);
  const md = path.join(dir, `${slug}.md`);
  const file = fs.existsSync(mdx) ? `${slug}.mdx` : fs.existsSync(md) ? `${slug}.md` : null;
  if (file) return fileToPost(dir, file);
  if (lang === "en") return getPostBySlug(slug, "de");
  return null;
}

export function formatDate(date: string, lang: Lang = "de"): string {
  return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

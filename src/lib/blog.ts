import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type GalleryImage = {
  src: string;
  alt: string;
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

function fileToPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? `https://picsum.photos/seed/${slug}/1200/700`,
    tags: data.tags ?? [],
    readingTime: readingTime(content),
    gallery: data.gallery ?? [],
    faq: data.faq ?? [],
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const { content: _content, ...meta } = fileToPost(file);
      return meta;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.existsSync(mdx) ? `${slug}.mdx` : fs.existsSync(md) ? `${slug}.md` : null;
  if (!file) return null;
  return fileToPost(file);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/pages/blog-post";
import { JsonLd } from "@/components/json-ld";
import { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import { blogPath, homePath, postPath } from "@/lib/routes";

const LANG = "de" as const;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, LANG);
  if (!post) return {};

  return pageMetadata(LANG, {
    title: post.title,
    description: post.excerpt,
    paths: { de: postPath("de", slug), en: postPath("en", slug) },
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    section: post.country || undefined,
    // Das Vorschaubild liefert opengraph-image.tsx in diesem Ordner.
    image: null,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug, LANG);
  if (!post) notFound();
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(LANG, post),
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: pages.blog.heroEyebrow, path: blogPath(LANG) },
            { name: post.title, path: postPath(LANG, slug) },
          ]),
          ...(post.faq.length > 0 ? [faqSchema(post.faq)] : []),
        ]}
      />
      <BlogPostPage slug={slug} lang={LANG} />
    </>
  );
}

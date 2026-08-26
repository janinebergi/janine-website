import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/pages/blog-post";
import { JsonLd } from "@/components/json-ld";
import { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostSlugs, postSlugFor } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import { absoluteUrl, blogPath, homePath, postPath } from "@/lib/routes";

const LANG = "en" as const;

export function generateStaticParams() {
  return getPostSlugs(LANG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, LANG);
  if (!post) return {};

  return {
    ...pageMetadata(LANG, {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      paths: {
        de: postPath("de", postSlugFor(post.id, "de")),
        en: postPath("en", postSlugFor(post.id, "en")),
      },
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      section: post.country || undefined,
      // Erzeugt von /blog/<slug>/og (siehe og/route.ts). Der Ordnername
      // trägt bewusst keine .jpg-Endung – ein Punkt in einem dynamischen
      // Routensegment bringt den Next-Build durcheinander.
      image: absoluteUrl(`${postPath(LANG, slug)}/og`),
      imageAlt: post.title,
    }),
    // Ohne "— Janine Bergmann": Die Beitragstitel brauchen die rund 60
    // Zeichen, die Google anzeigt, vollständig für sich.
    title: { absolute: post.metaTitle ?? post.title },
  };
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

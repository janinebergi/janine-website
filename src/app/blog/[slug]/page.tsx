import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/container";
import { mdxComponents } from "@/components/mdx-components";
import { getPostBySlug, getPostSlugs, formatDate } from "@/lib/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Zurück zum Blog
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} Min. Lesezeit</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent-soft px-3 py-1 text-accent-hover"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="prose prose-invert mt-12 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-accent-hover prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-accent prose-blockquote:text-foreground/90 prose-img:rounded-2xl">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <footer className="mt-16 rounded-2xl border border-border bg-surface/60 p-8 text-center">
          <p className="text-muted">Geschrieben von</p>
          <p className="mt-1 text-lg font-semibold">{site.name}</p>
          <Link
            href="/kontakt"
            className="mt-4 inline-flex text-sm font-medium text-accent-hover hover:underline"
          >
            Projekt anfragen →
          </Link>
        </footer>
      </Container>
    </article>
  );
}

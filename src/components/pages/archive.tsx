import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { formatDate, tileStyle, type PostMeta } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { blogPath, postPath } from "@/lib/routes";

// Länder- und Themenseiten teilen sich dasselbe Layout: kurze Einleitung plus
// alle passenden Beiträge. Sie sind die Einstiegspunkte für Suchanfragen wie
// „Reisebericht Marokko" und verbinden die Beiträge untereinander.
export function ArchivePage({
  lang,
  eyebrow,
  title,
  intro,
  posts,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  intro: string;
  posts: PostMeta[];
}) {
  const { pages } = getSiteContent(lang);
  const t = pages.archive;
  const count =
    posts.length === 1
      ? t.postCountOne
      : t.postCountMany.replace("{count}", String(posts.length));

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Link
          href={blogPath(lang)}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> {pages.blogPost.backToBlog}
        </Link>

        <div className="mt-8 max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
          <p className="mt-2 text-sm text-muted">{count}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={postPath(lang, post.slug)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="cover-image object-cover transition-transform duration-500"
                  style={tileStyle(post)}
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{formatDate(post.date, lang)}</span>
                  <span>·</span>
                  <span>
                    {post.readingTime} {pages.blog.readingTimeShort}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent-hover">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/container";
import { mdxComponents } from "@/components/mdx-components";
import { postRouteMaps } from "@/components/post-route-maps";
import { BlogToc } from "@/components/blog-toc";
import { BlogReadAloud } from "@/components/blog-read-aloud";
import { Gallery } from "@/components/gallery";
import { postToSpeechText } from "@/lib/post-text";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";
import { getTopics } from "@/lib/archives";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { extractHeadings } from "@/lib/toc";
import { slugify } from "@/lib/slugify";
import { blogPath, contactPath, countryPath, postPath, topicPath } from "@/lib/routes";

export async function BlogPostPage({
  slug,
  lang,
}: {
  slug: string;
  lang: Lang;
}) {
  const { site, pages } = getSiteContent(lang);
  const t = pages.blogPost;
  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  // Show a varied set of "more posts" rather than always the newest three:
  // prefer posts sharing this one's country/tags, and rotate the rest by the
  // current post's position so different posts surface different suggestions.
  const allPosts = getAllPosts(lang);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const others = allPosts.filter((p) => p.slug !== slug);
  const offset = others.length > 0 ? currentIndex % others.length : 0;
  const rotated = [...others.slice(offset), ...others.slice(0, offset)];
  const relevance = (p: (typeof rotated)[number]) =>
    (post.country && p.country === post.country ? 3 : 0) +
    p.tags.filter((tag) => post.tags.includes(tag)).length;
  const morePosts = rotated
    .map((p, index) => ({ p, index, score: relevance(p) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((entry) => entry.p);

  // Nachschlagen über die sprachunabhängige ID, nicht über den URL-Slug:
  // Englische Beiträge haben eigene Slugs ("diving-bali" …), sonst fiele
  // die Karte in der englischen Fassung weg.
  const RouteMap = postRouteMaps[post.id];

  // Land und Themen verlinken auf ihre Archivseiten – das verbindet die
  // Beiträge untereinander und gibt Google eine erkennbare Themenstruktur.
  const topicSlugs = new Set(getTopics(lang).map((entry) => entry.slug));

  const speechText = postToSpeechText(post, lang, { qaTitle: t.qaTitle });
  const galleryId = slugify(t.galleryTitle);
  const faqId = slugify(t.qaTitle);
  const tocItems = [
    ...extractHeadings(post.content),
    ...(post.gallery.length > 0 ? [{ id: galleryId, text: t.galleryTitle }] : []),
    ...(post.faq.length > 0 ? [{ id: faqId, text: t.qaTitle }] : []),
  ];

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href={blogPath(lang)}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> {t.backToBlog}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{formatDate(post.date, lang)}</span>
            <span>·</span>
            <span>{post.readingTime} {pages.blog.readingTimeLong}</span>
            {post.country && (
              <>
                <span>·</span>
                <Link
                  href={countryPath(lang, post.country)}
                  className="transition-colors hover:text-foreground"
                >
                  {post.country}
                </Link>
              </>
            )}
            {post.travelBuddy && (
              <>
                <span>·</span>
                <span>{t.travelBuddy}: {post.travelBuddy}</span>
              </>
            )}
            {post.tags.map((tag) => {
              const className =
                "rounded-full bg-accent-soft px-3 py-1 text-accent-hover";
              return topicSlugs.has(slugify(tag)) ? (
                <Link
                  key={tag}
                  href={topicPath(lang, tag)}
                  className={`${className} transition-colors hover:bg-accent/25`}
                >
                  {tag}
                </Link>
              ) : (
                <span key={tag} className={className}>
                  {tag}
                </span>
              );
            })}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>

          <BlogReadAloud
            text={speechText}
            lang={lang}
            labels={{
              play: t.readAloud,
              pause: t.readAloudPause,
              resume: t.readAloudResume,
              stop: t.readAloudStop,
            }}
          />
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            style={
              post.coverPosition
                ? { objectPosition: post.coverPosition }
                : undefined
            }
          />
        </div>

        {RouteMap && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold leading-tight">
              {t.routeTitle}
            </h2>
            <RouteMap lang={lang} />
          </section>
        )}

        <BlogToc items={tocItems} label={t.tocLabel} />

        <div className="prose prose-invert mt-12 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-accent-hover prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-accent prose-blockquote:text-foreground/90 prose-img:rounded-2xl">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {post.gallery.length > 0 && (
          <section id={galleryId} className="mt-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold leading-tight">{t.galleryTitle}</h2>
            <Gallery images={post.gallery} paged={false} showCaptions />
          </section>
        )}

        {post.faq.length > 0 && (
          <section id={faqId} className="mt-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold leading-tight">{t.qaTitle}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {post.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-border bg-surface/60 p-6"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold marker:content-['']">
                    {item.question}
                    <span className="text-accent-hover transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-muted">
                    {item.answer}
                  </p>
                  {item.section && (
                    <a
                      href={`#${slugify(item.section)}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80"
                    >
                      {t.jumpToSection}: {item.section}
                      <ArrowDown size={14} aria-hidden="true" />
                    </a>
                  )}
                </details>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-16 rounded-2xl border border-border bg-surface/60 p-8 text-center">
          <p className="text-muted">{t.writtenBy}</p>
          <p className="mt-1 text-lg font-semibold">{site.name}</p>
          <Link
            href={contactPath(lang)}
            className="mt-4 inline-flex text-sm font-medium text-accent-hover hover:underline"
          >
            {t.projectCta}
          </Link>
        </footer>

        {morePosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold leading-tight">{t.moreTitle}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((more) => (
                <Link
                  key={more.slug}
                  href={postPath(lang, more.slug)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={more.coverImage}
                      alt={more.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={
                        more.coverPosition
                          ? { objectPosition: more.coverPosition }
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{formatDate(more.date, lang)}</span>
                      <span>·</span>
                      <span>{more.readingTime} {pages.blog.readingTimeShort}</span>
                      {more.country && (
                        <>
                          <span>·</span>
                          <span>{more.country}</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent-hover">
                      {more.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {more.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}

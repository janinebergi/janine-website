import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowRight } from "lucide-react";
import { getAllPosts, formatDate } from "@/lib/blog";
import { pages as pagesDe, getSiteContent } from "@/lib/site";
import { getLang } from "@/lib/i18n";

const tDe = pagesDe.blog;

export const metadata: Metadata = {
  title: tDe.metaTitle,
  description: tDe.metaDescription,
};

export default async function BlogPage() {
  const lang = await getLang();
  const { pages } = getSiteContent(lang);
  const t = pages.blog;
  const posts = getAllPosts(lang);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        image="/assets/website/IMG_1873.avif"
        imageAlt={t.heroImageAlt}
        imagePosition="center 60%"
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        text={t.heroText}
      />

      <section className="pb-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-muted">{t.emptyState}</p>
          ) : (
            <div className="flex flex-col gap-12">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface/60 md:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="text-accent-hover">{t.featuredLabel}</span>
                      <span>·</span>
                      <span>{formatDate(featured.date, lang)}</span>
                      <span>·</span>
                      <span>{featured.readingTime} {t.readingTimeLong}</span>
                      {featured.country && (
                        <>
                          <span>·</span>
                          <span>{featured.country}</span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold leading-snug group-hover:text-accent-hover">
                      {featured.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted">
                      {featured.excerpt}
                    </p>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <span>{formatDate(post.date, lang)}</span>
                          <span>·</span>
                          <span>{post.readingTime} {t.readingTimeShort}</span>
                          {post.country && (
                            <>
                              <span>·</span>
                              <span>{post.country}</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent-hover">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <section className="mt-16 rounded-2xl border border-border bg-surface/60 p-8 sm:p-10">
            <p className="text-sm text-accent-hover">{t.collabEyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug">
              {t.collabTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              {t.collabText}
            </p>
            <Link
              href="/kontakt"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80"
            >
              {t.collabCta}
              <ArrowRight size={16} />
            </Link>
          </section>
        </Container>
      </section>
    </>
  );
}

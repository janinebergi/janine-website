import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowRight } from "lucide-react";
import { getAllPosts, formatDate } from "@/lib/blog";
import { getCountries, getTopics } from "@/lib/archives";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { contactPath, countryPath, postPath, topicPath } from "@/lib/routes";

export async function BlogIndexPage({ lang }: { lang: Lang }) {
  const { pages } = getSiteContent(lang);
  const t = pages.blog;
  const posts = getAllPosts(lang);
  const [featured, ...rest] = posts;
  const countries = getCountries(lang);
  const topics = getTopics(lang);
  const a = pages.archive;

  return (
    <>
      <PageHeader
        image="/assets/website/allgemein/IMG_1873.avif"
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
                  href={postPath(lang, featured.slug)}
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
                      href={postPath(lang, post.slug)}
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

          {/* Einstiege nach Reiseziel und Thema: eigene, indexierbare Seiten
              je Land/Thema und zugleich die interne Verlinkung dorthin. */}
          <div className="mt-20 grid gap-10 border-t border-border/60 pt-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">{a.countriesTitle}</h2>
              <p className="mt-2 text-sm text-muted">{a.countriesText}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {countries.map((country) => (
                  <Link
                    key={country.slug}
                    href={countryPath(lang, country.slug)}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                  >
                    {country.name}
                    <span className="ml-2 text-xs text-accent-hover">
                      {country.posts.length}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">{a.topicsTitle}</h2>
              <p className="mt-2 text-sm text-muted">{a.topicsText}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={topicPath(lang, topic.slug)}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                  >
                    {topic.name}
                    <span className="ml-2 text-xs text-accent-hover">
                      {topic.posts.length}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-16 rounded-2xl border border-border bg-surface/60 p-8 sm:p-10">
            <p className="text-sm text-accent-hover">{t.collabEyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug">
              {t.collabTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              {t.collabText}
            </p>
            <Link
              href={contactPath(lang)}
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

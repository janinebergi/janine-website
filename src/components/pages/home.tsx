import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { iconForStat } from "@/lib/stat-icons";
import { getAllPosts, formatDate } from "@/lib/blog";
import { blogPath, contactPath, postPath } from "@/lib/routes";

export async function HomePage({ lang }: { lang: Lang }) {
  const { pages, site, stats } = getSiteContent(lang);
  const t = pages.home;
  const recentPosts = getAllPosts(lang).slice(0, 3);

  return (
    <>
      {/* Großer Header über der Startseite */}
      <section className="relative isolate flex min-h-[88vh] flex-col justify-center overflow-hidden">
        {/* Header-Bild: Quelle in src/lib/site.ts (site.heroImage). */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={site.heroImage}
            alt="Taucherin im tiefblauen Wasser, über ihr eine Spur aus Luftblasen"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[73%_center] sm:object-center md:object-[72%_center]"
          />
          {/* Overlays: Text links lesbar halten, Bild sichtbar lassen */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/55 to-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>

        <Container className="relative pt-28 pb-14">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{site.role} · {site.tagline}</Eyebrow>
            <h1 className="text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
              {t.heroHeadingPre}
              <span className="text-gradient">{t.heroHeadingHighlight}</span>
              {t.heroHeadingPost}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-foreground/80">
              {t.heroText}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href={contactPath(lang)}>{t.heroPrimaryCta}</Button>
            </div>
          </div>

          <dl className="mt-16 grid max-w-md grid-cols-2 gap-8 border-t border-border/60 pt-8">
            {stats.map((s) => {
              const Icon = iconForStat(s.label);
              return (
                <div key={s.label} className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-hover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <dt className="text-gradient text-3xl font-semibold">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>

      {/* Neueste Beiträge */}
      {recentPosts.length > 0 && (
        <section className="pt-10 pb-20">
          <Container>
            <SectionHeading eyebrow={t.latestEyebrow} title={t.latestTitle} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={postPath(lang, post.slug)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-colors hover:border-accent/60"
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
                      <span>{post.readingTime} {pages.blog.readingTimeShort}</span>
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
            <div className="mt-10">
              <Link
                href={blogPath(lang)}
                className="inline-flex items-center gap-1 text-sm font-medium text-accent-hover hover:gap-2 transition-all"
              >
                {t.latestLink} <ArrowUpRight size={16} />
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Zitate: Rückmeldungen zu einzelnen Beiträgen */}
      {t.testimonials.length > 0 && (
        <section className="pb-20">
          <Container>
            <div className={`grid gap-6 ${t.testimonials.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {t.testimonials.map((testimonial) => (
                <figure
                  key={testimonial.author}
                  className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-8 sm:p-12"
                >
                  <Quote
                    aria-hidden
                    className="absolute right-6 top-6 h-16 w-16 text-accent-soft"
                  />
                  <blockquote className="relative flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-foreground/90">
                    {testimonial.quote.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </blockquote>
                  <figcaption className="relative mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-6 text-sm">
                    <span className="font-medium">{testimonial.author}</span>
                    <span className="text-muted">{testimonial.role}</span>
                  </figcaption>
                  <Link
                    href={postPath(lang, testimonial.postSlug)}
                    className="relative mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-hover transition-all hover:gap-2"
                  >
                    {testimonial.linkLabel} <ArrowUpRight size={16} />
                  </Link>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-8 py-16 text-center sm:px-16">
            <div className="glow-radial pointer-events-none absolute inset-0" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {t.ctaTitle}
              </h2>
              <p className="text-lg text-muted">{t.ctaText}</p>
              <Button href={contactPath(lang)}>{t.ctaButton}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

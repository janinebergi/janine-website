import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Landmark,
  Newspaper,
  Plane,
  FerrisWheel,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/ui/page-header";
import { Gallery } from "@/components/gallery";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { iconForStat } from "@/lib/stat-icons";
import { getAllPosts, formatDate, tileStyle } from "@/lib/blog";
import { blogPath, contactPath, postPath } from "@/lib/routes";

// Icons für den Werdegang – Reihenfolge entspricht t.timeline.
const timelineIcons = [FerrisWheel, Landmark, GraduationCap, Newspaper, Plane, MapPin];

export async function AboutPage({ lang }: { lang: Lang }) {
  const { pages, stats } = getSiteContent(lang);
  const t = pages.ueberMich;
  const values = t.values;
  const blogTeaser = t.blogTeaser;
  const timeline = t.timeline.map((step, i) => ({ ...step, icon: timelineIcons[i] }));
  const recentPosts = getAllPosts(lang).slice(0, 3);

  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
        imagePosition={t.heroImagePosition}
        imagePositionMobile={t.heroImagePositionMobile}
        imageZoom={t.heroZoom}
        imageZoomMobile={t.heroZoomMobile}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      {/* Einleitungstext */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
            {t.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <p>
              {t.blogNote}{" "}
              <Link
                href={blogPath(lang)}
                className="font-medium text-accent-hover underline underline-offset-4 hover:opacity-80"
              >
                Blog
              </Link>
              .
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Button href={contactPath(lang)}>{t.ctaButton}</Button>
          </div>
        </Container>
      </section>

      {/* Fakten über mich – Variante „Boarding Pass“: verspielter &
          anschaulicher als eine reine Zahlenreihe, passend zum Reise-Thema. */}
      <section className="pb-10">
        <Container>
          <div className="relative mx-auto max-w-3xl">
            <dl className="flex flex-col divide-y divide-dashed divide-border rounded-2xl border border-border bg-surface/60 sm:flex-row sm:divide-x sm:divide-y-0">
              {stats.map((s) => {
                const Icon = iconForStat(s.label);
                return (
                  <div
                    key={s.label}
                    className="group flex flex-1 items-center gap-4 p-7 transition-colors hover:bg-surface-2/60 sm:flex-col sm:text-center"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-hover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:h-14 sm:w-14">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </span>
                    <div>
                      <dt className="text-gradient text-3xl font-semibold sm:text-4xl">
                        {s.value}
                      </dt>
                      <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            {/* Perforations-Kreise oben/unten für den Ticket-Look */}
            <div className="pointer-events-none absolute left-1/2 top-0 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg sm:block" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-bg sm:block" />
          </div>
        </Container>
      </section>

      {/* Grafische Darstellung des Einleitungstexts: Werdegang als Timeline
          im selben Icon-Stil wie die Fakten oben. */}
      <section className="pb-20">
        <Container>
          <SectionHeading
            eyebrow={t.timelineEyebrow}
            title={t.timelineTitle}
            align="center"
          />

          <div className="mx-auto mt-12 max-w-2xl">
            <ol className="relative flex flex-col gap-10 border-l border-dashed border-border pl-8 sm:pl-10">
              {timeline.map((step) => (
                <li key={step.title} className="group relative">
                  <span className="absolute -left-[calc(2rem+1px)] top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-accent-soft text-accent-hover ring-4 ring-bg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:-left-[calc(2.5rem+1px)] sm:h-12 sm:w-12">
                    <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            align="center"
          />
          <Gallery images={t.gallery.images} />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <SectionHeading
            eyebrow={t.valuesEyebrow}
            title={t.valuesTitle}
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-surface/60 p-7"
              >
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {recentPosts.length > 0 && (
        <section className="pb-20">
          <Container>
            <SectionHeading
              eyebrow={blogTeaser.eyebrow}
              title={blogTeaser.title}
              align="center"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
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
            <div className="mt-10 text-center">
              <Button href={blogPath(lang)} variant="secondary">
                {blogTeaser.linkText}
              </Button>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

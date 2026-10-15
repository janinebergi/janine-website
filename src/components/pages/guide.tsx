import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reisefuehrer } from "@/components/guide-download";
import { getSiteContent } from "@/lib/site";
import { formatDate, getAllPosts, tileStyle } from "@/lib/blog";
import { postPath } from "@/lib/routes";
import type { Lang } from "@/lib/i18n-constants";

// Eigene Seite zum Reiseführer (/reisefuehrer bzw. /en/travel-guide). Auf sie
// zeigen Menü, Suche und Google – und sie ist die Seite, aus der später die
// Verkaufsseite wird, falls der Reiseführer etwas kosten soll. Der
// Download-Kasten ist dasselbe Bauteil wie in den Beiträgen, damit es nur eine
// Stelle gibt, an der Texte und Ziel gepflegt werden.

// Welche Beiträge unten als „die ganze Reise“ verlinkt werden. Beide
// Schreibweisen, weil das Land in der englischen Fassung „Indonesia“ heißt.
const GUIDE_COUNTRIES = ["Indonesien", "Indonesia"];

export function GuidePage({ lang }: { lang: Lang }) {
  const { pages } = getSiteContent(lang);
  const t = pages.reisefuehrerSeite;
  const posts = getAllPosts(lang).filter((post) =>
    GUIDE_COUNTRIES.includes(post.country),
  );

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
        text={t.heroText}
      />

      <section className="py-16 sm:py-20">
        <Container>
          {/* Die Eckdaten aus dem Reiseführer selbst */}
          <dl className="grid grid-cols-2 gap-6 border-b border-border pb-10 sm:grid-cols-4">
            {t.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {fact.value}
                </dt>
                <dd className="mt-1 text-sm uppercase tracking-widest text-muted">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>

          <Reisefuehrer id="indonesien" lang={lang} ort="reisefuehrer-seite" />

          <div className="mt-16">
            <SectionHeading eyebrow={t.contentsEyebrow} title={t.contentsTitle} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {t.contents.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface/60 p-6"
                >
                  <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {posts.length > 0 && (
        <section className="pb-20">
          <Container>
            <SectionHeading
              eyebrow={t.blogEyebrow}
              title={t.blogTitle}
              description={t.blogText}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
                      sizes="(max-width: 640px) 100vw, 50vw"
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
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent-hover">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-hover transition-all group-hover:gap-2">
                      {pages.home.latestLink} <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

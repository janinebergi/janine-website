import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reisefuehrer, guideLink } from "@/components/guide-download";
import { getSiteContent } from "@/lib/site";
import { formatDate, getAllPosts, tileStyle } from "@/lib/blog";
import { getGuides, type Guide } from "@/lib/guides";
import { imageVars } from "@/lib/object-position";
import { guideDetailPath, postPath } from "@/lib/routes";
import type { Lang } from "@/lib/i18n-constants";

// Die Reiseführer-Seiten: /reisefuehrer (bzw. /en/travel-guide) ist die
// Übersicht aller Reiseführer, /reisefuehrer/<slug> die Seite zu einem
// einzelnen – und die Seite, aus der später die Verkaufsseite wird, falls ein
// Reiseführer etwas kosten soll. Der Download-Kasten ist dasselbe Bauteil wie
// in den Beiträgen, damit es nur eine Stelle gibt, an der Texte und Ziel
// gepflegt werden.

// In der Übersicht stehen nur Reiseführer, deren PDF schon da ist (oder die
// auf einen Shop zeigen). Lokal stehen alle drin, damit ein neuer schon
// sichtbar ist, bevor die Datei fertig ist.
function isPublished(lang: Lang, guide: Guide): boolean {
  return process.env.NODE_ENV !== "production" || guideLink(lang, guide.id) !== null;
}

export function GuideOverviewPage({ lang }: { lang: Lang }) {
  const t = getSiteContent(lang).pages.reisefuehrerSeite;
  const guides = getGuides(lang).filter((guide) => isPublished(lang, guide));

  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
        imagePosition={t.heroImagePosition}
        imagePositionMobile={t.heroImagePositionMobile}
        imageZoom={t.heroZoom}
        imageZoomMobile={t.heroZoomMobile}
        title={t.heroTitle}
        text={t.heroText}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={guideDetailPath(lang, guide.slug)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={guide.heroImage}
                    alt={guide.heroImageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="cover-image object-cover transition-transform duration-500"
                    style={imageVars({
                      position: guide.heroImagePosition,
                      positionMobile: guide.heroImagePositionMobile,
                    })}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent-hover">
                    {guide.countries.join(" · ")}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug group-hover:text-accent-hover">
                    {guide.heroTitle}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">{guide.heroText}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent-hover transition-all group-hover:gap-2">
                    {t.cardCta} <ArrowUpRight size={16} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}

            {/* Platzhalter, bis der nächste Reiseführer da ist – macht klar,
                dass die Seite mehr als ein Land werden soll. */}
            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border p-6 sm:p-8">
              <h2 className="text-xl font-semibold leading-snug">{t.moreTitle}</h2>
              <p className="mt-2 leading-relaxed text-muted">{t.moreText}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export function GuideDetailPage({ lang, guide }: { lang: Lang; guide: Guide }) {
  const { pages } = getSiteContent(lang);
  const t = pages.reisefuehrerSeite;
  const posts = getAllPosts(lang).filter((post) =>
    guide.countries.includes(post.country),
  );

  return (
    <>
      <PageHeader
        image={guide.heroImage}
        imageAlt={guide.heroImageAlt}
        imagePosition={guide.heroImagePosition}
        imagePositionMobile={guide.heroImagePositionMobile}
        imageZoom={guide.heroZoom}
        imageZoomMobile={guide.heroZoomMobile}
        eyebrow={t.heroEyebrow}
        title={guide.heroTitle}
        text={guide.heroText}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <Reisefuehrer id={guide.id} lang={lang} ort="reisefuehrer-seite" />

          <div className="mt-16">
            <SectionHeading eyebrow={t.contentsEyebrow} title={t.contentsTitle} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {guide.contents.map((item) => (
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

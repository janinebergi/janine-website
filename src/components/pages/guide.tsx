import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { DownloadLink } from "@/components/download-link";
import { fileSize } from "@/components/guide-download";
import { getSiteContent } from "@/lib/site";
import { getGuides } from "@/lib/guides";
import { imageVars } from "@/lib/object-position";
import type { Lang } from "@/lib/i18n-constants";

// Die Reiseführer-Seite: /reisefuehrer (bzw. /en/travel-guide) listet alle
// Reiseführer, ein Klick auf eine Kachel lädt das PDF direkt herunter. Ziel und
// Knopftext kommen aus denselben Werten wie der Download-Kasten in den
// Beiträgen – steht in `file` später ein Shop, verlinkt die Kachel dorthin.

export function GuideOverviewPage({ lang }: { lang: Lang }) {
  const t = getSiteContent(lang).pages.reisefuehrerSeite;
  const guides = getGuides(lang).flatMap((guide) => {
    const external = /^https?:\/\//.test(guide.file);
    const size = external ? null : fileSize(guide.file, lang);
    // Ohne PDF (und ohne Shop) gibt es nichts herunterzuladen. Lokal steht die
    // Kachel trotzdem da, damit ein neuer Reiseführer schon sichtbar ist.
    if (!external && size === null && process.env.NODE_ENV === "production") return [];
    return [{ ...guide, external, size }];
  });

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
              <DownloadLink
                key={guide.id}
                href={guide.file}
                ort="reisefuehrer-seite"
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
                  <span className="mt-auto flex flex-wrap items-center gap-x-3 pt-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-accent-hover transition-all group-hover:gap-2">
                      {guide.external ? guide.ctaExternal : guide.cta}
                      {guide.external ? (
                        <ArrowUpRight size={16} aria-hidden />
                      ) : (
                        <Download size={16} aria-hidden />
                      )}
                    </span>
                    {guide.size && <span className="text-muted">{guide.size}</span>}
                  </span>
                </div>
              </DownloadLink>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

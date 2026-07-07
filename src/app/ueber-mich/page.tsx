import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/ui/page-header";
import { pages, stats } from "@/lib/site";

const t = pages.ueberMich;
const values = t.values;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

export default function UeberMichPage() {
  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        align="center"
      />

      {/* Einleitungstext */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
            {t.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Button href="/kontakt">{t.ctaButton}</Button>
          </div>
        </Container>
      </section>

      <section className="pb-10">
        <Container>
          <dl className="grid grid-cols-3 gap-8 rounded-2xl border border-border bg-surface/60 p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            align="center"
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {t.gallery.images.map((img) => (
              <div
                key={img.src}
                className="relative aspect-square overflow-hidden rounded-2xl border border-border"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
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
    </>
  );
}

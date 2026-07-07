import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Newspaper,
  Plane,
  FerrisWheel,
  MapPin,
  Waves,
  Wind,
  Trees,
  Dumbbell,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/ui/page-header";
import { pages, stats } from "@/lib/site";
import { iconForStat } from "@/lib/stat-icons";
import { getAllPosts, formatDate } from "@/lib/blog";

const t = pages.ueberMich;
const values = t.values;
const blogTeaser = t.blogTeaser;

// Werdegang und Hobbys als grafische Darstellung der Einleitungstexte.
// Direkt aus den Absätzen von t.paragraphs übernommen, nichts erfunden.
const timeline = [
  {
    icon: GraduationCap,
    title: "Ausbildung zur Kauffrau für Tourismus und Freizeit",
    description:
      "Schon während der Ausbildung erste Texte für Website und Social Media geschrieben.",
  },
  {
    icon: Award,
    title: "Staatlich geprüfte Betriebswirtin, Fachrichtung Tourismus",
    description: "Zusätzliche Weiterbildung im Anschluss an die Ausbildung.",
  },
  {
    icon: Newspaper,
    title: "Medienagentur",
    description: "Ein kurzer Abstecher, bevor es zum Reiseveranstalter ging.",
  },
  {
    icon: Plane,
    title: "alltours – Vertriebsmarketing",
    description:
      "Newsletter und Magazine verfasst – von Buchungshilfen für Reisende bis zu Magazinen für Reisebüros.",
  },
  {
    icon: FerrisWheel,
    title: "Freizeitpark Wisseler See GmbH",
    description: "Bei der Bild- und Textgestaltung der neuen Website mitgeholfen.",
  },
  {
    icon: MapPin,
    title: "Tourismus NRW e.V. (heute)",
    description:
      "Referentin für Kommunikation B2C – schreibt fürs NRW Magazin und ist die Stimme für Social Media.",
  },
];

const hobbies = [
  { icon: Waves, label: "Surfen" },
  { icon: Wind, label: "Inlinern am Rhein" },
  { icon: Trees, label: "Ausritte durch den Wald" },
  { icon: Dumbbell, label: "Kickboxen" },
];

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

export default function UeberMichPage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
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
                href="/blog"
                className="font-medium text-accent-hover underline underline-offset-4 hover:opacity-80"
              >
                Blog
              </Link>
              .
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Button href="/kontakt">{t.ctaButton}</Button>
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
          und Hobbys als Icon-Reihe – im selben Icon-Stil wie die Fakten oben. */}
      <section className="pb-20">
        <Container>
          <SectionHeading
            eyebrow="Mein Weg"
            title="Werdegang"
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

          <div className="mx-auto mt-16 flex max-w-2xl flex-wrap justify-center gap-3">
            {hobbies.map((h) => (
              <span
                key={h.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-2/60"
              >
                <h.icon className="h-4 w-4 text-accent-hover" />
                {h.label}
              </span>
            ))}
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
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span>{post.readingTime} Min.</span>
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
              <Button href="/blog" variant="secondary">
                {blogTeaser.linkText}
              </Button>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

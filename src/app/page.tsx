import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { getSiteContent } from "@/lib/site";
import { getLang } from "@/lib/i18n";
import { iconForStat } from "@/lib/stat-icons";

export default async function Home() {
  const lang = await getLang();
  const { pages, services, site, stats, testimonials } = getSiteContent(lang);
  const t = pages.home;

  return (
    <>
      {/* Großer Header über der Startseite */}
      <section className="relative isolate flex min-h-[88vh] flex-col justify-center overflow-hidden">
        {/* PLATZHALTER-Header-Bild: Quelle in src/lib/site.ts (site.heroImage).
            Später durch ein echtes, aussagekräftiges Bild ersetzen und das
            `unoptimized`-Flag entfernen. */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={site.heroImage}
            alt="Platzhalter – hier folgt das große Header-Bild"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[73%_center] sm:object-center md:object-[72%_center]"
          />
          {/* Overlays: Text links lesbar halten, Bild sichtbar lassen */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/55 to-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>

        <Container className="relative py-28">
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
              <Button href="/kontakt">{t.heroPrimaryCta}</Button>
            </div>
            <p className="text-sm text-muted">{t.heroReferenceNote}</p>
            <p className="text-sm text-muted">
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

      {/* Services */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow={t.servicesEyebrow}
            title={t.servicesTitle}
            description={t.servicesDescription}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-colors hover:border-accent/60"
              >
                <div className="relative aspect-square overflow-hidden sm:aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectPosition: service.imagePosition }}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    {service.teaser}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-hover hover:gap-2 transition-all"
            >
              {t.servicesLink} <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow={t.testimonialsEyebrow}
            title={t.testimonialsTitle}
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/60 p-7"
              >
                <Quote className="text-accent" size={28} />
                <blockquote className="leading-relaxed text-foreground/90">
                  „{t.quote}"
                </blockquote>
                <figcaption className="mt-auto">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

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
              <Button href="/kontakt">{t.ctaButton}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Check, Pencil } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/ui/page-header";
import { pages, services, mediakit } from "@/lib/site";

const t = pages.leistungen;
const deliverables = t.deliverables;
const process = t.process;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

export default function LeistungenPage() {
  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <p className="max-w-3xl text-lg leading-relaxed text-muted">
            {t.heroText}
          </p>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-border bg-surface/60 p-8 transition-colors hover:border-accent/60"
              >
                <h2 className="text-2xl font-semibold">{service.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                      <Check size={16} className="mt-0.5 flex-none text-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow={t.deliverablesEyebrow}
              title={t.deliverablesTitle}
              description={t.deliverablesDescription}
            />
            <ul className="grid gap-4 sm:grid-cols-2">
              {deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-soft text-accent-hover">
                    <Check size={14} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={mediakit.ratesEyebrow}
              title={mediakit.ratesTitle}
              description={mediakit.ratesIntro}
            />
            <a
              href="/admin#mediakit"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-accent-hover transition-colors hover:text-accent"
            >
              <Pencil size={14} />
              Media Kit bearbeiten
            </a>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {mediakit.rates.map((rate) => (
              <div
                key={rate.title}
                className="flex flex-col rounded-2xl border border-border bg-surface/60 p-6"
              >
                <h3 className="text-lg font-semibold leading-tight">
                  {rate.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-accent-hover">
                  {rate.subtitle}
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {rate.steps.map((step) => (
                    <li
                      key={step}
                      className="flex items-start gap-2 text-[13px] leading-relaxed text-muted"
                    >
                      <Check size={13} className="mt-0.5 flex-none text-accent-hover" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <span className="text-xs text-muted">Preis</span>
                  <div className="text-2xl font-semibold text-foreground">
                    {rate.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft/40 p-8">
            <h3 className="text-xl font-semibold">{mediakit.pricingNoteTitle}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/85">
              {mediakit.pricingNoteText}
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <SectionHeading
            eyebrow="Referenzen"
            title={mediakit.brandsTitle}
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {mediakit.brands.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium text-foreground/90"
              >
                {brand}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow={t.processEyebrow}
            title={t.processTitle}
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="rounded-2xl border border-border bg-surface/60 p-7"
              >
                <span className="text-sm font-semibold text-accent">
                  {p.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button href="/kontakt">{t.ctaButton}</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

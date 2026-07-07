import type { Metadata } from "next";
import Image from "next/image";
import { Check, Mail, Globe, Linkedin } from "lucide-react";
import { MediakitDownload } from "@/components/mediakit-download";
import { mediakit, pages, site, stats } from "@/lib/site";

const t = mediakit;
const values = pages.ueberMich.values;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-accent-hover">
      <span className="h-px w-8 bg-accent" />
      {children}
    </span>
  );
}

export default function MediakitPage() {
  return (
    <div className="bg-surface-2/40 py-10 print:bg-bg print:py-0">
      {/* Bedienleiste – erscheint nicht im PDF */}
      <div className="mk-no-print mx-auto mb-8 flex w-full max-w-[210mm] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Media Kit</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">{t.printHint}</p>
        </div>
        <MediakitDownload label={t.downloadLabel} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Blatt 1 – Profil, Warum ich, Marken                              */}
      {/* ---------------------------------------------------------------- */}
      <article className="mk-sheet relative flex flex-col gap-8 rounded-[1.5rem] border border-border p-[16mm] shadow-2xl shadow-black/40 print:gap-8">
        <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-56" />

        {/* Kopf */}
        <header className="relative flex flex-col gap-3">
          <Eyebrow>{t.coverEyebrow}</Eyebrow>
          <h2 className="text-5xl font-semibold leading-[1.02] tracking-tight">
            {site.name}
          </h2>
          <p className="text-lg text-accent-hover">{t.coverRole}</p>
          <p className="max-w-xl text-sm italic text-muted">{site.tagline}</p>
        </header>

        {/* Portrait + Intro */}
        <section className="relative grid grid-cols-[68mm_1fr] gap-8">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border">
            <Image
              src={t.portraitImage}
              alt={t.portraitAlt}
              fill
              sizes="68mm"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-[13px] leading-relaxed text-foreground/85">
              {t.intro}
            </p>
            <dl className="grid grid-cols-2 gap-6 border-t border-border/60 pt-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-semibold text-foreground">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Warum ich */}
        <section className="relative flex flex-col gap-5">
          <Eyebrow>{t.valuesTitle}</Eyebrow>
          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface/60 p-5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-muted">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Marken */}
        <section className="relative mt-auto flex flex-col gap-4">
          <Eyebrow>{t.brandsTitle}</Eyebrow>
          <div className="flex flex-wrap gap-3">
            {t.brands.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium text-foreground/90"
              >
                {brand}
              </span>
            ))}
          </div>
        </section>
      </article>

      {/* ---------------------------------------------------------------- */}
      {/* Blatt 2 – Services & Raten                                        */}
      {/* ---------------------------------------------------------------- */}
      <article className="mk-sheet relative mt-10 flex flex-col gap-8 rounded-[1.5rem] border border-border p-[16mm] shadow-2xl shadow-black/40 print:mt-0">
        <header className="flex flex-col gap-3">
          <Eyebrow>{t.ratesEyebrow}</Eyebrow>
          <h2 className="text-4xl font-semibold tracking-tight">
            {t.ratesTitle}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {t.ratesIntro}
          </p>
        </header>

        <section className="grid grid-cols-3 gap-5">
          {t.rates.map((rate) => (
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
                    className="flex items-start gap-2 text-[12px] leading-relaxed text-muted"
                  >
                    <Check
                      size={13}
                      className="mt-0.5 flex-none text-accent-hover"
                    />
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
        </section>

        {/* Preis-Erklärung */}
        <section className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-8">
          <h3 className="text-xl font-semibold">{t.pricingNoteTitle}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/85">
            {t.pricingNoteText}
          </p>
        </section>

        {/* Kontakt-Fuß */}
        <footer className="mt-auto flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold">{site.name}</div>
            <div className="text-sm text-accent-hover">{t.coverRole}</div>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Mail size={14} className="text-accent-hover" />
              {site.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe size={14} className="text-accent-hover" />
              {site.url.replace(/^https?:\/\//, "")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Linkedin size={14} className="text-accent-hover" />
              {site.social.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          </div>
        </footer>
      </article>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import {
  projects,
  services,
  site,
  stats,
  testimonials,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
        <Container className="relative pb-20 pt-20 sm:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start gap-6">
              <Eyebrow>{site.role} · {site.tagline}</Eyebrow>
              <h1 className="text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Texte, die <span className="text-gradient">Fernweh</span> wecken
                — und Reisende zur Buchung bewegen.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                Ich bin {site.name}, Copywriterin für Reise- und
                Tourismusunternehmen. Ich helfe dir, deine Angebote mit Worten
                ins beste Licht zu rücken – auf Websites, in Blogs und
                Newslettern.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href="/kontakt">Projekt anfragen</Button>
                <Button href="/arbeiten" variant="secondary">
                  Arbeiten ansehen
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-8 border-t border-border/60 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-3xl font-semibold text-foreground">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/10 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border">
                <Image
                  src="https://picsum.photos/seed/janine-hero/900/1100"
                  alt="Janine Bergmann bei der Arbeit"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Leistungen"
            title="Worte, die deine Reiseangebote verkaufen"
            description="Von der Website über den Blog bis zum Newsletter — Texte, die Emotionen wecken, Fernweh entfachen und deine Marke unvergesslich machen."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-border bg-surface/60 p-7 transition-colors hover:border-accent/60"
              >
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-hover hover:gap-2 transition-all"
            >
              Alle Leistungen <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured work */}
      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Arbeiten"
              title="Ausgewählte Projekte"
              description="Ein Auszug aus Reise- und Tourismusprojekten. Echte Referenzen folgen in Kürze."
            />
            <Button href="/arbeiten" variant="secondary" className="hidden sm:inline-flex">
              Alle Arbeiten
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <Link
                key={project.title}
                href="/arbeiten"
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-xs uppercase tracking-widest text-accent-hover">
                    {project.category}
                  </span>
                  <h3 className="mt-1 text-sm font-medium leading-snug">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Stimmen"
            title="Was Kund:innen sagen"
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
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
                Bereit für Texte, die wirken?
              </h2>
              <p className="text-lg text-muted">
                Erzähl mir von deinem Projekt — ich melde mich innerhalb von 24
                Stunden mit den nächsten Schritten.
              </p>
              <Button href="/kontakt">Jetzt Projekt anfragen</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

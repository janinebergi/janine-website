import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Copywriting für Reise- und Tourismusunternehmen: Website-Texte, Blogbeiträge und Newsletter, die Fernweh wecken und Reisende zur Buchung bewegen.",
};

const deliverables = [
  "Website- & Landingpage-Texte",
  "Reise-Blogbeiträge mit SEO",
  "Newsletter & E-Mail-Strecken",
  "Destinations- & Hotelbeschreibungen",
  "Magazine & Buchungsunterlagen",
  "Storytelling & Über-uns-Seiten",
];

const process = [
  {
    step: "01",
    title: "Kennenlernen & Briefing",
    description:
      "Wir klären Ziele, Zielgruppe und Tonalität. Ich tauche tief in deine Marke ein.",
  },
  {
    step: "02",
    title: "Recherche & Strategie",
    description:
      "Markt, Wettbewerb und Kundenstimmen — daraus entsteht die Textstrategie.",
  },
  {
    step: "03",
    title: "Schreiben & Feinschliff",
    description:
      "Erste Fassung, gemeinsames Feedback, zwei Korrekturschleifen inklusive.",
  },
  {
    step: "04",
    title: "Übergabe & Wirkung",
    description:
      "Fertige Texte, sauber dokumentiert und bereit für den Einsatz.",
  },
];

export default function LeistungenPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Leistungen</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Weil gute Werbung kein Zufall, sondern Wortwahl ist.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Ich helfe Reise- und Tourismusunternehmen dabei, ihre Angebote mit
              Texten ins beste Licht zu rücken. Ob Website, Blog oder Newsletter –
              ich schreibe Texte, die nicht nur informieren, sondern Emotionen
              wecken, Fernweh entfachen und deine Angebote erfolgreich verkaufen.
            </p>
          </div>
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
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Was du bekommst"
              title="Alles aus einer Feder"
              description="Eine Auswahl der Formate, die ich regelmäßig schreibe. Du brauchst etwas anderes? Frag einfach."
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
          <SectionHeading
            eyebrow="Ablauf"
            title="So arbeiten wir zusammen"
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
            <Button href="/kontakt">Unverbindlich anfragen</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

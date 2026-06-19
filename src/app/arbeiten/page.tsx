import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Arbeiten",
  description:
    "Ausgewählte Copywriting-Projekte von Janine Bergmann für Reise- und Tourismusunternehmen — Website-Texte, Blogbeiträge und Newsletter.",
};

// PLATZHALTER: Echte Referenzprojekte hier eintragen (Titel, Kategorie, Ergebnis, Beschreibung, Bild).
const work = [
  {
    title: "Referenzprojekt folgt",
    category: "Website-Texte",
    result: "Referenz folgt",
    description:
      "Platzhalter für ein Website-Projekt aus dem Tourismus – z. B. Neutextung einer Destinations- oder Hotelseite.",
    image: "https://picsum.photos/seed/reise1/1200/900",
  },
  {
    title: "Referenzprojekt folgt",
    category: "Blogbeiträge",
    result: "Referenz folgt",
    description:
      "Platzhalter für einen SEO-Reiseblog, der Fernweh weckt und Angebote mit Geschichten zum Leben erweckt.",
    image: "https://picsum.photos/seed/reise2/1200/900",
  },
  {
    title: "Referenzprojekt folgt",
    category: "Newsletter",
    result: "Referenz folgt",
    description:
      "Platzhalter für eine Newsletter-Strecke, die Nähe schafft und zuverlässig zu Buchungen führt.",
    image: "https://picsum.photos/seed/reise3/1200/900",
  },
];

export default function ArbeitenPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Arbeiten</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Projekte, die Reiseträume verkaufen.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Eine Auswahl meiner Arbeiten für Reise- und Tourismusunternehmen.
              Echte Referenzen folgen in Kürze – die Plätze hier sind schon
              reserviert.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {work.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-border bg-surface/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 text-xs font-medium text-accent-hover backdrop-blur">
                    {item.result}
                  </span>
                </div>
                <div className="p-7">
                  <span className="text-xs uppercase tracking-widest text-accent-hover">
                    {item.category}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] border border-border bg-surface px-8 py-14 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Dein Projekt könnte das nächste sein.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Lass uns über deine Ziele sprechen — und wie die richtigen Worte
              dich dorthin bringen.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/kontakt">Projekt anfragen</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

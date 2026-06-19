import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { site, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Lerne Janine Bergmann kennen — Copywriterin mit einem Faible für klare, wirksame Sprache.",
};

const values = [
  {
    title: "Reise-Expertise & Storytelling",
    description:
      "Texte, die Emotionen wecken, Fernweh auslösen und Reisende zur Buchung bewegen.",
  },
  {
    title: "SEO-optimierte Inhalte",
    description:
      "Suchmaschinenfreundliche Reisetexte, die deine Website sichtbarer machen – ohne gekünstelte Keywords.",
  },
  {
    title: "Maßgeschneiderte Lösungen",
    description:
      "Individuelle Texte für dein Reisebusiness – von der Website über den Blog bis zum Newsletter.",
  },
  {
    title: "Zuverlässigkeit & Markenstimme",
    description:
      "Pünktliche Lieferung, klare Sprache und ein konsistenter Auftritt über alle Kanäle hinweg.",
  },
];

export default function UeberMichPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
        <Container className="py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/10 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border">
                <Image
                  src="https://picsum.photos/seed/janine-portrait/900/1100"
                  alt="Porträt von Janine Bergmann"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <Eyebrow>Über mich</Eyebrow>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                Wer bin ich?
              </h1>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  Ich bin {site.name} und liebe es nicht nur zu reisen, sondern
                  auch darüber zu schreiben. Ich bin ein absoluter Action-Fan und
                  stürze mich gern in das nächste Abenteuer.
                </p>
                <p>
                  Wenn ich gerade nicht auf der nächsten Welle unterwegs bin,
                  wohne ich in Düsseldorf am schönen Rhein. Auch hier suche ich
                  abseits der Arbeit nach Action: ob mit Inlinern am Rhein
                  entlang, einem Ausritt durch den Wald oder beim Kickboxen – ich
                  bin immer auf der Suche nach neuen Herausforderungen.
                </p>
                <p>
                  Reisen, Sport und Abenteuer prägen meinen Alltag und meine
                  Geschichten. Egal ob weit weg oder direkt vor der Haustür – ich
                  liebe es, jede Gelegenheit zu nutzen, um Neues zu erleben und
                  authentische Reiseerfahrungen zu sammeln.
                </p>
                <p>
                  Da mich neben meinen privaten Reisen auch der Tourismus
                  beruflich begeistert, habe ich nach meiner Ausbildung als
                  Kauffrau für Tourismus und Freizeit zusätzlich meinen staatlich
                  geprüften Betriebswirt in der Fachrichtung Tourismus
                  abgeschlossen. Schon während dieser Zeit habe ich in meinem
                  Ausbildungsbetrieb Texte für die Website sowie Social Media
                  geschrieben.
                </p>
                <p>
                  Nach einem kurzen Abstecher in eine Medienagentur führte mich
                  mein Weg zum Reiseveranstalter alltours. Im Vertriebsmarketing
                  konnte ich meine Schreibkenntnisse weiter vertiefen und
                  verfasste zahlreiche Newsletter, Magazine und Buchungshilfen –
                  immer mit dem Ziel, Reisen und Destinationen ansprechend zu
                  präsentieren.
                </p>
                <p>
                  Heute vermarkte ich Nordrhein-Westfalen mit seinen vielen
                  Schlössern, Burgen und Naturerlebnissen als eines der schönsten
                  Reiseländer Deutschlands – und lebe dabei meine Leidenschaft für
                  Reisen, Outdoor-Abenteuer und Storytelling jeden Tag aus.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/kontakt">Lass uns sprechen</Button>
              </div>
            </div>
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
            eyebrow="Warum ich?"
            title="Was du von mir bekommst"
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

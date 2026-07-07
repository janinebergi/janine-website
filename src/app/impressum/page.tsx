import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${site.name}.`,
  robots: { index: false, follow: true },
};

// Rechtlich erforderliche Angaben nach § 5 DDG (Digitale-Dienste-Gesetz).
// Die mit ⟨…⟩ markierten Platzhalter bitte durch die echten Daten ersetzen.
const contact = {
  name: site.name,
  street: "⟨Straße und Hausnummer⟩",
  city: "⟨PLZ Ort⟩",
  country: "Deutschland",
  phone: "⟨Telefonnummer⟩",
  email: site.email,
};

export default function ImpressumPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>Rechtliches</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            Impressum
          </h1>

          <div className="mt-12 space-y-10 text-muted">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Angaben gemäß § 5 DDG
              </h2>
              <address className="mt-3 not-italic leading-relaxed">
                {contact.name}
                <br />
                {contact.street}
                <br />
                {contact.city}
                <br />
                {contact.country}
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
              <div className="mt-3 leading-relaxed">
                <div>
                  Telefon:{" "}
                  <span className="text-foreground">{contact.phone}</span>
                </div>
                <div>
                  E-Mail:{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Redaktionell verantwortlich
              </h2>
              <address className="mt-3 not-italic leading-relaxed">
                {contact.name}
                <br />
                {contact.street}
                <br />
                {contact.city}
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p className="mt-3 leading-relaxed">
                Ich bin nicht bereit und nicht verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucher­schlichtungsstelle
                teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Haftung für Inhalte
              </h2>
              <p className="mt-3 leading-relaxed">
                Als Diensteanbieterin bin ich gemäß § 7 Abs. 1 DDG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 DDG bin ich als
                Diensteanbieterin jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
                hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab
                dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
                werde ich diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Haftung für Links
              </h2>
              <p className="mt-3 leading-relaxed">
                Mein Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
                der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte
                einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                Rechtsverletzungen werde ich derartige Links umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Urheberrecht
              </h2>
              <p className="mt-3 leading-relaxed">
                Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung der jeweiligen Autorin bzw.
                Erstellerin. Downloads und Kopien dieser Seite sind nur für den
                privaten, nicht kommerziellen Gebrauch gestattet. Soweit die
                Inhalte auf dieser Seite nicht von der Betreiberin erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
                werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitte
                ich um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werde ich derartige Inhalte umgehend
                entfernen.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

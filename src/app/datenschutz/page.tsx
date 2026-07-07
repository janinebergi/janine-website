import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklärung von ${site.name} – Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.`,
  robots: { index: false, follow: true },
};

// Datenschutzerklärung nach Art. 13 DSGVO. Die mit ⟨…⟩ markierten Platzhalter
// bitte durch die echten Daten ersetzen. Die Website erhebt selbst keine Daten
// über Formulare (das Kontaktformular öffnet nur das E-Mail-Programm), setzt
// kein Tracking ein und bindet Schriften über next/font selbst gehostet ein.
const controller = {
  name: site.name,
  street: "⟨Straße und Hausnummer⟩",
  city: "⟨PLZ Ort⟩",
  country: "Deutschland",
  phone: "⟨Telefonnummer⟩",
  email: site.email,
};

export default function DatenschutzPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>Rechtliches</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-6 text-muted">
            Der Schutz deiner personenbezogenen Daten ist mir wichtig. Nachfolgend
            informiere ich dich darüber, welche Daten beim Besuch dieser Website
            verarbeitet werden und welche Rechte dir zustehen.
          </p>

          <div className="mt-12 space-y-10 text-muted">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                1. Verantwortliche
              </h2>
              <p className="mt-3 leading-relaxed">
                Verantwortlich für die Datenverarbeitung auf dieser Website im
                Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              </p>
              <address className="mt-3 not-italic leading-relaxed">
                {controller.name}
                <br />
                {controller.street}
                <br />
                {controller.city}
                <br />
                {controller.country}
                <br />
                <br />
                Telefon:{" "}
                <span className="text-foreground">{controller.phone}</span>
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${controller.email}`}
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {controller.email}
                </a>
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                2. Zugriffsdaten &amp; Server-Logfiles
              </h2>
              <p className="mt-3 leading-relaxed">
                Beim Aufruf dieser Website werden durch den Hosting-Anbieter
                automatisch Informationen erfasst, die dein Browser übermittelt.
                Dies sind insbesondere: IP-Adresse, Datum und Uhrzeit des
                Zugriffs, aufgerufene Seite, verwendeter Browser und
                Betriebssystem sowie die zuvor besuchte Seite (Referrer). Diese
                Daten sind technisch erforderlich, um die Website anzuzeigen und
                ihre Stabilität und Sicherheit zu gewährleisten. Rechtsgrundlage
                ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
                sicheren und funktionsfähigen Angebot). Eine Zusammenführung
                dieser Daten mit anderen Datenquellen oder eine Auswertung zu
                Marketingzwecken findet nicht statt.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                3. Hosting
              </h2>
              <p className="mt-3 leading-relaxed">
                Diese Website wird bei einem externen Dienstleister gehostet:
                ⟨Name und Anschrift des Hosting-Anbieters, z. B. Vercel Inc.⟩. Der
                Anbieter verarbeitet die im Rahmen des Websitebesuchs anfallenden
                Daten (siehe „Zugriffsdaten &amp; Server-Logfiles") in meinem
                Auftrag auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mit dem
                Anbieter besteht ein Vertrag zur Auftragsverarbeitung (Art. 28
                DSGVO), der den datenschutzkonformen Umgang mit den Daten
                sicherstellt.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                4. Kontaktaufnahme
              </h2>
              <p className="mt-3 leading-relaxed">
                Das Kontaktformular auf dieser Website speichert deine Eingaben
                nicht auf einem Server. Beim Absenden öffnet sich lediglich dein
                eigenes E-Mail-Programm mit den von dir eingegebenen Angaben
                (Name, E-Mail-Adresse und Nachricht), sodass du die Nachricht
                selbst versendest. Nimmst du per E-Mail oder Telefon Kontakt mit
                mir auf, verarbeite ich die von dir übermittelten Angaben zur
                Bearbeitung deiner Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit.
                b DSGVO (Anbahnung bzw. Erfüllung eines Vertrags) bzw. Art. 6 Abs.
                1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung deiner
                Anfrage). Ich lösche diese Daten, sobald sie für den Zweck ihrer
                Erhebung nicht mehr erforderlich sind und keine gesetzlichen
                Aufbewahrungspflichten entgegenstehen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                5. Schriftarten (Fonts)
              </h2>
              <p className="mt-3 leading-relaxed">
                Zur einheitlichen Darstellung von Schriftarten verwendet diese
                Website lokal gehostete Schriften. Die Schriftdateien werden
                direkt vom Server dieser Website geladen; es wird dabei keine
                Verbindung zu Servern Dritter (etwa Google Fonts) hergestellt und
                keine IP-Adresse an Dritte übermittelt.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                6. Cookies &amp; Analyse
              </h2>
              <p className="mt-3 leading-relaxed">
                Diese Website setzt keine Cookies zu Tracking- oder Marketing­zwecken
                ein und verwendet keine Analyse- oder Reichweitenmessungs-Dienste.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                7. Deine Rechte
              </h2>
              <p className="mt-3 leading-relaxed">
                Dir stehen hinsichtlich deiner personenbezogenen Daten folgende
                Rechte zu: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
                Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18
                DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch
                gegen die Verarbeitung (Art. 21 DSGVO). Zur Ausübung dieser Rechte
                genügt eine formlose Nachricht an die oben genannten Kontaktdaten.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                8. Beschwerderecht bei der Aufsichtsbehörde
              </h2>
              <p className="mt-3 leading-relaxed">
                Unabhängig davon steht dir das Recht zu, dich bei einer
                Datenschutz-Aufsichtsbehörde zu beschweren, wenn du der Ansicht
                bist, dass die Verarbeitung deiner personenbezogenen Daten gegen
                die DSGVO verstößt.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                9. Aktualität dieser Datenschutzerklärung
              </h2>
              <p className="mt-3 leading-relaxed">
                Diese Datenschutzerklärung wird bei Bedarf angepasst, um sie an
                geänderte rechtliche Rahmenbedingungen oder Änderungen der Website
                anzupassen. Es gilt jeweils die hier veröffentlichte, aktuelle
                Fassung.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

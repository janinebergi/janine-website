import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";

export async function ImprintPage({ lang }: { lang: Lang }) {
  const { site, pages } = getSiteContent(lang);
  const t = pages.impressum;
  const contact = {
    // Rechtstexte brauchen den vollstaendigen Namen, nicht die Kurzform
    // aus dem Seitenkopf.
    name: site.fullName,
    street: t.contact.street,
    city: t.contact.city,
    country: t.contact.country,
    email: site.email,
  };

  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            {t.title}
          </h1>

          <div className="mt-12 space-y-10 text-muted">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t.addressHeading}
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
              <h2 className="text-lg font-semibold text-foreground">{t.contactHeading}</h2>
              <div className="mt-3 leading-relaxed">
                <div>
                  {t.emailLabel}{" "}
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
                {t.editorialHeading}
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
                {t.disputeHeading}
              </h2>
              <p className="mt-3 leading-relaxed">{t.disputeText}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t.liabilityContentHeading}
              </h2>
              <p className="mt-3 leading-relaxed">{t.liabilityContentText}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t.liabilityLinksHeading}
              </h2>
              <p className="mt-3 leading-relaxed">{t.liabilityLinksText}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t.copyrightHeading}
              </h2>
              <p className="mt-3 leading-relaxed">{t.copyrightText}</p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

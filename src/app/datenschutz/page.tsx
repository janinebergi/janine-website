import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { pages as pagesDe, getSiteContent } from "@/lib/site";
import { getLang } from "@/lib/i18n";

const tDe = pagesDe.datenschutz;

export const metadata: Metadata = {
  title: tDe.metaTitle,
  description: tDe.metaDescription,
  robots: { index: false, follow: true },
};

export default async function DatenschutzPage() {
  const lang = await getLang();
  const { site, pages } = getSiteContent(lang);
  const t = pages.datenschutz;
  const controller = {
    name: site.name,
    street: t.controller.street,
    city: t.controller.city,
    country: t.controller.country,
    phone: t.controller.phone,
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
          <p className="mt-6 text-muted">{t.intro}</p>

          <div className="mt-12 space-y-10 text-muted">
            {t.sections.map((section, i) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-foreground">
                  {section.heading}
                </h2>
                <p className="mt-3 leading-relaxed">{section.text}</p>
                {i === 0 && (
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
                    {t.phoneLabel}{" "}
                    <span className="text-foreground">{controller.phone}</span>
                    <br />
                    {t.emailLabel}{" "}
                    <a
                      href={`mailto:${controller.email}`}
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      {controller.email}
                    </a>
                  </address>
                )}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import { Mail, Clock, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Schreib Janine Bergmann für dein nächstes Copywriting-Projekt — Antwort innerhalb von 24 Stunden.",
};

const points = [
  {
    icon: Mail,
    title: "E-Mail",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: Clock,
    title: "Antwortzeit",
    value: "Innerhalb von 24 Stunden",
  },
  {
    icon: MessageCircle,
    title: "Erstgespräch",
    value: "Kostenlos & unverbindlich",
  },
];

export default function KontaktPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Kontakt</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Erzähl mir von deinem Projekt.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Du hast Interesse an meinen Texten oder möchtest über dein Projekt
              sprechen? Dann schreib mir einfach kurz, worum es geht – ich melde
              mich zeitnah und persönlich bei dir zurück.
            </p>

            <div className="mt-10 flex flex-col gap-5">
              {points.map((p) => {
                const Icon = p.icon;
                const content = (
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="text-sm text-muted">{p.title}</div>
                      <div className="font-medium">{p.value}</div>
                    </div>
                  </div>
                );
                return p.href ? (
                  <a key={p.title} href={p.href} className="transition-opacity hover:opacity-80">
                    {content}
                  </a>
                ) : (
                  <div key={p.title}>{content}</div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

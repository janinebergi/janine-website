import Image from "next/image";
import { type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";

// Einheitlicher Seiten-Header: breites Banner-Bild mit Verlauf, darüber
// Eyebrow, Titel und optional ein kurzer Einleitungstext. Wird auf allen
// Unterseiten verwendet, damit der Aufbau konsistent bleibt.
export function PageHeader({
  image,
  imageAlt,
  imagePosition,
  eyebrow,
  title,
  text,
  align = "left",
}: {
  image: string;
  imageAlt: string;
  imagePosition?: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <section
      className={`relative isolate flex min-h-[45vh] items-end overflow-hidden sm:min-h-[52vh] ${
        centered ? "sm:items-center" : ""
      }`}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
      </div>
      <Container className={`py-14 ${centered ? "sm:text-center" : ""}`}>
        <div
          className={`max-w-3xl ${centered ? "sm:mx-auto sm:flex sm:flex-col sm:items-center" : ""}`}
        >
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {text && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80">
              {text}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

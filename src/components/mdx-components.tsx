import path from "node:path";
import sharp from "sharp";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { BudgetChart } from "@/components/budget-chart";
import { Faq, FaqItem } from "@/components/faq";
import { Fotos } from "@/components/photo-strip";
import { slugify } from "@/lib/slugify";

// Extrahiert reinen Text aus den Kind-Elementen einer Überschrift, damit
// dieselbe Slug-Logik wie beim Inhaltsverzeichnis (lib/toc.ts) greift.
function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props &&
    typeof children.props === "object" &&
    "children" in children.props
  ) {
    return headingText((children.props as { children: ReactNode }).children);
  }
  return "";
}

// Bilder im Fließtext. Die Fotos sind fast immer hochkant aufgenommen; mit
// einem festen Seitenverhältnis bliebe davon nur ein schmaler Streifen übrig.
// Deshalb werden die echten Maße aus der Datei gelesen, das Bild behält sein
// Seitenverhältnis und wird nur in der Höhe begrenzt, damit ein Hochformat
// nicht den halben Beitrag einnimmt.
const dimensionCache = new Map<string, { width: number; height: number }>();

async function imageDimensions(src: string) {
  const cached = dimensionCache.get(src);
  if (cached) return cached;

  // Markdown kodiert Leer- und Sonderzeichen in der Bildadresse; für den
  // Dateizugriff muss das wieder rückgängig gemacht werden.
  const file = path.join(process.cwd(), "public", decodeURIComponent(src));
  let size = { width: 1200, height: 1600 };
  try {
    const meta = await sharp(file).metadata();
    if (meta.width && meta.height) size = { width: meta.width, height: meta.height };
  } catch {
    // Fehlt die Datei oder ist das Format unbekannt, bleibt es beim Rückfallwert.
  }
  dimensionCache.set(src, size);
  return size;
}

async function MdxImage({ src, alt }: { src: string; alt: string }) {
  const { width, height } = await imageDimensions(src);
  return (
    <span className="my-8 flex justify-center">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 640px"
        className="h-auto max-h-[70vh] w-auto max-w-full rounded-2xl border border-border"
      />
    </span>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  BudgetChart,
  Faq,
  FaqItem,
  Fotos,
  h2: (props) => {
    const { children } = props as { children: ReactNode };
    return (
      <h2 id={slugify(headingText(children))} className="scroll-mt-28">
        {children}
      </h2>
    );
  },
  // Interne Verweise im Fließtext laufen über next/link (kein Neuladen der
  // Seite), externe bekommen die üblichen Sicherheits-Attribute.
  a: (props) => {
    const { href = "", children } = props as { href?: string; children: ReactNode };
    if (href.startsWith("/")) {
      return <Link href={href}>{children}</Link>;
    }
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  img: (props) => {
    const { src = "", alt = "" } = props as { src?: string; alt?: string };
    return <MdxImage src={src} alt={alt} />;
  },
};

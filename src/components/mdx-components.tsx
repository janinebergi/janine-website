import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { BudgetChart } from "@/components/budget-chart";
import { Faq, FaqItem } from "@/components/faq";
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

export const mdxComponents: MDXRemoteProps["components"] = {
  BudgetChart,
  Faq,
  FaqItem,
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
    return (
      <span className="my-8 block overflow-hidden rounded-2xl border border-border">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={700}
          className="h-auto w-full object-cover"
        />
      </span>
    );
  },
};

import type { ReactNode } from "react";
import Image from "next/image";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { SriLankaRouteMap } from "@/components/route-map";
import { BaliRouteMap } from "@/components/bali-route-map";
import { MoroccoRouteMap } from "@/components/morocco-route-map";
import { PortugalRouteMap } from "@/components/portugal-route-map";
import { ScotlandRouteMap } from "@/components/scotland-route-map";
import { FloridaRouteMap } from "@/components/florida-route-map";
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
  SriLankaRouteMap,
  BaliRouteMap,
  MoroccoRouteMap,
  PortugalRouteMap,
  ScotlandRouteMap,
  FloridaRouteMap,
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

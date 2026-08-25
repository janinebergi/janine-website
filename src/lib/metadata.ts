// Einheitlicher Metadaten-Baukasten für alle Seiten: Titel, Beschreibung,
// canonical, hreflang und Open Graph an einer Stelle. Next.js ersetzt bei
// verschachtelten Metadaten das komplette openGraph-Objekt des Layouts –
// deshalb werden siteName, locale und Bild hier jedes Mal mitgegeben.
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import type { PathSet } from "@/lib/routes";
import {
  OPEN_GRAPH_LOCALE,
  aboutPath,
  absoluteUrl,
  localeAlternates,
} from "@/lib/routes";

const DEFAULT_OG_IMAGE = "/assets/website/allgemein/og-home.jpg";

export function pageMetadata(
  lang: Lang,
  opts: {
    title: string;
    description: string;
    paths: PathSet;
    type?: "website" | "article" | "profile";
    // Weglassen = generiertes Bild der Route bzw. Standardbild der Seite
    image?: string | null;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    section?: string;
    noindex?: boolean;
  },
): Metadata {
  const { site } = getSiteContent(lang);
  const url = absoluteUrl(opts.paths[lang]!);
  const image = opts.image === undefined ? DEFAULT_OG_IMAGE : opts.image;

  return {
    title: opts.title,
    description: opts.description,
    alternates: localeAlternates(lang, opts.paths),
    authors: [{ name: site.fullName, url: absoluteUrl(aboutPath(lang)) }],
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.fullName,
      locale: OPEN_GRAPH_LOCALE[lang],
      type: opts.type ?? "website",
      ...(opts.type === "article"
        ? {
            publishedTime: opts.publishedTime,
            modifiedTime: opts.modifiedTime ?? opts.publishedTime,
            authors: [site.fullName],
            tags: opts.tags,
            section: opts.section,
          }
        : {}),
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...(image ? { images: [image] } : {}),
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

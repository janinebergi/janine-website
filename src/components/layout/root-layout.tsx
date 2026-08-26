import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteContent } from "@/lib/site";
import { getLangPaths } from "@/lib/lang-paths";
import type { Lang } from "@/lib/i18n-constants";
import {
  OPEN_GRAPH_LOCALE,
  absoluteUrl,
  homePath,
  localeAlternates,
  pathsFor,
} from "@/lib/routes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const HTML_LANG: Record<Lang, string> = { de: "de-DE", en: "en" };

// Gemeinsame Basis-Metadaten beider Sprachfassungen. Titel und Beschreibung
// einzelner Seiten überschreiben das jeweils; hier stehen nur die Vorgaben.
export function rootMetadata(lang: Lang): Metadata {
  const { site } = getSiteContent(lang);
  const paths = pathsFor(homePath);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.fullName} — ${site.role}`,
      template: `%s — ${site.fullName}`,
    },
    description: site.description,
    alternates: localeAlternates(lang, paths),
    icons: {
      icon: [
        { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: `${site.fullName} — ${site.role}`,
      description: site.description,
      url: absoluteUrl(homePath(lang)),
      siteName: site.fullName,
      locale: OPEN_GRAPH_LOCALE[lang],
      type: "website",
      images: [
        {
          url: "/assets/website/allgemein/og-home.jpg",
          width: 1200,
          height: 675,
          alt: `${site.fullName} — ${site.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.fullName} — ${site.role}`,
      description: site.description,
      images: ["/assets/website/allgemein/og-home.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

// Beide Sprachbäume ((de) und (en)) rendern dieselbe Hülle – nur mit
// unterschiedlichem lang-Attribut und passenden Navigationspfaden.
export function SiteShell({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <html lang={HTML_LANG[lang]} className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <Header lang={lang} langPaths={getLangPaths(lang)} />
        <main>{children}</main>
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}

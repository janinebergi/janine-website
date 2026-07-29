import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteContent } from "@/lib/site";
import { getLang } from "@/lib/i18n";

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

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { site } = getSiteContent(lang);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.role}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title: `${site.name} — ${site.role}`,
      description: site.description,
      url: site.url,
      siteName: site.name,
      locale: lang === "en" ? "en_US" : "de_DE",
      type: "website",
      images: [
        {
          url: "/assets/website/allgemein/og-home.jpg",
          width: 1200,
          height: 675,
          alt: `${site.name} — ${site.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.role}`,
      description: site.description,
      images: ["/assets/website/allgemein/og-home.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();

  return (
    <html lang={lang} className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <Header lang={lang} />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

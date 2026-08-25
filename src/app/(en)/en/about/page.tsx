import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { aboutPath, absoluteUrl, homePath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.ueberMich;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(aboutPath),
  type: "profile",
});

export default function Page() {
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: absoluteUrl(aboutPath(LANG)),
            mainEntity: personSchema(LANG),
          },
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: t.heroTitle, path: aboutPath(LANG) },
          ]),
        ]}
      />
      <AboutPage lang={LANG} />
    </>
  );
}

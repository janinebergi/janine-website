import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { absoluteUrl, contactPath, homePath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.kontakt;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(contactPath),
});

export default function Page() {
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl(contactPath(LANG)),
            mainEntity: personSchema(LANG),
          },
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: t.heroTitle, path: contactPath(LANG) },
          ]),
        ]}
      />
      <ContactPage lang={LANG} />
    </>
  );
}

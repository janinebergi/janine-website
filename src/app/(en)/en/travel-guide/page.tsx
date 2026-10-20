import type { Metadata } from "next";
import { GuideOverviewPage } from "@/components/pages/guide";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { guidePath, homePath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.reisefuehrerSeite;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(guidePath),
});

export default function Page() {
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: t.heroTitle, path: guidePath(LANG) },
          ]),
        ]}
      />
      <GuideOverviewPage lang={LANG} />
    </>
  );
}

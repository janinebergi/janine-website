import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { JsonLd } from "@/components/json-ld";
import { websiteSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { homePath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.home;

export const metadata: Metadata = {
  ...pageMetadata(LANG, {
    title: t.metaTitle,
    description: t.metaDescription,
    paths: pathsFor(homePath),
  }),
  // Auf der Startseite ohne den "— Janine Bergmann"-Zusatz aus dem Layout.
  title: { absolute: t.metaTitle },
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteSchema(LANG)} />
      <HomePage lang={LANG} />
    </>
  );
}

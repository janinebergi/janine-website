import type { Metadata } from "next";
import { ImprintPage } from "@/components/pages/imprint";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { imprintPath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.impressum;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(imprintPath),
  noindex: true,
});

export default function Page() {
  return <ImprintPage lang={LANG} />;
}

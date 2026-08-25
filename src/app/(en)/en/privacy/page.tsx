import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/privacy";
import { pageMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site";
import { privacyPath, pathsFor } from "@/lib/routes";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.datenschutz;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(privacyPath),
  noindex: true,
});

export default function Page() {
  return <PrivacyPage lang={LANG} />;
}

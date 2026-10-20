import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetailPage } from "@/components/pages/guide";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getGuide, getGuideBySlug, getGuides } from "@/lib/guides";
import { getSiteContent } from "@/lib/site";
import { guideDetailPath, guidePath, homePath, type PathSet } from "@/lib/routes";

const LANG = "en" as const;

// Nur die Reiseführer aus site.json – jede andere Adresse ist ein 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides(LANG).map((guide) => ({ guide: guide.slug }));
}

// Die Adresse darf je Sprache anders lauten; verbunden sind beide Fassungen
// über die gemeinsame id.
function guidePaths(id: string): PathSet {
  const de = getGuide("de", id);
  const en = getGuide("en", id);
  return {
    ...(de ? { de: guideDetailPath("de", de.slug) } : {}),
    ...(en ? { en: guideDetailPath("en", en.slug) } : {}),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>;
}): Promise<Metadata> {
  const { guide: slug } = await params;
  const guide = getGuideBySlug(LANG, slug);
  if (!guide) return {};

  return pageMetadata(LANG, {
    title: guide.metaTitle,
    description: guide.metaDescription,
    paths: guidePaths(guide.id),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ guide: string }>;
}) {
  const { guide: slug } = await params;
  const guide = getGuideBySlug(LANG, slug);
  if (!guide) notFound();
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: pages.reisefuehrerSeite.heroTitle, path: guidePath(LANG) },
            { name: guide.heroTitle, path: guideDetailPath(LANG, guide.slug) },
          ]),
        ]}
      />
      <GuideDetailPage lang={LANG} guide={guide} />
    </>
  );
}

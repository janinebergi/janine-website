import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchivePage } from "@/components/pages/archive";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, collectionSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getCountries, getCountry } from "@/lib/archives";
import { getSiteContent } from "@/lib/site";
import { blogPath, countryPath, homePath } from "@/lib/routes";

const LANG = "de" as const;

export function generateStaticParams() {
  return getCountries(LANG).map((entry) => ({ country: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const entry = getCountry(LANG, country);
  if (!entry) return {};
  const t = getSiteContent(LANG).pages.archive;

  return pageMetadata(LANG, {
    title: t.countryMetaTitle.replace("{name}", entry.name),
    description: t.countryMetaDescription.replace("{name}", entry.name),
    paths: {
      de: countryPath("de", entry.slug),
      en: countryPath("en", entry.altSlug),
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const entry = getCountry(LANG, country);
  if (!entry) notFound();
  const { pages } = getSiteContent(LANG);
  const t = pages.archive;
  const path = countryPath(LANG, entry.slug);

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(LANG, {
            name: t.countryMetaTitle.replace("{name}", entry.name),
            description: t.countryMetaDescription.replace("{name}", entry.name),
            path,
            posts: entry.posts,
          }),
          breadcrumbSchema([
            { name: t.breadcrumbHome, path: homePath(LANG) },
            { name: pages.blog.heroEyebrow, path: blogPath(LANG) },
            { name: entry.name, path },
          ]),
        ]}
      />
      <ArchivePage
        lang={LANG}
        eyebrow={t.countryEyebrow}
        title={entry.name}
        intro={t.countryIntro.replace("{name}", entry.name)}
        posts={entry.posts}
      />
    </>
  );
}

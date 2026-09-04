import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchivePage } from "@/components/pages/archive";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, collectionSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { duplicatesCountry, getTopic, getTopics } from "@/lib/archives";
import { getSiteContent } from "@/lib/site";
import { blogPath, homePath, topicPath } from "@/lib/routes";

const LANG = "de" as const;

export function generateStaticParams() {
  return getTopics(LANG).map((entry) => ({ topic: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const entry = getTopic(LANG, topic);
  if (!entry) return {};
  const t = getSiteContent(LANG).pages.archive;

  return pageMetadata(LANG, {
    title: t.topicMetaTitle.replace("{name}", entry.name),
    description: t.topicMetaDescription.replace("{name}", entry.name),
    paths: {
      de: topicPath("de", entry.slug),
      ...(entry.altSlug ? { en: topicPath("en", entry.altSlug) } : {}),
    },
    // Deckt sich das Thema mit einem Länder-Archiv, bleibt nur jenes im Index.
    noindex: duplicatesCountry(LANG, entry),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const entry = getTopic(LANG, topic);
  if (!entry) notFound();
  const { pages } = getSiteContent(LANG);
  const t = pages.archive;
  const path = topicPath(LANG, entry.slug);

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(LANG, {
            name: t.topicMetaTitle.replace("{name}", entry.name),
            description: t.topicMetaDescription.replace("{name}", entry.name),
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
        eyebrow={t.topicEyebrow}
        title={entry.name}
        intro={t.topicIntro.replace("{name}", entry.name)}
        posts={entry.posts}
      />
    </>
  );
}

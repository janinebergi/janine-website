import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, collectionSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import { blogPath, homePath, pathsFor } from "@/lib/routes";

const LANG = "de" as const;
const t = getSiteContent(LANG).pages.blog;

export const metadata: Metadata = pageMetadata(LANG, {
  title: t.metaTitle,
  description: t.metaDescription,
  paths: pathsFor(blogPath),
});

export default function Page() {
  const posts = getAllPosts(LANG);
  const { pages } = getSiteContent(LANG);

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(LANG, {
            name: t.metaTitle,
            description: t.metaDescription,
            path: blogPath(LANG),
            posts,
          }),
          breadcrumbSchema([
            { name: pages.archive.breadcrumbHome, path: homePath(LANG) },
            { name: t.heroEyebrow, path: blogPath(LANG) },
          ]),
        ]}
      />
      <BlogIndexPage lang={LANG} />
    </>
  );
}

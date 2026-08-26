// RSS-Feed je Sprache. Für Google kein Rankingfaktor, aber der übliche Weg,
// wie Leser und Aggregatoren neue Beiträge mitbekommen – und ein weiterer
// Kanal, über den Beiträge verlinkt und damit schneller gefunden werden.
import { getAllPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { absoluteUrl, blogPath, feedPath, postPath } from "@/lib/routes";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildFeed(lang: Lang): string {
  const { site, pages } = getSiteContent(lang);
  const posts = getAllPosts(lang);
  const self = absoluteUrl(feedPath(lang));

  const items = posts
    .map((post) => {
      const url = absoluteUrl(postPath(lang, post.slug));
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      ${[...new Set([post.country, ...post.tags])]
        .filter(Boolean)
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n      ")}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.fullName} — ${site.role}`)}</title>
    <link>${absoluteUrl(blogPath(lang))}</link>
    <description>${escapeXml(pages.blog.metaDescription)}</description>
    <language>${lang === "en" ? "en" : "de-DE"}</language>
    <lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

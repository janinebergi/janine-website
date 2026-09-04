// RSS-Feed je Sprache. Er hilft an zwei Stellen: Leser abonnieren den Blog
// ohne Umweg über soziale Netzwerke, und Aggregatoren wie Feedly oder
// Blog-Verzeichnisse können neue Beiträge selbst abholen – jede solche
// Erwähnung ist ein zusätzlicher Weg, auf dem Google die Seite findet.
import { getAllPosts, type PostMeta } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { absoluteUrl, blogPath, feedPath, postPath } from "@/lib/routes";

// In XML sind diese fünf Zeichen Steuerzeichen. Ein einzelnes „&" in einem
// Beitragstitel würde den ganzen Feed ungültig machen.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// RSS 2.0 schreibt Datumsangaben im Format RFC 822 vor – genau das liefert
// toUTCString().
function rfc822(date: string): string {
  return new Date(date).toUTCString();
}

const RSS_LANG: Record<Lang, string> = { de: "de-DE", en: "en" };

function item(lang: Lang, post: PostMeta): string {
  const url = absoluteUrl(postPath(lang, post.slug));
  const categories = [post.country, ...post.tags]
    .filter(Boolean)
    .map((name) => `      <category>${escapeXml(name)}</category>`)
    .join("\n");

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    // isPermaLink="true" sagt dem Leseprogramm, dass die ID zugleich die
    // dauerhafte Adresse ist – so erkennt es bekannte Beiträge wieder.
    `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `      <pubDate>${rfc822(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    categories,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFeed(lang: Lang): string {
  const { site } = getSiteContent(lang);
  const posts = getAllPosts(lang);
  const self = absoluteUrl(feedPath(lang));

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.fullName} — ${site.role}`)}</title>
    <link>${escapeXml(absoluteUrl(blogPath(lang)))}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${RSS_LANG[lang]}</language>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />
${posts.length ? `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>\n` : ""}${posts
    .map((post) => item(lang, post))
    .join("\n")}
  </channel>
</rss>
`;
}

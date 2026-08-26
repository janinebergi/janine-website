// Bausteine für die strukturierten Daten (schema.org / JSON-LD). Alle URLs
// sind absolut, weil Google relative Angaben in JSON-LD ignoriert.
import type { PostMeta } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import {
  aboutPath,
  absoluteUrl,
  blogPath,
  homePath,
  postPath,
} from "@/lib/routes";

const LOCALE: Record<Lang, string> = { de: "de-DE", en: "en-US" };

export function personSchema(lang: Lang) {
  const { site } = getSiteContent(lang);
  return {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.fullName,
    url: absoluteUrl(aboutPath(lang)),
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    image: absoluteUrl("/assets/logo.avif"),
    sameAs: [site.social.linkedin].filter(Boolean),
  };
}

export function websiteSchema(lang: Lang) {
  const { site } = getSiteContent(lang);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: absoluteUrl(homePath(lang)),
    name: `${site.fullName} — ${site.role}`,
    description: site.description,
    inLanguage: LOCALE[lang],
    publisher: personSchema(lang),
    author: personSchema(lang),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(lang: Lang, post: PostMeta) {
  const { site } = getSiteContent(lang);
  const url = absoluteUrl(postPath(lang, post.slug));
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    // Das generierte Vorschaubild ist ein JPEG und damit für Google sicher
    // lesbar – die AVIF-Originale sind es nicht.
    image: [`${url}/og`],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: LOCALE[lang],
    keywords: [post.country, ...post.tags].filter(Boolean).join(", "),
    articleSection: post.country || undefined,
    author: personSchema(lang),
    publisher: personSchema(lang),
    isPartOf: {
      "@type": "Blog",
      "@id": `${site.url}${blogPath(lang)}#blog`,
      name: getSiteContent(lang).pages.blog.heroTitle,
      url: absoluteUrl(blogPath(lang)),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function collectionSchema(
  lang: Lang,
  opts: { name: string; description: string; path: string; posts: PostMeta[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: LOCALE[lang],
    isPartOf: { "@id": `${getSiteContent(lang).site.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.posts.length,
      itemListElement: opts.posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(postPath(lang, post.slug)),
        name: post.title,
      })),
    },
  };
}

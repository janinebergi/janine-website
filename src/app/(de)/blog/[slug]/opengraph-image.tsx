import { createOpengraphImage } from "@/lib/og-image";
import { getPostSlugs } from "@/lib/blog";

export { size, contentType } from "@/lib/og-image";
export const alt = "Vorschaubild des Blogbeitrags";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default createOpengraphImage("de");

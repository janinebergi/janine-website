import { postOgImage } from "@/lib/og-image";
import { getPostSlugs } from "@/lib/blog";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPostSlugs("de").map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return postOgImage(slug, "de");
}

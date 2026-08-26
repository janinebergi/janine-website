import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/not-found-page";
import { getSiteContent } from "@/lib/site";

const LANG = "en" as const;
const t = getSiteContent(LANG).pages.notFound;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
};

export default function NotFound() {
  return <NotFoundPage lang={LANG} />;
}

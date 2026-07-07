import { NextRequest, NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/search";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n-constants";

export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang: Lang = langParam === "en" ? "en" : DEFAULT_LANG;

  return NextResponse.json(getSearchIndex(lang));
}

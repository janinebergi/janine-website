import { NextRequest, NextResponse } from "next/server";
import { isCoverValue, isZoom } from "@/lib/cover-frontmatter";
import { isHeroId, writeHeroValue, type HeroLang } from "@/lib/hero-images";
import { isKnownImage } from "@/lib/asset-images";

// Gegenstück zu /api/dev/cover-position, nur für die vier Header-Bilder:
// die stehen nicht im Frontmatter, sondern in site.json. Ebenfalls nur lokal.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !isHeroId(body.id) || typeof body.mobile !== "boolean") {
    return NextResponse.json({ error: "id oder mobile fehlt" }, { status: 400 });
  }

  const what = body.what ?? "position";
  const valid =
    what === "zoom"
      ? isZoom(body.value)
      : what === "image"
        ? isKnownImage(body.value)
        : what === "alt"
          ? typeof body.value === "string" && body.value.trim().length > 0
          : isCoverValue(body.value);

  if (!["position", "zoom", "image", "alt"].includes(what) || !valid) {
    return NextResponse.json({ error: `Ungültiger Wert: ${body.value}` }, { status: 400 });
  }

  // Der Alternativtext ist übersetzt, deshalb muss die Sprache mitkommen.
  if (what === "alt" && body.lang !== "de" && body.lang !== "en") {
    return NextResponse.json({ error: "Sprache fehlt" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      files: writeHeroValue(
        body.id,
        body.mobile,
        what,
        body.value,
        body.lang as HeroLang | undefined,
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

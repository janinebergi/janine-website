import { NextRequest, NextResponse } from "next/server";
import { isCoverValue } from "@/lib/cover-frontmatter";
import { isHeroId, writeHeroPosition } from "@/lib/hero-images";

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
  if (!isCoverValue(body.value)) {
    return NextResponse.json({ error: `Ungültiger Wert: ${body.value}` }, { status: 400 });
  }

  try {
    return NextResponse.json({
      files: writeHeroPosition(body.id, body.mobile, body.value),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

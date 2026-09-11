import { NextRequest, NextResponse } from "next/server";
import { isBrightnessLevel } from "@/lib/theme-brightness";
import { writeBrightnessLevel } from "@/lib/theme-brightness-file";

// Schreibt die Helligkeitsstufe aus dem Regler nach globals.css. Wie die
// anderen Dev-Routen nur lokal: im Deployment ist das Dateisystem nicht
// beschreibbar.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !isBrightnessLevel(body.level)) {
    return NextResponse.json({ error: `Ungültige Stufe: ${body?.level}` }, { status: 400 });
  }

  try {
    return NextResponse.json({ files: [writeBrightnessLevel(body.level)] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

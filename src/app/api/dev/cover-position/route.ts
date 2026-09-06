import { NextRequest, NextResponse } from "next/server";
import {
  isCoverField,
  isCoverValue,
  writeCoverField,
} from "@/lib/cover-frontmatter";

// Schreibt Änderungen aus /dev/bildausschnitt in die .mdx-Dateien.
// Existiert nur lokal – im Deployment gibt es kein beschreibbares
// Dateisystem und niemanden, der hier etwas zu suchen hätte.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !isCoverField(body.field)) {
    return NextResponse.json({ error: "id oder field fehlt" }, { status: 400 });
  }

  const value = body.value ?? null;
  if (value !== null && !isCoverValue(value)) {
    return NextResponse.json({ error: `Ungültiger Wert: ${value}` }, { status: 400 });
  }

  try {
    return NextResponse.json({ files: writeCoverField(body.id, body.field, value) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

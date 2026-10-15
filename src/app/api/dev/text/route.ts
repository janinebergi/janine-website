import { NextRequest, NextResponse } from "next/server";
import { buildTextIndex, isTextTarget, writeText } from "@/lib/dev-text";
import type { Lang } from "@/lib/i18n-constants";

// Liefert dem Werkzeug „Texte bearbeiten“ die Liste der bearbeitbaren Texte
// (GET) und schreibt eine Änderung in site.json bzw. in die .mdx-Datei (POST).
// Wie die anderen Dev-Routen nur lokal: im Deployment ist das Dateisystem
// nicht beschreibbar und hier hätte auch niemand etwas zu suchen.

function offenInProduktion(): NextResponse | null {
  return process.env.NODE_ENV === "production"
    ? new NextResponse("Not found", { status: 404 })
    : null;
}

function isLang(value: unknown): value is Lang {
  return value === "de" || value === "en";
}

export async function GET(request: NextRequest) {
  const blocked = offenInProduktion();
  if (blocked) return blocked;

  const lang = request.nextUrl.searchParams.get("lang");
  if (!isLang(lang)) {
    return NextResponse.json({ error: `Unbekannte Sprache: ${lang}` }, { status: 400 });
  }

  // Der Slug entscheidet nur darüber, ob Q&A und Absätze eines Beitrags
  // mitkommen; passt er auf keinen Beitrag, bleibt es bei den Seitentexten.
  const slug = request.nextUrl.searchParams.get("slug");
  const postSlug = slug && /^[a-z0-9-]+$/.test(slug) ? slug : null;

  try {
    return NextResponse.json({ entries: buildTextIndex(lang, postSlug) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const blocked = offenInProduktion();
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  if (!body || !isLang(body.lang) || !isTextTarget(body.target)) {
    return NextResponse.json({ error: "Sprache oder Ziel fehlt" }, { status: 400 });
  }
  if (typeof body.value !== "string" || body.value.trim() === "") {
    return NextResponse.json({ error: "Der Text ist leer" }, { status: 400 });
  }
  // Mehr als das schreibt niemand in ein Eingabefeld auf der Seite; die Grenze
  // ist nur da, damit ein Versehen nicht eine ganze Datei in einen Absatz legt.
  if (body.value.length > 20000) {
    return NextResponse.json({ error: "Der Text ist zu lang" }, { status: 400 });
  }

  try {
    return NextResponse.json({ files: [writeText(body.lang, body.target, body.value)] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

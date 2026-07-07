import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { isAuthenticated } from "@/lib/auth";
import { commitFile, isGithubConfigured } from "@/lib/github";

// Diese Route speichert die bearbeiteten Texte.
//  - In der Produktion (GITHUB_TOKEN gesetzt): committet sie nach GitHub, was
//    ein automatisches Vercel-Deployment auslöst.
//  - Lokal (npm run dev, ohne Token): schreibt sie direkt in die Projektdatei.
const REPO_PATH = "src/content/site.json";
const CONTENT_PATH = path.join(process.cwd(), "src", "content", "site.json");

export async function POST(request: Request) {
  // Nur eingeloggte Nutzer dürfen speichern.
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Nicht angemeldet." },
      { status: 401 },
    );
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Daten empfangen." },
      { status: 400 },
    );
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return NextResponse.json(
      { error: "Es wurde kein gültiges Content-Objekt gesendet." },
      { status: 400 },
    );
  }

  const json = JSON.stringify(data, null, 2) + "\n";

  try {
    if (isGithubConfigured()) {
      await commitFile(
        REPO_PATH,
        json,
        "Texte über den Editor aktualisiert",
      );
    } else {
      await writeFile(CONTENT_PATH, json, "utf8");
    }
    return NextResponse.json({ ok: true, published: isGithubConfigured() });
  } catch (error) {
    return NextResponse.json(
      { error: `Speichern fehlgeschlagen: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}

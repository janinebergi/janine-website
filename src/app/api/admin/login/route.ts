import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isAuthConfigured,
  makeSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

// POST = einloggen. Erwartet { password }.
export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Kein Passwort konfiguriert. Bitte ADMIN_PASSWORD als Umgebungsvariable setzen.",
      },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { error: "Falsches Passwort." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, makeSessionToken(), sessionCookieOptions);
  return res;
}

// DELETE = ausloggen.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}

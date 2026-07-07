import crypto from "node:crypto";
import { cookies } from "next/headers";

// Einfaches, abhängigkeitsfreies Login: ein einziges Passwort (ADMIN_PASSWORD).
// Nach erfolgreichem Login wird ein signiertes Session-Cookie gesetzt. Der
// Cookie-Wert ist ein HMAC – aus ihm lässt sich das Passwort nicht zurückrechnen.
export const SESSION_COOKIE = "jb_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

// Ist ein Passwort konfiguriert? (Für Hinweise in der Oberfläche.)
export function isAuthConfigured(): boolean {
  return Boolean(adminPassword());
}

// Der Token, der im Cookie gespeichert wird. Abgeleitet aus dem Passwort:
// Ändert sich das Passwort, werden alle bestehenden Sitzungen ungültig.
export function makeSessionToken(): string {
  const secret = adminPassword() ?? "";
  return crypto
    .createHmac("sha256", secret)
    .update("jb-admin-session-v1")
    .digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  // Über SHA-256 vergleichen, damit unterschiedliche Längen nichts verraten.
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Prüft ein eingegebenes Passwort gegen ADMIN_PASSWORD.
export function verifyPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return timingSafeEqualStr(input, expected);
}

// Ist die aktuelle Anfrage eingeloggt?
export async function isAuthenticated(): Promise<boolean> {
  if (!adminPassword()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  return timingSafeEqualStr(value, makeSessionToken());
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

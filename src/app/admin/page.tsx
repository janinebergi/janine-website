import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContentEditor } from "@/components/admin/content-editor";
import { LoginForm } from "@/components/admin/login-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { siteContent } from "@/lib/site";
import { isAuthConfigured, isAuthenticated } from "@/lib/auth";
import { isGithubConfigured } from "@/lib/github";

export const metadata: Metadata = {
  title: "Texte bearbeiten",
  // Editor-Seite nicht in Suchmaschinen aufnehmen.
  robots: { index: false, follow: false },
};

// Immer frisch rendern (Login-Status hängt vom Cookie ab).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isAuthConfigured();
  const authed = configured && (await isAuthenticated());
  const canPublish = isGithubConfigured();
  const isProd = process.env.NODE_ENV === "production";

  return (
    <section className="py-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Texte bearbeiten</h1>
              <p className="mt-3 text-muted">
                Hier kannst du alle Texte der Website ändern. Nach dem Speichern
                sind die Änderungen in etwa einer Minute live.
              </p>
            </div>
            {authed && <LogoutButton />}
          </div>

          {!configured ? (
            <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm leading-relaxed text-red-200">
              Es ist noch kein Passwort eingerichtet. Bitte die Umgebungsvariable{" "}
              <code className="rounded bg-bg/60 px-1.5 py-0.5">
                ADMIN_PASSWORD
              </code>{" "}
              setzen (in Vercel unter Project → Settings → Environment
              Variables), dann neu laden.
            </div>
          ) : !authed ? (
            <>
              <p className="mt-8 text-sm text-muted">
                Bitte melde dich an, um die Texte zu bearbeiten.
              </p>
              <LoginForm />
            </>
          ) : (
            <>
              {isProd && !canPublish && (
                <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm leading-relaxed text-amber-200">
                  Speichern ist noch nicht vollständig eingerichtet: Es fehlt der{" "}
                  <code className="rounded bg-bg/60 px-1.5 py-0.5">
                    GITHUB_TOKEN
                  </code>
                  . Ohne ihn kann auf der veröffentlichten Seite nicht gespeichert
                  werden.
                </div>
              )}
              <div className="mt-10">
                <ContentEditor initial={siteContent} />
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

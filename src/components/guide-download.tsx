import fs from "node:fs";
import path from "node:path";
import { ArrowUpRight, Download } from "lucide-react";
import { DownloadLink } from "@/components/download-link";
import { buttonClass } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";

// Kasten für einen Reiseführer im Fließtext: <Reisefuehrer id="bali" />, in der
// englischen Fassung mit lang="en" – wie <BudgetChart>. Die Texte stehen in
// site.json unter pages.reisefuehrer.<id> und sind damit auch über das
// Werkzeug „Texte bearbeiten“ änderbar.
//
// Das Ziel ist bewusst ein einzelner Wert (`file`): Solange dort ein Pfad
// steht ("/downloads/bali-reisefuehrer.pdf"), ist der Kasten ein Download aus
// public/. Wird der Reiseführer später verkauft, kommt dort die Adresse des
// Shops hin – dann verlinkt derselbe Kasten dorthin, mit `ctaExternal` als
// Knopftext. An den Beiträgen ändert sich dafür nichts.
//
// Fehlt die Datei noch, erscheint kein Kasten: lokal steht an seiner Stelle
// ein Hinweis, in der veröffentlichten Fassung bleibt die Stelle leer. So kann
// der Verweis im Beitrag schon stehen, bevor das PDF fertig ist.

type Guide = {
  eyebrow: string;
  title: string;
  text: string;
  note: string;
  cta: string;
  ctaExternal: string;
  file: string;
};

// Die Größe wird aus der Datei gelesen, nicht gepflegt: ein neues PDF ändert
// sie automatisch mit.
function fileSize(file: string, lang: Lang): string | null {
  try {
    const bytes = fs.statSync(
      path.join(process.cwd(), "public", decodeURIComponent(file)),
    ).size;
    const mb = bytes / 1024 / 1024;
    const value = mb.toLocaleString(lang === "en" ? "en-GB" : "de-DE", {
      maximumFractionDigits: mb < 10 ? 1 : 0,
    });
    return `PDF · ${value} MB`;
  } catch {
    return null;
  }
}

function guideEntry(lang: Lang, id: string): Guide | null {
  const guides = getSiteContent(lang).pages.reisefuehrer as Record<
    string,
    Guide | undefined
  >;
  return guides?.[id] ?? null;
}

// Adresse des Reiseführers, wenn es ihn gibt – für Stellen, an denen kein
// ganzer Kasten passt, etwa der Verweis in der Fußzeile. Fehlt die Datei,
// kommt null zurück und der Verweis entfällt, statt ins Leere zu führen.
export function guideLink(
  lang: Lang,
  id: string,
): { href: string; external: boolean } | null {
  const guide = guideEntry(lang, id);
  if (!guide) return null;

  const external = /^https?:\/\//.test(guide.file);
  if (!external && fileSize(guide.file, lang) === null) return null;
  return { href: guide.file, external };
}

export function Reisefuehrer({
  id,
  lang = "de",
  // Wofür der Wert gut ist: steht in der Statistik am gemeldeten Klick und
  // sagt damit, welche Platzierung den Download ausgelöst hat.
  ort = "beitrag",
}: {
  id: string;
  lang?: Lang;
  ort?: string;
}) {
  const guide = guideEntry(lang, id);
  if (!guide) return null;

  const external = /^https?:\/\//.test(guide.file);
  const size = external ? null : fileSize(guide.file, lang);

  if (!external && size === null) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className="not-prose my-10 rounded-2xl border border-dashed border-border p-6 text-sm leading-relaxed text-muted">
        Hier steht der Reiseführer-Kasten, sobald die Datei{" "}
        <code className="font-mono text-foreground">public{guide.file}</code>{" "}
        existiert. Dieser Hinweis erscheint nur lokal.
      </div>
    );
  }

  return (
    <aside className="not-prose my-10 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-accent-hover">
        {guide.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight">{guide.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{guide.text}</p>
      {guide.note && <p className="mt-2 text-sm leading-relaxed text-muted">{guide.note}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Kein next/link: das Ziel ist keine Seite, sondern eine Datei in
            public/ – oder später der Shop. */}
        <DownloadLink href={guide.file} ort={ort} className={buttonClass()}>
          {external ? guide.ctaExternal : guide.cta}
          {external ? (
            <ArrowUpRight size={16} aria-hidden />
          ) : (
            <Download size={16} aria-hidden />
          )}
        </DownloadLink>
        {size && <span className="text-sm text-muted">{size}</span>}
      </div>
    </aside>
  );
}

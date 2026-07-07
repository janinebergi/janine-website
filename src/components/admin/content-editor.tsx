"use client";

import { useState } from "react";

// Schlüssel, die nicht als Textfeld angezeigt werden (technische Felder:
// IDs, Bildpfade, Links, Icons). So bleibt der Editor auf reine Texte fokussiert.
const HIDDEN_KEYS = new Set([
  "id",
  "image",
  "heroImage",
  "href",
  "icon",
  "url",
]);

// Freundliche deutsche Beschriftungen für bekannte Schlüssel.
const LABELS: Record<string, string> = {
  site: "Allgemein",
  name: "Name",
  role: "Rolle / Untertitel",
  tagline: "Slogan",
  description: "Beschreibung (für Suchmaschinen)",
  email: "E-Mail-Adresse",
  social: "Social-Media-Links",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  tiktok: "TikTok",
  nav: "Navigation (Menü)",
  label: "Beschriftung",
  services: "Leistungen (Kacheln)",
  title: "Titel",
  points: "Stichpunkte",
  stats: "Zahlen / Statistik",
  value: "Wert",
  testimonials: "Kundenstimmen",
  quote: "Zitat",
  projects: "Projekte (Startseite)",
  category: "Kategorie",
  result: "Ergebnis-Label",
  pages: "Seiten-Texte",
  home: "Startseite",
  leistungen: "Seite „Leistungen“",
  arbeiten: "Seite „Arbeiten“",
  ueberMich: "Seite „Über mich“",
  kontakt: "Seite „Kontakt“",
  mediakit: "Media Kit",
  ratesEyebrow: "Raten – Label",
  ratesTitle: "Raten – Überschrift",
  ratesIntro: "Raten – Text",
  rates: "Preisliste",
  subtitle: "Untertitel",
  steps: "Zeitaufwand-Schritte",
  price: "Preis",
  pricingNoteTitle: "Preis-Erklärung – Überschrift",
  pricingNoteText: "Preis-Erklärung – Text",
  brandsTitle: "Marken – Überschrift",
  brands: "Marken",
  intro: "Einleitung",
  header: "Kopfzeile",
  footer: "Fußzeile",
  metaTitle: "Seitentitel (Browser-Tab / SEO)",
  metaDescription: "Seitenbeschreibung (SEO)",
  heroEyebrow: "Hero – kleines Label",
  heroTitle: "Hero – Überschrift",
  heroText: "Hero – Text",
  blogNote: "Blog-Hinweis",
  heroHeadingPre: "Hero – Überschrift (Teil 1)",
  heroHeadingHighlight: "Hero – hervorgehobenes Wort",
  heroHeadingPost: "Hero – Überschrift (Teil 2)",
  heroPrimaryCta: "Hero – Button 1",
  heroSecondaryCta: "Hero – Button 2",
  servicesEyebrow: "Leistungen – Label",
  servicesTitle: "Leistungen – Überschrift",
  servicesDescription: "Leistungen – Text",
  servicesLink: "Leistungen – Link",
  workEyebrow: "Arbeiten – Label",
  workTitle: "Arbeiten – Überschrift",
  workDescription: "Arbeiten – Text",
  workLink: "Arbeiten – Link",
  work: "Projekte",
  testimonialsEyebrow: "Stimmen – Label",
  testimonialsTitle: "Stimmen – Überschrift",
  ctaTitle: "Abschluss-Box – Überschrift",
  ctaText: "Abschluss-Box – Text",
  ctaButton: "Abschluss-Box – Button",
  deliverablesEyebrow: "Leistungen-Liste – Label",
  deliverablesTitle: "Leistungen-Liste – Überschrift",
  deliverablesDescription: "Leistungen-Liste – Text",
  deliverables: "Leistungen-Liste (Punkte)",
  processEyebrow: "Ablauf – Label",
  processTitle: "Ablauf – Überschrift",
  process: "Ablauf-Schritte",
  step: "Schritt-Nummer",
  paragraphs: "Absätze",
  valuesEyebrow: "Warum ich – Label",
  valuesTitle: "Warum ich – Überschrift",
  values: "Warum-ich-Punkte",
  blogTeaser: "Blog-Kacheln (Über mich)",
  linkText: "Link-Beschriftung",
  emailTitle: "E-Mail – Beschriftung",
  responseTitle: "Antwortzeit – Beschriftung",
  responseValue: "Antwortzeit – Wert",
  callTitle: "Erstgespräch – Beschriftung",
  callValue: "Erstgespräch – Wert",
  cta: "Button-Beschriftung",
  navLabel: "Spaltentitel Navigation",
  contactLabel: "Spaltentitel Kontakt",
  rights: "Copyright-Zusatz",
  impressum: "Link „Impressum“",
  datenschutz: "Link „Datenschutz“",
};

function labelFor(key: string): string {
  if (LABELS[key]) return LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// Wert an einem verschachtelten Pfad unveränderlich setzen.
function setByPath(obj: Json, path: (string | number)[], value: Json): Json {
  const clone: Json = structuredClone(obj);
  let cursor: Json = clone;
  for (let i = 0; i < path.length - 1; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursor = (cursor as any)[path[i]];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (cursor as any)[path[path.length - 1]] = value;
  return clone;
}

function Field({
  fieldKey,
  value,
  path,
  onChange,
}: {
  fieldKey: string;
  value: string;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const rows = Math.max(1, Math.min(8, Math.ceil((value.length + 1) / 60)));
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground/90">
        {labelFor(fieldKey)}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

function Node({
  nodeKey,
  value,
  path,
  depth,
  onChange,
}: {
  nodeKey: string;
  value: Json;
  path: (string | number)[];
  depth: number;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  if (typeof value === "string") {
    if (HIDDEN_KEYS.has(nodeKey)) return null;
    return (
      <Field fieldKey={nodeKey} value={value} path={path} onChange={onChange} />
    );
  }

  // Zahlen/Booleans (kommen hier nicht vor) überspringen
  if (typeof value !== "object" || value === null) return null;

  const isArray = Array.isArray(value);
  const entries: [string, Json][] = isArray
    ? (value as Json[]).map((v, i) => [String(i), v])
    : Object.entries(value as { [k: string]: Json });

  // Falls ein Objekt/Array nur aus versteckten Feldern besteht, nichts rendern.
  const hasVisible = entries.some(([k, v]) =>
    typeof v === "string" ? !HIDDEN_KEYS.has(k) : true,
  );
  if (!hasVisible) return null;

  const Heading = depth === 0 ? "h2" : depth === 1 ? "h3" : "h4";
  const headingClass =
    depth === 0
      ? "text-lg font-semibold text-foreground"
      : "text-sm font-semibold uppercase tracking-wide text-accent-hover";

  return (
    <section
      id={depth === 0 ? nodeKey : undefined}
      className={
        depth === 0
          ? "rounded-2xl border border-border bg-surface/60 p-6 scroll-mt-24"
          : "flex flex-col gap-4 rounded-xl border border-border/60 bg-bg/40 p-4"
      }
    >
      <Heading className={headingClass}>
        {isArray ? `${labelFor(nodeKey)} ${Number(path[path.length - 1]) + 1}` : labelFor(nodeKey)}
      </Heading>
      <div className="flex flex-col gap-4">
        {entries.map(([k, v]) => (
          <Node
            key={k}
            nodeKey={isArray ? nodeKey : k}
            value={v}
            path={[...path, isArray ? Number(k) : k]}
            depth={depth + 1}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}

export function ContentEditor({ initial }: { initial: Json }) {
  const [content, setContent] = useState<Json>(initial);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "saving" }
    | { type: "saved"; published: boolean }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [dirty, setDirty] = useState(false);

  const handleChange = (path: (string | number)[], value: string) => {
    setContent((prev) => setByPath(prev, path, value));
    setDirty(true);
    setStatus({ type: "idle" });
  };

  const handleSave = async () => {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Fehler ${res.status}`);
      }
      setStatus({ type: "saved", published: Boolean(data.published) });
      setDirty(false);
    } catch (err) {
      setStatus({ type: "error", message: (err as Error).message });
    }
  };

  const topEntries = Object.entries(content as { [k: string]: Json });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {topEntries.map(([k, v]) => (
          <Node
            key={k}
            nodeKey={k}
            value={v}
            path={[k]}
            depth={0}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Sticky Speicherleiste */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="text-sm text-muted">
          {status.type === "saving" && "Speichere …"}
          {status.type === "saved" && (
            <span className="text-accent-hover">
              {status.published
                ? "Gespeichert. In etwa einer Minute ist die Änderung live."
                : "Lokal gespeichert."}
            </span>
          )}
          {status.type === "error" && (
            <span className="text-red-400">Fehler: {status.message}</span>
          )}
          {status.type === "idle" &&
            (dirty ? "Nicht gespeicherte Änderungen" : "Keine Änderungen")}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={status.type === "saving" || !dirty}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}

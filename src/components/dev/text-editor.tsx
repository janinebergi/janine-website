"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { SaveButton, post, type SaveState } from "@/components/dev/position-controls";
import type { TextEntry } from "@/lib/dev-text";
import type { Lang } from "@/lib/i18n-constants";

// „Texte bearbeiten“: lokales Werkzeug, mit dem die Texte direkt auf der Seite
// geändert und in ihre Quelldatei zurückgeschrieben werden – Seitentexte nach
// src/content/site.json, Titel, Teaser, Q&A und Absätze eines Beitrags in
// seine .mdx-Datei.
//
// Es muss dafür nichts in den Seiten-Bauteilen markiert werden: eingeschaltet
// holt sich das Werkzeug alle bearbeitbaren Texte der Seite vom Server und
// sucht sie im fertig gerenderten HTML. Wo ein Element genau einen dieser
// Texte enthält, wird es anklickbar. Das hält die Seiten selbst frei von
// Werkzeug-Code – dort steht kein einziges Attribut mehr als vorher.

const STORAGE_KEY = "texte-bearbeiten";

// Elemente, in denen Text stehen kann. Treffen mehrere ineinander zu
// (<div><p>Text</p></div>), wird nur das innerste anklickbar.
const TEXT_ELEMENTS =
  "p,li,ul,ol,h1,h2,h3,h4,h5,h6,blockquote,span,a,strong,em,button,summary,figcaption,td,th,label,dt,dd,div";

const STYLE = `
[data-mk-text] {
  outline: 1px dashed color-mix(in srgb, var(--color-accent) 45%, transparent);
  outline-offset: 3px;
  border-radius: 2px;
  cursor: text;
}
[data-mk-text]:hover {
  outline: 1px solid var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
}
[data-mk-editing],
[data-mk-editing]:hover {
  outline: 2px solid var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 18%, transparent);
}
`;

// Ein angeklickter Text kann an mehreren Stellen in site.json stehen
// („Kontakt“ ist Menüpunkt, Überschrift und Button) – deshalb hält das Fenster
// alle Kandidaten und lässt die richtige Stelle auswählen.
type Active = {
  candidates: TextEntry[];
  choice: number;
  draft: string;
  top: number;
  left: number;
};

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function TextEditor({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();

  // null, solange der gespeicherte Zustand noch nicht gelesen ist.
  const [on, setOn] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<TextEntry[]>([]);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState<Active | null>(null);
  const [save, setSave] = useState<SaveState>({ state: "idle" });
  const [reload, setReload] = useState(0);

  const entriesRef = useRef<TextEntry[]>([]);
  const markedRef = useRef<HTMLElement[]>([]);
  // Zu jedem markierten Element die Einträge, die zu seinem Text passen.
  const slotsRef = useRef<TextEntry[][]>([]);
  const editingRef = useRef<HTMLElement | null>(null);

  const clearMarks = useCallback(() => {
    for (const element of markedRef.current) delete element.dataset.mkText;
    markedRef.current = [];
    slotsRef.current = [];
    setCount(0);
  }, []);

  const mark = useCallback(() => {
    clearMarks();

    const byText = new Map<string, TextEntry[]>();
    for (const entry of entriesRef.current) {
      const key = normalize(entry.text);
      // Ein- und zweibuchstabige Texte („·“, „+“) träfen überall zu.
      if (key.length < 3) continue;
      const found = byText.get(key);
      if (found) found.push(entry);
      else byText.set(key, [entry]);
    }
    if (byText.size === 0) return;

    const elements = new Map<string, HTMLElement[]>();
    for (const element of document.querySelectorAll<HTMLElement>(TEXT_ELEMENTS)) {
      if (element.closest("[data-mk-dev]")) continue;
      const key = normalize(element.textContent ?? "");
      if (!byText.has(key)) continue;
      const found = elements.get(key);
      if (found) found.push(element);
      else elements.set(key, [element]);
    }

    for (const [key, found] of elements) {
      const innermost = found.filter(
        (element) => !found.some((other) => other !== element && element.contains(other)),
      );
      for (const element of innermost) {
        element.dataset.mkText = String(slotsRef.current.length);
        markedRef.current.push(element);
        slotsRef.current.push(byText.get(key)!);
      }
    }

    setCount(markedRef.current.length);
  }, [clearMarks]);

  const close = useCallback(() => {
    if (editingRef.current) delete editingRef.current.dataset.mkEditing;
    editingRef.current = null;
    setActive(null);
    setSave({ state: "idle" });
  }, []);

  // Gespeicherten Zustand übernehmen: das Werkzeug bleibt über Seitenwechsel
  // hinweg eingeschaltet.
  useEffect(() => {
    setOn(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (on === null) return;
    if (on) {
      localStorage.setItem(STORAGE_KEY, "1");
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    close();
    clearMarks();
    setEntries([]);
  }, [on, close, clearMarks]);

  // Bearbeitbare Texte der offenen Seite holen. Auf einer Beitragsseite kommen
  // zum Seitentext die Absätze und das Q&A des Beitrags hinzu.
  useEffect(() => {
    if (!on) return;
    const slug = pathname.match(/^\/(?:en\/)?blog\/([^/]+)\/?$/)?.[1];
    const params = new URLSearchParams({ lang });
    if (slug) params.set("slug", slug);

    let aktuell = true;
    fetch(`/api/dev/text?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (aktuell) setEntries(Array.isArray(data.entries) ? data.entries : []);
      })
      .catch(() => {
        if (aktuell) setEntries([]);
      });
    return () => {
      aktuell = false;
    };
  }, [on, pathname, lang, reload]);

  useEffect(() => {
    if (!on) return;
    entriesRef.current = entries;
    mark();

    // Nach dem Speichern rendert die Seite neu und ersetzt dabei die
    // markierten Elemente – dann wird neu markiert.
    let timer: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(mark, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [on, entries, mark]);

  useEffect(() => {
    if (!on) return;

    function onClick(event: MouseEvent) {
      // Mit ⌘/Strg bleibt der Klick ein normaler Klick – so lässt sich auch im
      // Bearbeiten-Modus einem Link folgen.
      if (event.metaKey || event.ctrlKey) return;

      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-mk-text]",
      );
      if (!element || element.closest("[data-mk-dev]")) return;

      const candidates = slotsRef.current[Number(element.dataset.mkText)];
      if (!candidates?.length) return;

      event.preventDefault();
      event.stopPropagation();

      if (editingRef.current) delete editingRef.current.dataset.mkEditing;
      element.dataset.mkEditing = "";
      editingRef.current = element;

      // Fenster unter das angeklickte Element, aber immer im Sichtbaren.
      const rect = element.getBoundingClientRect();
      setActive({
        candidates,
        choice: 0,
        draft: candidates[0].value,
        top: Math.min(Math.max(12, rect.bottom + 10), window.innerHeight - 280),
        left: Math.min(Math.max(12, rect.left), window.innerWidth - 400),
      });
      setSave({ state: "idle" });
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [on, close]);

  const entry = active?.candidates[active.choice];

  async function speichern() {
    if (!active || !entry) return;
    setSave({ state: "saving" });
    try {
      await post("/api/dev/text", { lang, target: entry.target, value: active.draft });
      setSave({ state: "saved" });
      // Liste neu holen: ein geteilter Absatz verschiebt die Nummerierung.
      setReload((n) => n + 1);
      router.refresh();
    } catch (error) {
      setSave({
        state: "error",
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  }

  if (!on) {
    return (
      <div data-mk-dev="true" className="mk-no-print">
        <button
          type="button"
          onClick={() => setOn(true)}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-2 text-xs text-muted shadow-lg backdrop-blur hover:text-foreground"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Texte bearbeiten
        </button>
      </div>
    );
  }

  const rows = entry
    ? Math.min(14, Math.max(2, active.draft.split("\n").length + Math.ceil(active.draft.length / 56)))
    : 3;

  return (
    <div data-mk-dev="true" className="mk-no-print">
      <style>{STYLE}</style>

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full border border-accent/40 bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Pencil className="h-4 w-4 text-accent" aria-hidden />
          {count} Texte anklickbar
        </span>
        <span className="hidden text-muted sm:inline">⌘-Klick folgt Links</span>
        <button
          type="button"
          onClick={() => setOn(false)}
          className="rounded-full bg-accent px-2.5 py-1 font-medium text-bg"
        >
          Fertig
        </button>
      </div>

      {active && entry && (
        <div
          style={{ top: active.top, left: active.left }}
          className="fixed z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-xl border border-border bg-surface/95 p-4 text-xs shadow-2xl backdrop-blur"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="font-mono text-[11px] leading-snug text-muted">
              {entry.file}
              <br />
              {entry.label}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Fenster schließen"
              className="text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {active.candidates.length > 1 && (
            <select
              value={active.choice}
              onChange={(event) => {
                const choice = Number(event.target.value);
                setActive({
                  ...active,
                  choice,
                  draft: active.candidates[choice].value,
                });
                setSave({ state: "idle" });
              }}
              className="mb-2 w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-foreground"
            >
              {active.candidates.map((candidate, index) => (
                <option key={`${candidate.file}-${candidate.label}`} value={index}>
                  {candidate.file.replace(/^.*\//, "")} · {candidate.label}
                </option>
              ))}
            </select>
          )}

          <textarea
            autoFocus
            rows={rows}
            value={active.draft}
            onChange={(event) => {
              setActive({ ...active, draft: event.target.value });
              setSave({ state: "idle" });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void speichern();
              }
            }}
            className="w-full resize-y rounded-lg border border-border bg-bg p-2 font-mono text-xs leading-relaxed text-foreground"
          />

          <p className="mt-2 leading-relaxed text-muted">
            {entry.markdown
              ? "Absatz aus der .mdx-Datei, mit Markdown: ## Überschrift, **fett**, [Text](/pfad). Eine Leerzeile teilt ihn in zwei Absätze."
              : lang === "de"
                ? "Speichert die deutsche Fassung. Die englische unter /en… bearbeiten."
                : "Speichert die englische Fassung (site.en.json bzw. content/blog/en)."}
          </p>

          <div className="mt-3">
            <SaveButton
              state={save}
              onSave={speichern}
              savedText={`In ${entry.file} gespeichert.`}
            >
              {active.draft !== entry.value && (
                <button
                  type="button"
                  onClick={() => {
                    setActive({ ...active, draft: entry.value });
                    setSave({ state: "idle" });
                  }}
                  className="text-muted hover:text-foreground"
                >
                  Zurücksetzen
                </button>
              )}
            </SaveButton>
          </div>
        </div>
      )}
    </div>
  );
}

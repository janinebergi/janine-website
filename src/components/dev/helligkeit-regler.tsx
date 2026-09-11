"use client";

import { useEffect, useState } from "react";
import { Sun, X } from "lucide-react";
import { Slider, SaveButton, post, type SaveState } from "@/components/dev/position-controls";
import { BRIGHTNESS_VARS, brightnessPalette } from "@/lib/theme-brightness";

// Regler zum Aufhellen des Designs, lokal unten auf jeder Seite. Er legt die
// berechneten Flächenfarben direkt auf <html> – dort gewinnen sie gegen die
// Werte aus globals.css, sodass die ganze Seite sofort heller wird. Der Wert
// bleibt beim Klicken durch die Seiten erhalten (localStorage); *Speichern*
// schreibt ihn nach globals.css und damit auch in die veröffentlichte Seite.

const STORAGE_KEY = "helligkeit";

export function HelligkeitRegler({ gespeichert }: { gespeichert: number }) {
  const [level, setLevel] = useState(gespeichert);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState<SaveState>({ state: "idle" });

  // Vorschau aus dem letzten Seitenaufruf übernehmen, falls sie vom
  // gespeicherten Stand abweicht.
  useEffect(() => {
    const stored = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? "", 10);
    if (Number.isInteger(stored) && stored !== gespeichert) setLevel(stored);
  }, [gespeichert]);

  useEffect(() => {
    const palette = brightnessPalette(level);
    const root = document.documentElement;
    for (const name of BRIGHTNESS_VARS) root.style.setProperty(name, palette[name]);
    localStorage.setItem(STORAGE_KEY, String(level));
  }, [level]);

  async function speichern() {
    setSave({ state: "saving" });
    try {
      await post("/api/dev/helligkeit", { level });
      setSave({ state: "saved" });
    } catch (error) {
      setSave({
        state: "error",
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mk-no-print fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-2 text-xs text-muted shadow-lg backdrop-blur hover:text-foreground"
      >
        <Sun className="h-4 w-4" aria-hidden />
        Helligkeit {level} %
      </button>
    );
  }

  return (
    <div className="mk-no-print fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-border bg-surface/95 p-4 text-xs shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Sun className="h-4 w-4 text-accent" aria-hidden />
          Helligkeit
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Regler schließen"
          className="text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <Slider
        label="Stufe"
        value={level}
        step={5}
        onChange={(value) => {
          setLevel(value);
          setSave({ state: "idle" });
        }}
      />

      <p className="mt-2 leading-relaxed text-muted">
        0 % ist das bisherige Design, 100 % die hellste Fassung. Aufgehellt
        werden Hintergründe und Rahmen, Text und Akzentfarbe bleiben.
      </p>

      <div className="mt-3">
        <SaveButton state={save} onSave={speichern} savedText="In globals.css gespeichert.">
          {level !== gespeichert && (
            <button
              type="button"
              onClick={() => {
                setLevel(gespeichert);
                setSave({ state: "idle" });
              }}
              className="text-muted hover:text-foreground"
            >
              Zurück auf {gespeichert} %
            </button>
          )}
        </SaveButton>
      </div>
    </div>
  );
}

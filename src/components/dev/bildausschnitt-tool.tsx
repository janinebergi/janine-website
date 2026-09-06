"use client";

import { useState } from "react";
import { CoverEditor, type CoverPost } from "@/components/dev/cover-editor";
import { HeroEditor } from "@/components/dev/hero-editor";
import type { HeroImage } from "@/lib/hero-images";

const TABS = [
  { id: "beitraege", label: "Beiträge" },
  { id: "header", label: "Header-Bilder" },
] as const;

export function BildausschnittTool({
  posts,
  heroes,
}: {
  posts: CoverPost[];
  heroes: HeroImage[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("beitraege");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Bildausschnitte</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Regler ziehen, Ausschnitt sofort sehen, speichern. Geschrieben wird immer in
        die deutsche <em>und</em> die englische Fassung – das Bild ist ja dasselbe.
        Diese Seite gibt es nur lokal.
      </p>

      <div className="mt-8 flex gap-1 border-b border-border">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTab(entry.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === entry.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "beitraege" ? (
          <CoverEditor posts={posts} />
        ) : (
          <HeroEditor heroes={heroes} />
        )}
      </div>
    </div>
  );
}

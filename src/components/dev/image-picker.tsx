"use client";

import Image from "next/image";
import { useState } from "react";
import type { AssetFolder } from "@/lib/asset-images";

// Bildauswahl: aufklappbar, nach Ordnern sortiert. 200 Bilder auf einmal
// wären weder zu laden noch zu überblicken, deshalb immer nur ein Ordner.
export function ImagePicker({
  folders,
  current,
  onPick,
}: {
  folders: AssetFolder[];
  current: string;
  onPick: (image: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState(
    () => folders.find((f) => f.images.includes(current))?.folder ?? folders[0]?.folder,
  );

  const images = folders.find((f) => f.folder === folder)?.images ?? [];
  const name = current.split("/").pop();

  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted">Bild</p>
          <p className="truncate font-mono text-xs">{name}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
        >
          {open ? "Schließen" : "Bild tauschen"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {folders.map((f) => (
              <button
                key={f.folder}
                type="button"
                onClick={() => setFolder(f.folder)}
                className={`rounded-md px-2 py-1 text-xs transition-colors ${
                  f.folder === folder
                    ? "bg-accent text-bg"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {f.folder} ({f.images.length})
              </button>
            ))}
          </div>

          <div className="mt-3 grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                title={image.split("/").pop()}
                onClick={() => {
                  onPick(image);
                  setOpen(false);
                }}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg border ${
                  image === current
                    ? "border-accent"
                    : "border-border hover:border-accent/60"
                }`}
              >
                <Image src={image} alt="" fill sizes="160px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

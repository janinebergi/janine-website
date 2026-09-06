"use client";

import Image from "next/image";
import { useState } from "react";
import type { CoverField, ZoomField } from "@/lib/cover-frontmatter";
import type { AssetFolder } from "@/lib/asset-images";
import { ImagePicker } from "@/components/dev/image-picker";
import {
  SaveButton,
  Slider,
  ZoomSlider,
  parsePosition,
  post,
  previewStyle,
  serializePosition,
  type SaveState,
} from "@/components/dev/position-controls";

export type CoverPost = {
  id: string;
  title: string;
  coverImage: string;
  coverPosition: string | null;
  coverPositionMobile: string | null;
  coverPositionTile: string | null;
  coverZoom: number | null;
  coverZoomMobile: number | null;
  coverZoomTile: number | null;
};

type Values = Record<CoverField, string | number | null>;

// Die drei Ausschnitte, die ein Beitrag hat: jeder mit eigenem Feld für
// Position und Zoom. Kachel und Mobil fallen auf das Beitragsbild zurück,
// solange sie keinen eigenen Wert haben.
const BLOCKS: {
  label: string;
  hint: string;
  aspect: string;
  position: CoverField;
  zoom: ZoomField;
}[] = [
  {
    label: "Kachel",
    hint: "Vorschau auf Startseite, Blog-Übersicht, Archiven und unter „Weitere Beiträge“.",
    aspect: "16/10",
    position: "coverPositionTile",
    zoom: "coverZoomTile",
  },
  {
    label: "Beitragsbild",
    hint: "Das große Bild oben im Beitrag. Gilt auch als Rückfallwert für Kachel und Mobil.",
    aspect: "16/9",
    position: "coverPosition",
    zoom: "coverZoom",
  },
  {
    label: "Beitragsbild – Mobil",
    hint: "Nur unter 768 px Breite. Gleiches Format, nur anders verschoben und gezoomt.",
    aspect: "16/9",
    position: "coverPositionMobile",
    zoom: "coverZoomMobile",
  },
];

export function CoverEditor({
  posts,
  folders,
}: {
  posts: CoverPost[];
  folders: AssetFolder[];
}) {
  const [selected, setSelected] = useState(posts[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      posts.map((p) => [
        p.id,
        {
          coverImage: p.coverImage,
          coverPosition: p.coverPosition,
          coverPositionMobile: p.coverPositionMobile,
          coverPositionTile: p.coverPositionTile,
          coverZoom: p.coverZoom,
          coverZoomMobile: p.coverZoomMobile,
          coverZoomTile: p.coverZoomTile,
        } satisfies Values,
      ]),
    ),
  );
  const [status, setStatus] = useState<Record<string, SaveState>>({});

  const current = posts.find((p) => p.id === selected);
  const imageOf = (id: string) => values[id].coverImage as string;

  const swapImage = async (id: string, image: string) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], coverImage: image } }));
    setStatus((prev) => ({ ...prev, [`${id}:image`]: { state: "saving" } }));
    try {
      await post("/api/dev/cover-position", { id, field: "coverImage", value: image });
      setStatus((prev) => ({ ...prev, [`${id}:image`]: { state: "saved" } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehlgeschlagen";
      setStatus((prev) => ({ ...prev, [`${id}:image`]: { state: "error", message } }));
    }
  };

  // Was tatsächlich angezeigt wird: eigener Wert, sonst der des Beitragsbilds.
  const shownPosition = (id: string, field: CoverField): string | null => {
    const v = values[id];
    const own = (field === "coverPosition" ? v.coverPosition : v[field]) as string | null;
    return own ?? (v.coverPosition as string | null);
  };

  const shownZoom = (id: string, field: ZoomField): number => {
    const v = values[id];
    const own = (field === "coverZoom" ? v.coverZoom : v[field]) as number | null;
    return own ?? (v.coverZoom as number | null) ?? 1;
  };

  const set = (id: string, field: CoverField, value: string | number | null) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setStatus((prev) => ({ ...prev, [`${id}:${field}`]: { state: "idle" } }));
  };

  // Position und Zoom gehören zusammen, deshalb speichert der Knopf beides.
  const save = async (
    id: string,
    fields: { field: CoverField; value: string | number | null }[],
    key: string,
  ) => {
    setStatus((prev) => ({ ...prev, [key]: { state: "saving" } }));
    try {
      for (const { field, value } of fields) {
        await post("/api/dev/cover-position", { id, field, value });
      }
      setStatus((prev) => ({ ...prev, [key]: { state: "saved" } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehlgeschlagen";
      setStatus((prev) => ({ ...prev, [key]: { state: "error", message } }));
    }
  };

  return (
    <div>
      {/* Übersicht: alle Kacheln so, wie sie auf der Seite aussehen. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className={`overflow-hidden rounded-xl border text-left transition-colors ${
              p.id === selected ? "border-accent" : "border-border hover:border-accent/50"
            }`}
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={imageOf(p.id)}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
                style={previewStyle(
                  shownPosition(p.id, "coverPositionTile"),
                  shownZoom(p.id, "coverZoomTile"),
                )}
              />
            </div>
            <span className="block truncate px-3 py-2 text-xs text-muted">{p.title}</span>
          </button>
        ))}
      </div>

      {current && (
        <section className="mt-10 space-y-8">
          <h2 className="text-2xl font-semibold">{current.title}</h2>

          <ImagePicker
            folders={folders}
            current={imageOf(current.id)}
            onPick={(image) => void swapImage(current.id, image)}
          />
          {status[`${current.id}:image`]?.state === "saved" && (
            <p className="-mt-4 text-xs text-accent-hover">
              Bild getauscht (de + en). Ausschnitt und Zoom sind geblieben – prüf sie
              einmal durch, das neue Bild hat vermutlich einen anderen Bildaufbau.
            </p>
          )}
          {status[`${current.id}:image`]?.state === "error" && (
            <p className="-mt-4 text-xs text-red-400">
              {(status[`${current.id}:image`] as { message: string }).message}
            </p>
          )}

          {BLOCKS.map((block) => {
            const position = shownPosition(current.id, block.position);
            const zoom = shownZoom(current.id, block.zoom);
            const { x, y } = parsePosition(position);
            const key = `${current.id}:${block.position}`;
            const state = status[key] ?? { state: "idle" };
            const inherited =
              block.position !== "coverPosition" &&
              values[current.id][block.position] === null &&
              values[current.id][block.zoom] === null;

            return (
              <div
                key={block.position}
                className="rounded-2xl border border-border bg-surface/60 p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{block.label}</h3>
                  <code className="text-xs text-accent-hover">{block.position}</code>
                  {inherited && (
                    <span className="text-xs text-muted">
                      – kein eigener Wert, folgt dem Beitragsbild
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{block.hint}</p>

                <div className="mt-4 grid gap-5 md:grid-cols-[1fr_260px]">
                  <div
                    className="relative overflow-hidden rounded-xl border border-border"
                    style={{ aspectRatio: block.aspect }}
                  >
                    <Image
                      src={imageOf(current.id)}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-cover"
                      style={previewStyle(position, zoom)}
                    />
                  </div>

                  <div className="space-y-4 text-sm">
                    <Slider
                      label="Waagerecht"
                      value={x}
                      onChange={(next) =>
                        set(current.id, block.position, serializePosition(next, y))
                      }
                    />
                    <Slider
                      label="Senkrecht"
                      value={y}
                      onChange={(next) =>
                        set(current.id, block.position, serializePosition(x, next))
                      }
                    />
                    <ZoomSlider
                      zoom={zoom}
                      onChange={(next) => set(current.id, block.zoom, next)}
                    />

                    <div className="rounded-lg bg-bg/60 px-3 py-2 font-mono text-xs leading-relaxed">
                      {block.position}: &quot;{position ?? "center center"}&quot;
                      {zoom !== 1 && (
                        <>
                          <br />
                          {block.zoom}: {zoom}
                        </>
                      )}
                    </div>

                    <SaveButton
                      state={state}
                      onSave={() =>
                        save(
                          current.id,
                          [
                            { field: block.position, value: position },
                            { field: block.zoom, value: zoom === 1 ? null : zoom },
                          ],
                          key,
                        )
                      }
                    >
                      {block.position !== "coverPosition" && (
                        <button
                          type="button"
                          onClick={() => {
                            set(current.id, block.position, null);
                            set(current.id, block.zoom, null);
                            void save(
                              current.id,
                              [
                                { field: block.position, value: null },
                                { field: block.zoom, value: null },
                              ],
                              key,
                            );
                          }}
                          className="rounded-lg border border-border px-3 py-2 text-muted hover:text-foreground"
                        >
                          Eigenen Wert löschen
                        </button>
                      )}
                    </SaveButton>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

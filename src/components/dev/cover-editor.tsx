"use client";

import Image from "next/image";
import { useState } from "react";
import type { CoverField } from "@/lib/cover-frontmatter";
import {
  SaveButton,
  Slider,
  parsePosition,
  post,
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
};

type Values = Record<CoverField, string | null>;

const FIELDS: { field: CoverField; label: string; hint: string; aspect: string }[] = [
  {
    field: "coverPositionTile",
    label: "Kachel",
    hint: "Vorschau auf Startseite, Blog-Übersicht, Archiven und unter „Weitere Beiträge“.",
    aspect: "16/10",
  },
  {
    field: "coverPosition",
    label: "Beitragsbild",
    hint: "Das große Bild oben im Beitrag. Gilt auch als Rückfallwert für Kachel und Mobil.",
    aspect: "16/9",
  },
  {
    field: "coverPositionMobile",
    label: "Beitragsbild – Mobil",
    hint: "Nur unter 768 px Breite. Gleicher Ausschnitt, nur anders verschoben.",
    aspect: "16/9",
  },
];

export function CoverEditor({ posts }: { posts: CoverPost[] }) {
  const [selected, setSelected] = useState(posts[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      posts.map((p) => [
        p.id,
        {
          coverPosition: p.coverPosition,
          coverPositionMobile: p.coverPositionMobile,
          coverPositionTile: p.coverPositionTile,
        },
      ]),
    ),
  );
  const [status, setStatus] = useState<Record<string, SaveState>>({});

  const post_ = posts.find((p) => p.id === selected);

  // Was tatsächlich angezeigt wird: eigener Wert, sonst der des Beitragsbilds.
  const effective = (id: string, field: CoverField): string | null => {
    const v = values[id];
    if (!v) return null;
    return field === "coverPosition" ? v.coverPosition : v[field] ?? v.coverPosition;
  };

  const set = (id: string, field: CoverField, value: string | null) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setStatus((prev) => ({ ...prev, [`${id}:${field}`]: { state: "idle" } }));
  };

  const save = async (id: string, field: CoverField, value: string | null) => {
    const key = `${id}:${field}`;
    setStatus((prev) => ({ ...prev, [key]: { state: "saving" } }));
    try {
      await post("/api/dev/cover-position", { id, field, value });
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
                src={p.coverImage}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
                style={{ objectPosition: effective(p.id, "coverPositionTile") ?? undefined }}
              />
            </div>
            <span className="block truncate px-3 py-2 text-xs text-muted">{p.title}</span>
          </button>
        ))}
      </div>

      {post_ && (
        <section className="mt-10 space-y-8">
          <h2 className="text-2xl font-semibold">{post_.title}</h2>

          {FIELDS.map(({ field, label, hint, aspect }) => {
            const own = values[post_.id][field];
            const shown = effective(post_.id, field);
            const { x, y } = parsePosition(shown);
            const state = status[`${post_.id}:${field}`] ?? { state: "idle" };
            const inherited = field !== "coverPosition" && own === null;

            return (
              <div key={field} className="rounded-2xl border border-border bg-surface/60 p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <code className="text-xs text-accent-hover">{field}</code>
                  {inherited && (
                    <span className="text-xs text-muted">
                      – kein eigener Wert, folgt dem Beitragsbild
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{hint}</p>

                <div className="mt-4 grid gap-5 md:grid-cols-[1fr_260px]">
                  <div
                    className="relative overflow-hidden rounded-xl border border-border"
                    style={{ aspectRatio: aspect }}
                  >
                    <Image
                      src={post_.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-cover"
                      style={{ objectPosition: shown ?? undefined }}
                    />
                  </div>

                  <div className="space-y-4 text-sm">
                    <Slider
                      label="Waagerecht"
                      value={x}
                      onChange={(next) => set(post_.id, field, serializePosition(next, y))}
                    />
                    <Slider
                      label="Senkrecht"
                      value={y}
                      onChange={(next) => set(post_.id, field, serializePosition(x, next))}
                    />
                    <div className="rounded-lg bg-bg/60 px-3 py-2 font-mono text-xs">
                      {field}: &quot;{shown ?? "center center"}&quot;
                    </div>
                    <SaveButton
                      state={state}
                      onSave={() => save(post_.id, field, shown)}
                    >
                      {field !== "coverPosition" && (
                        <button
                          type="button"
                          onClick={() => {
                            set(post_.id, field, null);
                            void save(post_.id, field, null);
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

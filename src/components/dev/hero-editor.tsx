"use client";

import Image from "next/image";
import { useState } from "react";
import type { HeroImage } from "@/lib/hero-images";
import {
  SaveButton,
  Slider,
  parsePosition,
  post,
  serializePosition,
  type SaveState,
} from "@/components/dev/position-controls";

type Values = { position: string; positionMobile: string };

export function HeroEditor({ heroes }: { heroes: HeroImage[] }) {
  const [selected, setSelected] = useState(heroes[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      heroes.map((h) => [h.id, { position: h.position, positionMobile: h.positionMobile }]),
    ),
  );
  const [status, setStatus] = useState<Record<string, SaveState>>({});

  const hero = heroes.find((h) => h.id === selected);

  const save = async (id: string, mobile: boolean, value: string) => {
    const key = `${id}:${mobile}`;
    setStatus((prev) => ({ ...prev, [key]: { state: "saving" } }));
    try {
      await post("/api/dev/hero-position", { id, mobile, value });
      setStatus((prev) => ({ ...prev, [key]: { state: "saved" } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehlgeschlagen";
      setStatus((prev) => ({ ...prev, [key]: { state: "error", message } }));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {heroes.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setSelected(h.id)}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              h.id === selected
                ? "border-accent text-foreground"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {hero && (
        <div className="mt-8 space-y-10">
          {([false, true] as const).map((mobile) => {
            const value = mobile
              ? values[hero.id].positionMobile
              : values[hero.id].position;
            const { x, y } = parsePosition(value);
            const key = `${hero.id}:${mobile}`;
            const state = status[key] ?? { state: "idle" };
            const height = mobile ? hero.minHeight.mobile : hero.minHeight.desktop;

            const set = (next: string) =>
              setValues((prev) => ({
                ...prev,
                [hero.id]: mobile
                  ? { ...prev[hero.id], positionMobile: next }
                  : { ...prev[hero.id], position: next },
              }));

            return (
              <div key={key}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-lg font-semibold">
                    {mobile ? "Mobil" : "Desktop"}
                  </h3>
                  <code className="text-xs text-accent-hover">
                    {mobile ? "heroImagePositionMobile" : "heroImagePosition"}
                  </code>
                  <span className="text-xs text-muted">
                    {mobile ? "unter 768 px Breite" : "ab 768 px Breite"}
                  </span>
                </div>

                {/* Die Vorschau nimmt die volle Fensterbreite und dieselbe Höhe
                    wie das echte Banner – nur so stimmt der Ausschnitt. */}
                <div
                  className={`relative mt-3 overflow-hidden border-y border-border ${
                    mobile
                      ? "mx-auto w-[390px] max-w-full rounded-xl border-x"
                      : "left-1/2 w-screen -translate-x-1/2"
                  }`}
                  style={{ height }}
                >
                  <Image
                    src={hero.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: value }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
                </div>

                <div className="mt-4 grid gap-4 text-sm sm:max-w-md">
                  <Slider
                    label="Waagerecht"
                    value={x}
                    onChange={(next) => set(serializePosition(next, y))}
                  />
                  <Slider
                    label="Senkrecht"
                    value={y}
                    onChange={(next) => set(serializePosition(x, next))}
                  />
                  <div className="rounded-lg bg-bg/60 px-3 py-2 font-mono text-xs">
                    {mobile ? "heroImagePositionMobile" : "heroImagePosition"}:
                    &quot;{value}&quot;
                  </div>
                  <SaveButton state={state} onSave={() => save(hero.id, mobile, value)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

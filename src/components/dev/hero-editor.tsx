"use client";

import Image from "next/image";
import { useState } from "react";
import type { HeroImage } from "@/lib/hero-images";
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

type Values = {
  image: string;
  imageAlt: string;
  imageAltEn: string;
  position: string;
  positionMobile: string;
  zoom: number;
  zoomMobile: number;
};

export function HeroEditor({
  heroes,
  folders,
}: {
  heroes: HeroImage[];
  folders: AssetFolder[];
}) {
  const [selected, setSelected] = useState(heroes[0]?.id ?? "");
  const [values, setValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      heroes.map((h) => [
        h.id,
        {
          image: h.image,
          imageAlt: h.imageAlt,
          imageAltEn: h.imageAltEn,
          position: h.position,
          positionMobile: h.positionMobile,
          zoom: h.zoom,
          zoomMobile: h.zoomMobile,
        },
      ]),
    ),
  );
  const [status, setStatus] = useState<Record<string, SaveState>>({});

  const hero = heroes.find((h) => h.id === selected);

  // Bild und Alternativtext hängen zusammen: wer das Bild tauscht, muss auch
  // beschreiben, was jetzt darauf zu sehen ist – sonst lügt der alt-Text.
  const saveMeta = async (
    id: string,
    what: "image" | "alt",
    value: string,
    lang?: "de" | "en",
  ) => {
    const key = `${id}:${what}${lang ?? ""}`;
    setStatus((prev) => ({ ...prev, [key]: { state: "saving" } }));
    try {
      await post("/api/dev/hero-position", { id, mobile: false, what, value, lang });
      setStatus((prev) => ({ ...prev, [key]: { state: "saved" } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehlgeschlagen";
      setStatus((prev) => ({ ...prev, [key]: { state: "error", message } }));
    }
  };

  // Position und Zoom gehören zusammen, deshalb speichert der Knopf beides.
  const save = async (id: string, mobile: boolean, value: string, zoom: number) => {
    const key = `${id}:${mobile}`;
    setStatus((prev) => ({ ...prev, [key]: { state: "saving" } }));
    try {
      await post("/api/dev/hero-position", { id, mobile, what: "position", value });
      await post("/api/dev/hero-position", { id, mobile, what: "zoom", value: zoom });
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
          <div className="space-y-3">
            <ImagePicker
              folders={folders}
              current={values[hero.id].image}
              onPick={(image) => {
                setValues((prev) => ({
                  ...prev,
                  [hero.id]: { ...prev[hero.id], image },
                }));
                void saveMeta(hero.id, "image", image);
              }}
            />
            {(["de", "en"] as const).map((lang) => {
              const field = lang === "de" ? "imageAlt" : "imageAltEn";
              return (
                <label key={lang} className="block text-sm">
                  <span className="text-muted">
                    Alternativtext ({lang === "de" ? "deutsch" : "englisch"})
                  </span>
                  <input
                    type="text"
                    value={values[hero.id][field]}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [hero.id]: { ...prev[hero.id], [field]: e.target.value },
                      }))
                    }
                    onBlur={(e) => void saveMeta(hero.id, "alt", e.target.value, lang)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg/60 px-3 py-2"
                  />
                </label>
              );
            })}
            <p className="text-xs text-muted">
              Beschreibt das Bild für Screenreader und Google – nach einem
              Bildtausch stimmt der alte Text nicht mehr. Wird beim Verlassen des
              Feldes gespeichert, jede Sprache in ihre eigene Datei.
            </p>
          </div>

          {([false, true] as const).map((mobile) => {
            const value = mobile
              ? values[hero.id].positionMobile
              : values[hero.id].position;
            const zoom = mobile ? values[hero.id].zoomMobile : values[hero.id].zoom;
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

            const setZoom = (next: number) =>
              setValues((prev) => ({
                ...prev,
                [hero.id]: mobile
                  ? { ...prev[hero.id], zoomMobile: next }
                  : { ...prev[hero.id], zoom: next },
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
                    src={values[hero.id].image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                    style={previewStyle(value, zoom)}
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
                  <ZoomSlider zoom={zoom} onChange={setZoom} />
                  <div className="rounded-lg bg-bg/60 px-3 py-2 font-mono text-xs">
                    {mobile ? "heroImagePositionMobile" : "heroImagePosition"}:
                    &quot;{value}&quot;
                    {zoom !== 1 && (
                      <>
                        <br />
                        {mobile ? "heroZoomMobile" : "heroZoom"}: {zoom}
                      </>
                    )}
                  </div>
                  <SaveButton
                    state={state}
                    onSave={() => save(hero.id, mobile, value, zoom)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

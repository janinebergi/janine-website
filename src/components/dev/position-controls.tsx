"use client";

// Gemeinsame Bausteine der beiden Editoren: Regler, Umrechnung zwischen
// objectPosition-Schreibweise und Zahlen, Speicher-Status.

export type SaveState =
  | { state: "idle" | "saving" | "saved" }
  | { state: "error"; message: string };

const X_WORDS: Record<string, number> = { left: 0, center: 50, right: 100 };
const Y_WORDS: Record<string, number> = { top: 0, center: 50, bottom: 100 };

export function parsePosition(value: string | null): { x: number; y: number } {
  if (!value) return { x: 50, y: 50 };
  const [x, y] = value.trim().split(/\s+/);
  return {
    x: X_WORDS[x] ?? Number.parseInt(x, 10),
    y: Y_WORDS[y] ?? Number.parseInt(y, 10),
  };
}

// "center" statt "50%" schreiben, damit die Werte so aussehen wie die,
// die schon in den Dateien stehen.
export function serializePosition(x: number, y: number): string {
  return `${x === 50 ? "center" : `${x}%`} ${y === 50 ? "center" : `${y}%`}`;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-muted">
        {label}
        <span className="font-mono text-foreground">{value}%</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-accent"
      />
    </label>
  );
}

// Der Zoom liegt in den Dateien als Faktor (1 = unverändert), im Regler aber
// als Prozentwert – 140 % liest sich besser als 1.4.
export function ZoomSlider({
  zoom,
  onChange,
}: {
  zoom: number;
  onChange: (zoom: number) => void;
}) {
  return (
    <Slider
      label="Zoom"
      value={Math.round(zoom * 100)}
      min={100}
      max={300}
      step={5}
      onChange={(percent) => onChange(percent / 100)}
    />
  );
}

// Vorschau-Stil: derselbe Aufbau wie `.cover-image` in globals.css.
export function previewStyle(position: string | null, zoom: number) {
  return {
    objectPosition: position ?? undefined,
    transformOrigin: position ?? undefined,
    transform: `scale(${zoom})`,
  };
}

export function SaveButton({
  state,
  onSave,
  children,
}: {
  state: SaveState;
  onSave: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={state.state === "saving"}
          className="rounded-lg bg-accent px-3 py-2 font-medium text-bg disabled:opacity-60"
        >
          {state.state === "saving" ? "Speichert…" : "Speichern"}
        </button>
        {children}
      </div>
      {state.state === "saved" && (
        <p className="text-xs text-accent-hover">Gespeichert (de + en).</p>
      )}
      {state.state === "error" && (
        <p className="text-xs text-red-400">{state.message}</p>
      )}
    </div>
  );
}

export async function post(url: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? res.statusText);
}

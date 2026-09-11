// Helligkeit des Designs. Die Flächenfarben der Website sind absichtlich sehr
// dunkel; über eine einzige Stufe (0 = Ausgangsdesign, 100 = so hell wie hier
// vorgesehen) lassen sie sich gemeinsam aufhellen. Eingestellt wird das mit dem
// Regler, der lokal unten auf jeder Seite sitzt (siehe helligkeit-regler.tsx);
// gespeichert wird das Ergebnis in globals.css.
//
// Aufgehellt werden nur Hintergründe, Rahmen und der Akzent-Hintergrund – Text
// und Akzentfarbe bleiben, damit der Kontrast erhalten bleibt und die Seite ihr
// Ozean-Blau behält.

export const BRIGHTNESS_VARS = [
  "--color-bg",
  "--color-surface",
  "--color-surface-2",
  "--color-border",
  "--color-accent-soft",
] as const;

export type BrightnessVar = (typeof BRIGHTNESS_VARS)[number];

// Ausgangswerte: das ursprüngliche, dunkle Design (Stufe 0).
export const BASE_PALETTE: Record<BrightnessVar, string> = {
  "--color-bg": "#060f18",
  "--color-surface": "#0c1826",
  "--color-surface-2": "#132436",
  "--color-border": "#24384f",
  "--color-accent-soft": "#122c40",
};

// Wie weit die Stufe 100 aufhellt: die Farbe rückt um 15 % der verbleibenden
// Strecke zu Weiß nach oben. Aus #060f18 wird so etwa #16344f – sichtbar
// heller, aber immer noch ein dunkles Design.
const MAX_LIFT = 0.15;

export function isBrightnessLevel(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

// Aufgehellt wird über die Helligkeit in HSL, nicht durch Mischen mit Weiß:
// so bleiben Farbton und Sättigung – und damit der blaue Charakter – erhalten.
export function lighten(hex: string, level: number): string {
  const { h, s, l } = hexToHsl(hex);
  const lifted = l + (level / 100) * MAX_LIFT * (1 - l);
  return hslToHex(h, s, Math.min(1, lifted));
}

export function brightnessPalette(level: number): Record<BrightnessVar, string> {
  return Object.fromEntries(
    BRIGHTNESS_VARS.map((name) => [name, lighten(BASE_PALETTE[name], level)]),
  ) as Record<BrightnessVar, string>;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const r = ((value >> 16) & 255) / 255;
  const g = ((value >> 8) & 255) / 255;
  const b = (value & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l };

  const s = delta / (1 - Math.abs(2 * l - 1));
  const h =
    max === r
      ? 60 * (((g - b) / delta + 6) % 6)
      : max === g
        ? 60 * ((b - r) / delta + 2)
        : 60 * ((r - g) / delta + 4);
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];

  const channel = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

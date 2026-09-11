import fs from "node:fs";
import path from "node:path";
import {
  BRIGHTNESS_VARS,
  brightnessPalette,
  isBrightnessLevel,
  type BrightnessVar,
} from "@/lib/theme-brightness";

// Liest und schreibt die Helligkeitsstufe in globals.css. Nur serverseitig
// benutzbar (Dateisystem) – der Regler selbst holt sich den Wert als Prop.

const CSS_FILE = path.join(process.cwd(), "src/app/globals.css");
const MARKER = /(\/\* Helligkeit: )(\d+)( % \*\/)/;

export function readBrightnessLevel(): number {
  const level = Number.parseInt(readCss().match(MARKER)?.[2] ?? "", 10);
  return isBrightnessLevel(level) ? level : 0;
}

// Schreibt die aus der Stufe berechneten Farben in die @theme-Angaben zurück.
// Ausgangspunkt ist immer die Basis-Palette, nie der aktuelle Wert – sonst
// würde jedes Speichern erneut aufhellen.
export function writeBrightnessLevel(level: number): string {
  const palette = brightnessPalette(level);
  let css = readCss();

  if (!MARKER.test(css)) {
    throw new Error("Helligkeits-Markierung in globals.css fehlt");
  }
  css = css.replace(MARKER, `$1${level}$3`);

  for (const name of BRIGHTNESS_VARS) {
    css = replaceColor(css, name, palette[name]);
  }

  fs.writeFileSync(CSS_FILE, css, "utf8");
  return "src/app/globals.css";
}

function replaceColor(css: string, name: BrightnessVar, hex: string): string {
  const declaration = new RegExp(`(\\n\\s*${name}:\\s*)#[0-9a-fA-F]{3,8}(;)`);
  if (!declaration.test(css)) {
    throw new Error(`${name} in globals.css nicht gefunden`);
  }
  return css.replace(declaration, `$1${hex}$2`);
}

function readCss(): string {
  return fs.readFileSync(CSS_FILE, "utf8");
}

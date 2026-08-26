import { notFound } from "next/navigation";

// Siehe (de)/[...rest] – genauere Route als der deutsche Catch-all, damit
// unbekannte /en/-Adressen die englische 404-Seite bekommen.
export default function CatchAll() {
  notFound();
}

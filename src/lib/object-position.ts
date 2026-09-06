import type { CSSProperties } from "react";

// Bildausschnitte, die sich auf schmalen Displays unterscheiden dürfen.
// Die Umschaltung passiert nicht hier, sondern in `.cover-image`
// (src/app/globals.css) – React kennt keine Media Queries, deshalb gehen
// beide Werte als CSS-Variablen raus.
export function positionVars(
  desktop?: string | null,
  mobile?: string | null,
): CSSProperties | undefined {
  if (!desktop && !mobile) return undefined;

  return {
    "--cover-pos": desktop ?? undefined,
    "--cover-pos-mobile": mobile ?? desktop ?? undefined,
  } as CSSProperties;
}

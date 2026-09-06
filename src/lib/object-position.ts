import type { CSSProperties } from "react";

// Bildausschnitt und Zoomstufe, beides mit eigenem Wert für schmale Displays.
// Die Umschaltung passiert nicht hier, sondern in `.cover-image`
// (src/app/globals.css) – React kennt keine Media Queries, deshalb gehen
// alle Werte als CSS-Variablen raus.
//
// Der Zoom skaliert das Bild um den gewählten Punkt herum: `transform-origin`
// bekommt dieselbe Position, sonst würde das Motiv beim Heranzoomen wandern.
export function imageVars({
  position,
  positionMobile,
  zoom,
  zoomMobile,
}: {
  position?: string | null;
  positionMobile?: string | null;
  zoom?: number | null;
  zoomMobile?: number | null;
}): CSSProperties | undefined {
  if (!position && !positionMobile && !zoom && !zoomMobile) return undefined;

  return {
    "--cover-pos": position ?? undefined,
    "--cover-pos-mobile": positionMobile ?? position ?? undefined,
    "--cover-zoom": zoom ?? undefined,
    "--cover-zoom-mobile": zoomMobile ?? zoom ?? undefined,
  } as CSSProperties;
}

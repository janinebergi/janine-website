import { Gallery } from "@/components/gallery";

type Photo = { src: string; alt: string };

// Bildstreifen im Fließtext: zwei bis drei quadratisch beschnittene Fotos
// nebeneinander, direkt unter der Stelle, die sie beschreibt. Ein Klick
// vergrößert das Bild (dieselbe Lightbox wie in der Beitragsgalerie), die
// Bildunterschrift erscheint beim Darüberfahren.
//
// Jede Kachel ist gleich groß, egal wie viele in der Zeile stehen: Eine Zeile
// mit einem oder zwei Fotos behält die Breite einer Dreierzeile und steht
// mittig, statt sich über die ganze Textbreite zu ziehen.
export function Fotos({ images }: { images: Photo[] }) {
  return (
    <div className="not-prose my-10">
      <Gallery images={images} paged={false} showCaptions />
    </div>
  );
}

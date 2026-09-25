import { Gallery } from "@/components/gallery";

type Photo = { src: string; alt: string };

// Bildstreifen im Fließtext: zwei bis drei quadratisch beschnittene Fotos
// nebeneinander, direkt unter der Stelle, die sie beschreibt. Ein Klick
// vergrößert das Bild (dieselbe Lightbox wie in der Beitragsgalerie), die
// Bildunterschrift erscheint beim Darüberfahren.
//
// Ein einzelnes Foto läuft bewusst nicht über die volle Textbreite – als
// Quadrat wäre es sonst riesig und würde den Beitrag zerreißen.
export function Fotos({ images }: { images: Photo[] }) {
  const columns = Math.min(images.length, 3) as 1 | 2 | 3;

  return (
    <div className={`not-prose my-10 ${columns === 1 ? "mx-auto max-w-sm" : ""}`}>
      <Gallery images={images} paged={false} showCaptions columns={columns} />
    </div>
  );
}

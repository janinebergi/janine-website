"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = {
  src: string;
  alt: string;
};

// Es werden immer nur so viele Bilder gleichzeitig angezeigt.
const VISIBLE = 3;

export function Gallery({ images }: { images: GalleryImage[] }) {
  // null = Lightbox geschlossen, sonst Index des angezeigten Bildes.
  const [active, setActive] = useState<number | null>(null);
  // Index des ersten sichtbaren Bildes im Fenster.
  const [start, setStart] = useState(0);

  const maxStart = Math.max(0, images.length - VISIBLE);
  const canPage = images.length > VISIBLE;

  const pagePrev = useCallback(() => setStart((s) => Math.max(0, s - 1)), []);
  const pageNext = useCallback(
    () => setStart((s) => Math.min(maxStart, s + 1)),
    [maxStart],
  );

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  // Tastatursteuerung + Body-Scroll sperren, solange die Lightbox offen ist.
  useEffect(() => {
    if (active === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, prev, next]);

  const visible = images.slice(start, start + VISIBLE);

  return (
    <>
      <div className="mt-12 flex items-center gap-2 sm:gap-4">
        {canPage && (
          <button
            type="button"
            onClick={pagePrev}
            disabled={start === 0}
            aria-label="Vorherige Bilder"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="grid flex-1 grid-cols-3 gap-3 sm:gap-5">
          {visible.map((img, localIndex) => {
            const i = start + localIndex;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${img.alt} – vergrößern`}
                className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>

        {canPage && (
          <button
            type="button"
            onClick={pageNext}
            disabled={start >= maxStart}
            aria-label="Nächste Bilder"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30 sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bildergalerie"
          onClick={close}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Schließen"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Vorheriges Bild"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Nächstes Bild"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full max-h-[80vh] w-full max-w-4xl items-center justify-center"
          >
            <Image
              key={images[active].src}
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-contain"
              priority
            />
          </div>

          <p className="mt-4 max-w-2xl text-center text-sm text-white/80">
            {images[active].alt}
            <span className="ml-3 text-white/50">
              {active + 1} / {images.length}
            </span>
          </p>
        </div>
      )}
    </>
  );
}

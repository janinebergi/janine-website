"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { slugify } from "@/lib/slugify";

// Ein Kartenmarker mit bereits projizierten Pixel-Koordinaten. `section` ist
// der Titel der Ziel-Überschrift im Beitrag (wird zu ihrer ID slugifiziert);
// fehlt er, führt der Marker zu keiner Textstelle und zeigt nur den Tooltip.
export type MarkerStop = {
  n: number;
  x: number;
  y: number;
  name: string;
  highlight: string;
  section?: string;
};

// Zwei Markergrößen, damit kleinmaßstäbliche Karten (Portugal, Florida) dieselbe
// Interaktion wie die großen bekommen, ohne dass die Kreise überdimensioniert
// wirken.
type MarkerDims = {
  radius: number;
  numberSize: number;
  tipCharW: number;
  tipPad: number;
  tipOffset: number;
  tipTop: number;
  tipHeight: number;
  tipTextSize: number;
};

const SIZES: Record<"lg" | "sm", MarkerDims> = {
  lg: {
    radius: 12,
    numberSize: 13,
    tipCharW: 6.6,
    tipPad: 20,
    tipOffset: 18,
    tipTop: 12,
    tipHeight: 22,
    tipTextSize: 12,
  },
  sm: {
    radius: 8,
    numberSize: 10,
    tipCharW: 6.2,
    tipPad: 18,
    tipOffset: 16,
    tipTop: 11,
    tipHeight: 20,
    tipTextSize: 11,
  },
};

function scrollToSection(section: string) {
  const id = slugify(section);
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Adresse aktualisieren, ohne zusätzlich zu springen (scrollIntoView erledigt
  // das bereits und respektiert dabei den scroll-margin der Überschrift).
  history.pushState(null, "", `#${id}`);
}

// Rendert die interaktiven Nummern-Marker samt Tooltip in die umgebende SVG.
// Am Desktop (Zeiger mit Hover) erscheint der Tooltip beim Drüberfahren und ein
// Klick springt zur passenden Textstelle. Am Handy (kein Hover) blendet der
// erste Tipp den Tooltip ein, ein weiterer Tipp auf denselben Punkt springt zum
// Text.
export function RouteMarkers({
  stops,
  size = "lg",
}: {
  stops: MarkerStop[];
  size?: "lg" | "sm";
}) {
  const dims = SIZES[size];
  const [active, setActive] = useState<number | null>(null);
  const canHover = useRef(true);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover)").matches;
  }, []);

  function activate(s: MarkerStop) {
    if (!s.section) {
      // Ohne Ziel nur den Tooltip ein-/ausblenden.
      setActive((cur) => (cur === s.n ? null : s.n));
      return;
    }
    if (canHover.current || active === s.n) {
      scrollToSection(s.section);
    } else {
      setActive(s.n);
    }
  }

  function onKeyDown(e: KeyboardEvent<SVGGElement>, s: MarkerStop) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(s);
    }
  }

  return (
    <>
      {stops.map((s) => {
        const tipW = s.highlight.length * dims.tipCharW + dims.tipPad;
        const tipY = s.y - dims.tipOffset;
        const revealed = active === s.n;
        const label = s.section
          ? `${s.name}: ${s.highlight} – zum Abschnitt`
          : `${s.name}: ${s.highlight}`;
        return (
          <g
            key={s.n}
            className="group cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={label}
            onClick={() => activate(s)}
            onKeyDown={(e) => onKeyDown(e, s)}
          >
            <circle
              cx={s.x}
              cy={s.y}
              r={dims.radius}
              className="fill-accent-hover stroke-bg"
              strokeWidth={size === "sm" ? 2 : 2.5}
            />
            <text
              x={s.x}
              y={s.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none fill-accent-foreground"
              fontSize={dims.numberSize}
              fontWeight={600}
            >
              {s.n}
            </text>
            {/* Tooltip: am Desktop bei Hover, am Handy nach dem ersten Tipp */}
            <g
              className={`pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                revealed ? "opacity-100" : "opacity-0"
              }`}
            >
              <rect
                x={s.x - tipW / 2}
                y={tipY - dims.tipTop}
                width={tipW}
                height={dims.tipHeight}
                rx={6}
                className="fill-foreground"
              />
              <text
                x={s.x}
                y={tipY - 1}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-bg"
                fontSize={dims.tipTextSize}
                fontWeight={500}
              >
                {s.highlight}
              </text>
            </g>
          </g>
        );
      })}
    </>
  );
}

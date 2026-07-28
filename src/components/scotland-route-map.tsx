import { MapPin } from "lucide-react";
import type { Lang } from "@/lib/i18n-constants";
import { RouteMarkers } from "@/components/route-map-marker";

type Stop = {
  n: number;
  name: string;
  note: string;
  highlight: string;
  lon: number;
  lat: number;
  // Label-Platzierung im projizierten Koordinatenraum
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
};

// Rundreise: Ankunft am Flughafen Edinburgh, von dort nach Glasgow, weiter mit
// Standquartier in Fort William für die Highlands-Trips und zum Schluss zurück
// nach Edinburgh. Schottland steht hochkant, deshalb fächern die Labels nach
// den Seiten auf.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Glasgow", note: "1 Nacht", highlight: "Ankunft · Tiny House", lon: -4.25, lat: 55.86, lx: 95, ly: 300, anchor: "end" },
    { n: 2, name: "Fort William", note: "4 Nächte", highlight: "Standquartier für die Highlands", lon: -5.11, lat: 56.82, lx: 105, ly: 168, anchor: "start" },
    { n: 3, name: "Edinburgh", note: "2 Nächte", highlight: "Flughafen · Start & Ziel der Rundreise", lon: -3.19, lat: 55.95, lx: 195, ly: 278, anchor: "start" },
  ],
  en: [
    { n: 1, name: "Glasgow", note: "1 night", highlight: "Arrival · tiny house", lon: -4.25, lat: 55.86, lx: 95, ly: 300, anchor: "end" },
    { n: 2, name: "Fort William", note: "4 nights", highlight: "Base for the Highlands", lon: -5.11, lat: 56.82, lx: 105, ly: 168, anchor: "start" },
    { n: 3, name: "Edinburgh", note: "2 nights", highlight: "Airport · start & end of the loop", lon: -3.19, lat: 55.95, lx: 195, ly: 278, anchor: "start" },
  ],
};

// Zielüberschrift je Station (Titel der ## -Überschrift im Beitrag).
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Ein wirklich Tiny House",
    2: "Panoramafahrt in die Highlands",
    3: "Zaubertränke und Whisky in Edinburgh",
  },
  en: {
    1: "A truly tiny house",
    2: "A panoramic drive into the Highlands",
    3: "Potions and whisky in Edinburgh",
  },
};

const captions: Record<Lang, string> = {
  de: "Rundreise ab Flughafen Edinburgh nach Glasgow, weiter nach Fort William und zurück nach Edinburgh · Klammer = Nächte vor Ort · 7 Nächte / 8 Tage",
  en: "Round trip from Edinburgh airport to Glasgow, on to Fort William and back to Edinburgh · brackets = nights spent there · 7 nights / 8 days",
};

// Stilisierter, aber erkennbarer Umriss des schottischen Festlands (lon, lat),
// im Uhrzeigersinn ab Cape Wrath: Nordküste nach Osten, Ostküste mit der
// Einbuchtung des Moray Firth und dem Firth of Forth, die kurze Südküste zur
// Grenze und die stark gegliederte Westküste (vereinfacht) zurück in den Norden.
const outline: [number, number][] = [
  // Nordküste (W → O)
  [-5.0, 58.62],
  [-4.4, 58.55],
  [-3.55, 58.62],
  [-3.02, 58.64],
  // Ostküste (N → S) mit Moray Firth
  [-3.05, 58.4],
  [-3.6, 57.95],
  [-4.15, 57.58],
  [-3.3, 57.7],
  [-2.05, 57.7],
  [-1.78, 57.5],
  [-2.07, 57.14],
  [-2.45, 56.75],
  [-2.62, 56.45],
  [-2.8, 56.1],
  [-3.35, 56.02],
  [-2.15, 55.9],
  [-2.03, 55.65],
  // Südküste (O → W)
  [-2.55, 55.15],
  [-3.05, 54.98],
  [-3.6, 54.88],
  [-4.35, 54.72],
  [-4.9, 54.63],
  // Westküste (S → N), vereinfacht
  [-4.72, 55.2],
  [-5.05, 55.4],
  [-5.6, 55.35],
  [-5.35, 55.9],
  [-5.6, 56.45],
  [-5.95, 56.85],
  [-5.65, 57.35],
  [-5.85, 57.6],
  [-5.35, 58.0],
  [-5.2, 58.3],
];

const MIN_LON = -6.4;
const MAX_LAT = 58.95;
// Auf dieser Breite ist ein Längengrad deutlich kürzer als ein Breitengrad
// (cos ≈ 0,55), deshalb wird die x-Achse gestaucht, damit die Form stimmt.
const PX_PER_DEG_LON = 50;
const PX_PER_DEG_LAT = 90;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG_LON, (MAX_LAT - lat) * PX_PER_DEG_LAT];
}

const outlinePath =
  outline
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

export function ScotlandRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];
  const byName = (n: number) => stops.find((s) => s.n === n)!;

  // Route als Rundreise: ab Edinburgh (Flughafen) → Glasgow → Fort William →
  // zurück nach Edinburgh
  const routePath = [3, 1, 2, 3]
    .map((n, i) => {
      const s = byName(n);
      const [x, y] = project(s.lon, s.lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-45 -15 405 425"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the eight-day Scotland round trip with all stops"
              : "Karte der achttägigen Schottland-Rundreise mit allen Stationen"
          }
          className="h-auto w-full max-w-[420px]"
        >
          {/* Landfläche */}
          <path
            d={outlinePath}
            className="fill-accent-soft stroke-border"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* Route */}
          <path
            d={routePath}
            fill="none"
            className="stroke-accent-hover"
            strokeWidth={3}
            strokeDasharray="7 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Verbindungslinien zu den Labels */}
          {stops.map((s) => {
            const [x, y] = project(s.lon, s.lat);
            return (
              <line
                key={`leader-${s.n}`}
                x1={x}
                y1={y}
                x2={s.lx}
                y2={s.ly + (s.ly < y ? 9 : -9)}
                className="stroke-muted"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
          {/* Beschriftung: Ortsname + kurze Etappen-Notiz in Klammern */}
          {stops.map((s) => (
            <text
              key={`label-${s.n}`}
              x={s.lx}
              y={s.ly}
              textAnchor={s.anchor}
              dominantBaseline="central"
              className="fill-foreground"
              fontSize={14}
            >
              <tspan fontWeight={600}>{s.name}</tspan>
              <tspan className="fill-muted"> ({s.note})</tspan>
            </text>
          ))}
          {/* Marker: Hover/Tipp zeigt das Stichwort, Klick führt zur Textstelle */}
          <RouteMarkers
            stops={stops.map((s) => {
              const [x, y] = project(s.lon, s.lat);
              return {
                n: s.n,
                x,
                y,
                name: s.name,
                highlight: s.highlight,
                section: sectionsByLang[lang][s.n],
              };
            })}
          />
        </svg>
      </div>

      <p className="flex items-center gap-2 border-t border-border px-6 py-3 text-xs text-muted sm:px-8">
        <MapPin size={13} className="shrink-0 text-accent-hover" />
        {captions[lang]}
      </p>
    </div>
  );
}

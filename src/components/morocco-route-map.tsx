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

// Stationen in Reihenfolge der Reise: ab Marrakesch über den Atlas in die
// Wüste, zurück nach Marrakesch und weiter an den Atlantik.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Marrakesch", note: "2 + 1 Nächte", highlight: "Ankunft, Riad & Souk-Tour", lon: -7.99, lat: 31.63, lx: 108, ly: 176, anchor: "middle" },
    { n: 2, name: "Aït-Ben-Haddou", note: "1 Nacht", highlight: "UNESCO-Welterbe", lon: -7.13, lat: 31.05, lx: 315, ly: 356, anchor: "start" },
    { n: 3, name: "Merzouga", note: "1 Nacht", highlight: "Erg Chebbi · Kamelritt", lon: -4.01, lat: 31.1, lx: 505, ly: 236, anchor: "start" },
    { n: 4, name: "Agadir", note: "1 Nacht", highlight: "Strand am Atlantik", lon: -9.6, lat: 30.42, lx: 100, ly: 303, anchor: "middle" },
  ],
  en: [
    { n: 1, name: "Marrakech", note: "2 + 1 nights", highlight: "Arrival, riad & souk tour", lon: -7.99, lat: 31.63, lx: 108, ly: 176, anchor: "middle" },
    { n: 2, name: "Aït Ben Haddou", note: "1 night", highlight: "UNESCO World Heritage", lon: -7.13, lat: 31.05, lx: 315, ly: 356, anchor: "start" },
    { n: 3, name: "Merzouga", note: "1 night", highlight: "Erg Chebbi · camel ride", lon: -4.01, lat: 31.1, lx: 505, ly: 236, anchor: "start" },
    { n: 4, name: "Agadir", note: "1 night", highlight: "Atlantic beach", lon: -9.6, lat: 30.42, lx: 100, ly: 303, anchor: "middle" },
  ],
};

// Zielüberschrift je Station (Titel der ## -Überschrift im Beitrag).
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Ankunft in Marrakesch",
    2: "Aufbruch in die Wüste",
    3: "Auf dem Kamel Richtung Sonnenuntergang",
    4: "Ab ans Meer",
  },
  en: {
    1: "Arriving in Marrakech",
    2: "Setting Off Into the Desert",
    3: "On a Camel Towards the Sunset",
    4: "Off to the Sea",
  },
};

const captions: Record<Lang, string> = {
  de: "Ab Marrakesch über das Atlasgebirge und Aït-Ben-Haddou in die Merzouga-Wüste, zurück nach Marrakesch und weiter an den Atlantik nach Agadir · Klammer = Nächte vor Ort · 6 Nächte / 6 Tage",
  en: "From Marrakech across the Atlas Mountains and Aït Ben Haddou to the Merzouga desert, back to Marrakech and on to the Atlantic in Agadir · brackets = nights spent there · 6 nights / 6 days",
};

// Stilisierter, aber erkennbarer Umriss Marokkos (lon, lat), im Uhrzeigersinn:
// Mittelmeerküste im Norden, Ostgrenze zu Algerien mit der markanten Spitze
// bei Figuig, der nach Südwesten auslaufende Süden bis Tarfaya und die lange
// Atlantikküste zurück in den Norden.
const outline: [number, number][] = [
  // Mittelmeerküste (Nord), West → Ost
  [-5.92, 35.79],
  [-5.4, 35.85],
  [-4.5, 35.55],
  [-3.9, 35.25],
  [-2.95, 35.4],
  [-2.2, 35.09],
  // Ostgrenze zu Algerien, Nord → Süd
  [-1.68, 34.75],
  [-1.2, 33.9],
  [-1.55, 33.2],
  [-1.1, 32.4],
  [-1.0, 32.1],
  [-2.5, 32.0],
  [-3.65, 31.7],
  [-3.8, 31.0],
  [-4.3, 30.5],
  [-5.5, 29.9],
  [-6.9, 29.5],
  [-8.0, 28.9],
  [-9.3, 28.7],
  [-10.7, 28.5],
  [-11.5, 28.05],
  [-12.9, 27.92],
  // Atlantikküste, Süd → Nord
  [-11.4, 28.75],
  [-10.15, 29.4],
  [-9.68, 30.42],
  [-9.82, 31.5],
  [-9.26, 32.3],
  [-8.5, 33.25],
  [-7.62, 33.6],
  [-6.85, 34.02],
  [-6.2, 34.8],
];

const MIN_LON = -13.3;
const MAX_LAT = 36.2;
const PX_PER_DEG = 48;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG, (MAX_LAT - lat) * PX_PER_DEG];
}

const outlinePath =
  outline
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

export function MoroccoRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];
  const byName = (n: number) => stops.find((s) => s.n === n)!;

  // Route in Reisereihenfolge inkl. Rückweg von der Wüste nach Marrakesch,
  // bevor es an den Atlantik geht: 1 → 2 → 3 → 1 → 4
  const routePath = [1, 2, 3, 1, 4]
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
          viewBox="-35 -15 705 445"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the six-day Morocco trip with all stops"
              : "Karte der sechstägigen Marokko-Reise mit allen Stationen"
          }
          className="h-auto w-full max-w-[560px]"
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

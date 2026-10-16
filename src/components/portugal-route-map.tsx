import { MapPin } from "lucide-react";
import type { Lang } from "@/lib/i18n-constants";
import { RouteMarkers } from "@/components/route-map-marker";
import { RouteArrows, bowSegment } from "@/components/route-arrows";

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

// Stationen in Reihenfolge der Reise: Ankunft in Lissabon, Surf-Resort in
// Ericeira, Surfcamp in Santa Cruz (Surfen in Peniche), zurück über Lissabon
// an die Algarve nach Lagos. Alle Orte liegen an der Westküste – deshalb steht
// das (hochkante) Land links und die Labels fächern nach rechts auf, damit die
// Karte im Querformat erscheint.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Lissabon", note: "Ausflug & Transit", highlight: "Ankunft · Tagesausflug", lon: -9.14, lat: 38.5, lx: -12, ly: 281, anchor: "end" },
    { n: 2, name: "Ericeira", note: "4 Nächte", highlight: "Vila Galé · Surf-Resort", lon: -9.4, lat: 38.85, lx: -12, ly: 241, anchor: "end" },
    { n: 3, name: "Santa Cruz", note: "7 Nächte", highlight: "Surfcamp · Surfen in Peniche", lon: -9.42, lat: 39.25, lx: -12, ly: 205, anchor: "end" },
    { n: 4, name: "Lagos", note: "5 Nächte", highlight: "Algarve · Buchten & Roller", lon: -8.67, lat: 37.1, lx: -12, ly: 367, anchor: "end" },
  ],
  en: [
    { n: 1, name: "Lisbon", note: "day trip & transit", highlight: "Arrival · day trip", lon: -9.14, lat: 38.5, lx: -12, ly: 281, anchor: "end" },
    { n: 2, name: "Ericeira", note: "4 nights", highlight: "Vila Galé · surf resort", lon: -9.4, lat: 38.85, lx: -12, ly: 241, anchor: "end" },
    { n: 3, name: "Santa Cruz", note: "7 nights", highlight: "Surf camp · surfing in Peniche", lon: -9.42, lat: 39.25, lx: -12, ly: 205, anchor: "end" },
    { n: 4, name: "Lagos", note: "5 nights", highlight: "Algarve · coves & scooter", lon: -8.67, lat: 37.1, lx: -12, ly: 367, anchor: "end" },
  ],
};

// Zielüberschrift je Station (Titel der ## -Überschrift im Beitrag).
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Ausflug nach Lissabon",
    2: "Ankunft im Hotel",
    3: "Aufbruch ins Surfcamp",
    4: "Aufbruch zur Algarve",
  },
  en: {
    1: "Day trip to Lisbon",
    2: "Arrival at the hotel",
    3: "Off to the surf camp",
    4: "Off to the Algarve",
  },
};

const captions: Record<Lang, string> = {
  de: "Pfeile = Reiserichtung, der Bogen ist der Weg zurück nach Lissabon · Ankunft in Lissabon, Surf-Resort in Ericeira, Surfcamp in Santa Cruz (Surfen in Peniche), zurück über Lissabon an die Algarve nach Lagos · Klammer = Nächte vor Ort · 16 Nächte / 17 Tage",
  en: "Arrows = direction of travel, the arc is the way back to Lisbon · arrival in Lisbon, surf resort in Ericeira, surf camp in Santa Cruz (surfing in Peniche), back via Lisbon to the Algarve in Lagos · brackets = nights spent there · 16 nights / 17 days",
};

// Stilisierter, aber erkennbarer Umriss des portugiesischen Festlands
// (lon, lat), im Uhrzeigersinn: Nordgrenze zu Spanien, die Ostgrenze am
// Guadiana entlang, die Algarve-Südküste bis zum Cabo de São Vicente und
// die lange Atlantik-Westküste zurück in den Norden.
const outline: [number, number][] = [
  // Nordgrenze, West → Ost
  [-8.78, 41.92],
  [-8.1, 42.03],
  [-7.2, 41.88],
  [-6.55, 41.65],
  // Ostgrenze zu Spanien, Nord → Süd
  [-6.2, 41.03],
  [-6.95, 40.35],
  [-6.8, 39.65],
  [-7.05, 39.1],
  [-7.3, 38.65],
  [-7.1, 38.02],
  [-7.42, 37.4],
  // Algarve-Südküste, Ost → West
  [-7.9, 37.01],
  [-8.6, 37.09],
  [-8.99, 37.02],
  // Atlantik-Westküste, Süd → Nord
  [-8.8, 37.55],
  [-8.79, 38.05],
  [-9.0, 38.35],
  [-9.23, 38.45],
  [-9.48, 38.7],
  [-9.4, 39.0],
  [-9.42, 39.36],
  [-8.95, 39.75],
  [-8.87, 40.2],
  [-8.68, 41.15],
];

const MIN_LON = -9.6;
const MAX_LAT = 42.2;
const PX_PER_DEG = 72;

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

export function PortugalRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];
  const byName = (n: number) => stops.find((s) => s.n === n)!;

  // Route in Reisereihenfolge inkl. Zwischenstopp in Lissabon auf dem Weg von
  // der Surfküste an die Algarve: 1 → 2 → 3 → 1 → 4. Der Weg zurück nach
  // Lissabon führt dieselbe Küste entlang und wird deshalb als Bogen über dem
  // Atlantik gezeichnet, sonst lägen Hin- und Rückweg übereinander.
  const RUECKWEG_BOGEN = 30;
  const [p1, p2, p3, p4] = [1, 2, 3, 4].map((n) => {
    const s = byName(n);
    return project(s.lon, s.lat);
  });
  const routePath = [
    `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`,
    `L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`,
    `L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}`,
    bowSegment(p3, p1, RUECKWEG_BOGEN),
    `L${p4[0].toFixed(1)} ${p4[1].toFixed(1)}`,
  ].join(" ");
  const arrowCoords: [number, number][] = [p1, p2, p3, p1, p4];
  const arrowBow = [0, 0, RUECKWEG_BOGEN, 0];

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-180 -15 445 400"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the 17-day Portugal trip with all stops"
              : "Karte der 17-tägigen Portugal-Reise mit allen Stationen"
          }
          className="h-auto w-full max-w-[460px]"
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
            strokeWidth={2.5}
            strokeDasharray="6 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Richtungspfeile: sie machen die Reihenfolge der Etappen auf einen Blick klar */}
          <RouteArrows points={arrowCoords} bow={arrowBow} size={6} />
          {/* Verbindungslinien zu den Labels */}
          {stops.map((s) => {
            const [x, y] = project(s.lon, s.lat);
            return (
              <line
                key={`leader-${s.n}`}
                x1={x}
                y1={y}
                x2={s.lx}
                y2={s.ly + (s.ly < y ? 8 : -8)}
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
              fontSize={12}
            >
              <tspan fontWeight={600}>{s.name}</tspan>
              <tspan className="fill-muted"> ({s.note})</tspan>
            </text>
          ))}
          {/* Marker: Hover/Tipp zeigt das Stichwort, Klick führt zur Textstelle */}
          <RouteMarkers
            size="sm"
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

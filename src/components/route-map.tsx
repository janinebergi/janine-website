import { MapPin } from "lucide-react";
import type { Lang } from "@/lib/i18n-constants";

type Stop = {
  n: number;
  name: string;
  nights: string;
  highlight: string;
  lon: number;
  lat: number;
  // Label-Platzierung im projizierten Koordinatenraum
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
  leader?: boolean;
  // Tagesausflug von der Basis Weligama aus – nicht Teil der Übernachtungsroute
  dayTrip?: boolean;
};

// Stopps in Reihenfolge der Route (Koordinaten leicht entzerrt,
// damit die Marker im dicht besiedelten Süden lesbar bleiben)
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Colombo", nights: "2", highlight: "Ankunft", lon: 79.85, lat: 6.93, lx: 36, ly: 465, anchor: "end" },
    { n: 2, name: "Sigiriya", nights: "1", highlight: "Pidurangala Rock", lon: 80.76, lat: 7.95, lx: 205, ly: 311, anchor: "start" },
    { n: 3, name: "Kandy", nights: "2", highlight: "Zahntempel", lon: 80.63, lat: 7.29, lx: 153, ly: 410, anchor: "end" },
    { n: 4, name: "Ella", nights: "2", highlight: "Zugfahrt & Teeplantage", lon: 81.05, lat: 6.87, lx: 248, ly: 473, anchor: "start" },
    { n: 5, name: "Safari", nights: "Tagesstopp", highlight: "Safari", lon: 80.89, lat: 6.44, lx: 225, ly: 538, anchor: "start" },
    { n: 6, name: "Hiriketiya", nights: "3", highlight: "Surfen & Entspannen", lon: 80.7, lat: 5.97, lx: 320, ly: 690, anchor: "middle", leader: true },
    { n: 7, name: "Weligama", nights: "4", highlight: "Surfen · Basis im Süden", lon: 80.4, lat: 5.98, lx: 150, ly: 690, anchor: "middle", leader: true },
    { n: 8, name: "Mirissa", nights: "Tagesausflug", highlight: "Schildkröten", lon: 80.53, lat: 5.92, lx: 250, ly: 664, anchor: "middle", leader: true, dayTrip: true },
    { n: 9, name: "Galle", nights: "Tagesausflug", highlight: "Altstadt & Fort", lon: 80.22, lat: 6.03, lx: 70, ly: 664, anchor: "middle", leader: true, dayTrip: true },
  ],
  en: [
    { n: 1, name: "Colombo", nights: "2", highlight: "Arrival", lon: 79.85, lat: 6.93, lx: 36, ly: 465, anchor: "end" },
    { n: 2, name: "Sigiriya", nights: "1", highlight: "Pidurangala Rock", lon: 80.76, lat: 7.95, lx: 205, ly: 311, anchor: "start" },
    { n: 3, name: "Kandy", nights: "2", highlight: "Temple of the Tooth", lon: 80.63, lat: 7.29, lx: 153, ly: 410, anchor: "end" },
    { n: 4, name: "Ella", nights: "2", highlight: "Train ride & tea plantation", lon: 81.05, lat: 6.87, lx: 248, ly: 473, anchor: "start" },
    { n: 5, name: "Safari", nights: "Day stop", highlight: "Safari", lon: 80.89, lat: 6.44, lx: 225, ly: 538, anchor: "start" },
    { n: 6, name: "Hiriketiya", nights: "3", highlight: "Surfing & relaxing", lon: 80.7, lat: 5.97, lx: 320, ly: 690, anchor: "middle", leader: true },
    { n: 7, name: "Weligama", nights: "4", highlight: "Surfing · base in the south", lon: 80.4, lat: 5.98, lx: 150, ly: 690, anchor: "middle", leader: true },
    { n: 8, name: "Mirissa", nights: "Day trip", highlight: "Turtles", lon: 80.53, lat: 5.92, lx: 250, ly: 664, anchor: "middle", leader: true, dayTrip: true },
    { n: 9, name: "Galle", nights: "Day trip", highlight: "Old Town & Fort", lon: 80.22, lat: 6.03, lx: 70, ly: 664, anchor: "middle", leader: true, dayTrip: true },
  ],
};

const captions: Record<Lang, string> = {
  de: "Rundreise im Uhrzeigersinn zurück nach Colombo · Klammer = Nächte vor Ort · gepunktete Abzweige = Tagesausflüge von Weligama · 14 Nächte / 15 Tage",
  en: "Clockwise loop back to Colombo · brackets = nights spent there · dotted branches = day trips from Weligama · 14 nights / 15 days",
};

// Vereinfachter Küstenumriss von Sri Lanka (lon, lat)
const outline: [number, number][] = [
  [80.2, 9.82],
  [79.98, 9.75],
  [79.72, 9.3],
  [79.85, 8.75],
  [79.7, 8.35],
  [79.8, 7.9],
  [79.72, 7.3],
  [79.84, 6.85],
  [80.05, 6.3],
  [80.22, 6.03],
  [80.6, 5.92],
  [81.0, 6.05],
  [81.28, 6.2],
  [81.7, 6.3],
  [81.83, 6.9],
  [81.72, 7.55],
  [81.45, 8.1],
  [81.3, 8.58],
  [81.05, 8.95],
  [80.75, 9.3],
  [80.45, 9.65],
];

const MIN_LON = 79.5;
const MAX_LON = 82.0;
const MAX_LAT = 10.0;
const PX_PER_DEG = 150;

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

export function SriLankaRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];

  // Route verbindet alle Übernachtungsstopps und schließt am Ende zurück zu
  // Colombo (Z). Tagesausflüge (Mirissa, Galle) liegen nicht auf der Route.
  const routePath =
    stops
      .filter((s) => !s.dayTrip)
      .map((s, i) => {
        const [x, y] = project(s.lon, s.lat);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  // Basis, von der aus die Tagesausflüge gemacht wurden
  const dayTripBase = stops.find((s) => s.name === "Weligama")!;

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-60 -15 460 720"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the Sri Lanka road trip with all stops and overnight stays"
              : "Karte der Sri-Lanka-Rundreise mit allen Stationen und Übernachtungen"
          }
          className="h-auto w-full max-w-[420px]"
        >
          {/* Landfläche */}
          <path
            d={outlinePath}
            className="fill-accent-soft stroke-border"
            strokeWidth={2}
          />
          {/* Route (Rundreise) */}
          <path
            d={routePath}
            fill="none"
            className="stroke-accent-hover"
            strokeWidth={3}
            strokeDasharray="7 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Abzweige der Tagesausflüge von Weligama aus */}
          {stops.map((s) => {
            if (!s.dayTrip) return null;
            const [bx, by] = project(dayTripBase.lon, dayTripBase.lat);
            const [x, y] = project(s.lon, s.lat);
            return (
              <line
                key={`branch-${s.n}`}
                x1={bx}
                y1={by}
                x2={x}
                y2={y}
                className="stroke-accent-hover"
                strokeWidth={2}
                strokeDasharray="2 5"
                strokeLinecap="round"
                opacity={0.75}
              />
            );
          })}
          {/* Verbindungslinien zu den Labels im Süden */}
          {stops.map((s) => {
            if (!s.leader) return null;
            const [x, y] = project(s.lon, s.lat);
            return (
              <line
                key={`leader-${s.n}`}
                x1={x}
                y1={y}
                x2={s.lx}
                y2={s.ly - 10}
                className="stroke-muted"
                strokeWidth={1}
                opacity={0.55}
              />
            );
          })}
          {/* Beschriftung (Ortsname + Nächte) */}
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
              <tspan className="fill-muted"> ({s.nights})</tspan>
            </text>
          ))}
          {/* Marker mit kurzem Stichwort als Tooltip beim Hovern über die Zahl */}
          {stops.map((s) => {
            const [x, y] = project(s.lon, s.lat);
            const tipW = s.highlight.length * 6.6 + 20;
            const tipY = y - 18;
            return (
              <g key={s.n} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  className="fill-accent-hover stroke-bg"
                  strokeWidth={2.5}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none fill-accent-foreground"
                  fontSize={13}
                  fontWeight={600}
                >
                  {s.n}
                </text>
                {/* Tooltip */}
                <g className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <rect
                    x={x - tipW / 2}
                    y={tipY - 12}
                    width={tipW}
                    height={22}
                    rx={6}
                    className="fill-foreground"
                  />
                  <text
                    x={x}
                    y={tipY - 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-bg"
                    fontSize={12}
                    fontWeight={500}
                  >
                    {s.highlight}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="flex items-center gap-2 border-t border-border px-6 py-3 text-xs text-muted sm:px-8">
        <MapPin size={13} className="shrink-0 text-accent-hover" />
        {captions[lang]}
      </p>
    </div>
  );
}

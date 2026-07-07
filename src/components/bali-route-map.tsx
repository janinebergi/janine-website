import { MapPin } from "lucide-react";

type Stop = {
  n: number;
  name: string;
  highlight: string;
  lon: number;
  lat: number;
  // Label-Platzierung im projizierten Koordinatenraum
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
};

// Stationen in Reihenfolge der Reise (Süd → Zentrum → Inseln)
const stops: Stop[] = [
  { n: 1, name: "Uluwatu", highlight: "Surfen & Klippen", lon: 115.08, lat: -8.82, lx: 108, ly: 196, anchor: "end" },
  { n: 2, name: "Ubud", highlight: "Tempel & Vulkan", lon: 115.26, lat: -8.51, lx: 120, ly: 14, anchor: "middle" },
  { n: 3, name: "Nusa Penida", highlight: "Manta-Tauchen", lon: 115.51, lat: -8.73, lx: 226, ly: 174, anchor: "start" },
  { n: 4, name: "Gili T", highlight: "Wracktauchen", lon: 115.97, lat: -8.33, lx: 295, ly: 108, anchor: "middle" },
  { n: 5, name: "Tulamben", highlight: "Liberty-Wrack", lon: 115.59, lat: -8.28, lx: 255, ly: 30, anchor: "middle" },
  { n: 6, name: "Canggu", highlight: "Beachbars & Abreise", lon: 115.13, lat: -8.65, lx: 110, ly: 140, anchor: "end" },
];

// Vereinfachte Küstenumrisse (lon, lat)
const bali: [number, number][] = [
  [114.62, -8.12],
  [114.95, -8.08],
  [115.25, -8.05],
  [115.5, -8.1],
  [115.62, -8.28],
  [115.58, -8.42],
  [115.6, -8.53],
  [115.5, -8.58],
  [115.35, -8.62],
  [115.28, -8.68],
  [115.24, -8.75],
  [115.22, -8.8],
  [115.14, -8.85],
  [115.06, -8.83],
  [115.04, -8.8],
  [115.08, -8.73],
  [115.1, -8.66],
  [115.06, -8.55],
  [114.95, -8.45],
  [114.78, -8.3],
  [114.62, -8.18],
];

const nusaPenida: [number, number][] = [
  [115.44, -8.67],
  [115.58, -8.66],
  [115.63, -8.72],
  [115.58, -8.79],
  [115.46, -8.78],
  [115.42, -8.72],
];

// Gili-Inseln (Trawangan, Meno, Air) als kleine Inselgruppe vor Lomboks Westküste
const giliIslands: [number, number][] = [
  [115.9, -8.28],
  [115.99, -8.27],
  [116.03, -8.33],
  [116.0, -8.4],
  [115.93, -8.39],
  [115.88, -8.34],
];

const lombok: [number, number][] = [
  [116.08, -8.18],
  [116.3, -8.2],
  [116.3, -8.62],
  [116.1, -8.62],
  [116.05, -8.45],
  [116.08, -8.3],
];

const MIN_LON = 114.55;
const MAX_LAT = -8.0;
const PX_PER_DEG = 220;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG, (MAX_LAT - lat) * PX_PER_DEG];
}

function toPath(points: [number, number][]): string {
  return (
    points
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

const routePath = stops
  .map((s, i) => {
    const [x, y] = project(s.lon, s.lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  })
  .join(" ");

export function BaliRouteMap() {
  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-35 -8 425 222"
          role="img"
          aria-label="Karte der Bali-Rundreise mit allen Stationen"
          className="h-auto w-full max-w-[520px]"
        >
          {/* Landflächen */}
          {[bali, nusaPenida, giliIslands, lombok].map((shape, i) => (
            <path
              key={i}
              d={toPath(shape)}
              className="fill-accent-soft stroke-border"
              strokeWidth={2}
            />
          ))}
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
          {/* Beschriftung (nur Ortsname) */}
          {stops.map((s) => (
            <text
              key={`label-${s.n}`}
              x={s.lx}
              y={s.ly}
              textAnchor={s.anchor}
              dominantBaseline="central"
              className="fill-foreground"
              fontSize={14}
              fontWeight={600}
            >
              {s.name}
            </text>
          ))}
          {/* Marker mit Aktivität als Tooltip beim Hovern über die Zahl */}
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
        Zwei Wochen von der Bukit-Halbinsel über Ubud bis zu den Tauchspots vor
        Nusa Penida, Gili Trawangan und Tulamben
      </p>
    </div>
  );
}

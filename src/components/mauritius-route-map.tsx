import { MapPin } from "lucide-react";
import type { Lang } from "@/lib/i18n-constants";
import { RouteMarkers } from "@/components/route-map-marker";
import { RouteArrows } from "@/components/route-arrows";

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
  // Tagesausflug – nicht Teil der Übernachtungsroute. `bases` sind die
  // Unterkünfte, von denen aus der Ausflug gemacht wurde.
  bases?: string[];
};

// Stopps in Reihenfolge der Route (Koordinaten leicht entzerrt, damit
// Chamarel und La Gaulette auf der kleinen Insel nicht aufeinanderliegen)
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Flughafen", nights: "An- & Abreise", highlight: "Ankunft & Abflug", lon: 57.683, lat: -20.43, lx: 284, ly: 438, anchor: "start" },
    { n: 2, name: "La Gaulette", nights: "4", highlight: "Balkon mit Blick auf den Le Morne", lon: 57.355, lat: -20.415, lx: 32, ly: 398, anchor: "end" },
    { n: 3, name: "Chamarel", nights: "Tagesausflüge", highlight: "Wasserfall, Siebenfarbige Erde & Rum", lon: 57.415, lat: -20.445, lx: 100, ly: 452, anchor: "middle", leader: true, bases: ["La Gaulette", "Flic en Flac"] },
    { n: 4, name: "Tamarin-Wasserfälle", nights: "Tagesausflug", highlight: "Wanderung zu den Wasserfällen", lon: 57.465, lat: -20.36, lx: 140, ly: 364, anchor: "start", bases: ["La Gaulette"] },
    { n: 5, name: "Flic en Flac", nights: "4", highlight: "Tauchen & Billard", lon: 57.365, lat: -20.28, lx: 38, ly: 308, anchor: "end" },
    { n: 6, name: "Port Louis", nights: "Tagesstopp", highlight: "Tempel & Waterfront", lon: 57.5, lat: -20.165, lx: 126, ly: 228, anchor: "end" },
    { n: 7, name: "Grand Baie", nights: "5", highlight: "Wracktauchgang & eigener Pool", lon: 57.58, lat: -20.01, lx: 178, ly: 119, anchor: "end" },
    { n: 8, name: "Pamplemousses", nights: "Tagesausflug", highlight: "Botanischer Garten", lon: 57.575, lat: -20.105, lx: 212, ly: 186, anchor: "start", bases: ["Grand Baie"] },
    { n: 9, name: "Cap Malheureux", nights: "Tagesausflug", highlight: "Rote Kirche", lon: 57.64, lat: -19.975, lx: 255, ly: 94, anchor: "start", bases: ["Grand Baie"] },
    { n: 10, name: "Flat Island", nights: "Tagesausflug", highlight: "Katamaran-Tour", lon: 57.655, lat: -19.87, lx: 265, ly: 21, anchor: "start", bases: ["Grand Baie"] },
  ],
  en: [
    { n: 1, name: "Airport", nights: "arrival & departure", highlight: "Arrival & departure", lon: 57.683, lat: -20.43, lx: 284, ly: 438, anchor: "start" },
    { n: 2, name: "La Gaulette", nights: "4", highlight: "Balcony with a view of Le Morne", lon: 57.355, lat: -20.415, lx: 32, ly: 398, anchor: "end" },
    { n: 3, name: "Chamarel", nights: "Day trips", highlight: "Waterfall, Seven Coloured Earth & rum", lon: 57.415, lat: -20.445, lx: 100, ly: 452, anchor: "middle", leader: true, bases: ["La Gaulette", "Flic en Flac"] },
    { n: 4, name: "Tamarin Falls", nights: "Day trip", highlight: "Hike to the waterfalls", lon: 57.465, lat: -20.36, lx: 140, ly: 364, anchor: "start", bases: ["La Gaulette"] },
    { n: 5, name: "Flic en Flac", nights: "4", highlight: "Diving & pool nights", lon: 57.365, lat: -20.28, lx: 38, ly: 308, anchor: "end" },
    { n: 6, name: "Port Louis", nights: "Day stop", highlight: "Temple & Waterfront", lon: 57.5, lat: -20.165, lx: 126, ly: 228, anchor: "end" },
    { n: 7, name: "Grand Baie", nights: "5", highlight: "Wreck dive & our own pool", lon: 57.58, lat: -20.01, lx: 178, ly: 119, anchor: "end" },
    { n: 8, name: "Pamplemousses", nights: "Day trip", highlight: "Botanical garden", lon: 57.575, lat: -20.105, lx: 212, ly: 186, anchor: "start", bases: ["Grand Baie"] },
    { n: 9, name: "Cap Malheureux", nights: "Day trip", highlight: "Red church", lon: 57.64, lat: -19.975, lx: 255, ly: 94, anchor: "start", bases: ["Grand Baie"] },
    { n: 10, name: "Flat Island", nights: "Day trip", highlight: "Catamaran tour", lon: 57.655, lat: -19.87, lx: 265, ly: 21, anchor: "start", bases: ["Grand Baie"] },
  ],
};

// Zielüberschrift je Station (Titel der ## -Überschrift im Beitrag). Der
// Flughafen hat keinen eigenen Abschnitt und bleibt daher ohne Verweis.
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    2: "Ankunft und erster Tag",
    3: "Chamarel: Wasserfall und Siebenfarbige Erde",
    4: "Ohne Plan zu den Tamarin-Wasserfällen",
    5: "Tauchen in Flic en Flac",
    6: "Port Louis und ein Pool, der keiner ist",
    7: "Wracktauchgang auf 40 Metern",
    8: "Botanischer Garten und Grillen im November",
    9: "Pooltag und rote Kirche",
    10: "Katamaran-Tour",
  },
  en: {
    2: "Arrival and our first day",
    3: "Chamarel: waterfall and the Seven Coloured Earth",
    4: "No plan, all the way to the Tamarin Falls",
    5: "Diving in Flic en Flac",
    6: "Port Louis and a pool that isn't",
    7: "Wreck dive at 40 metres",
    8: "Botanical garden and a barbecue in November",
    9: "Pool day and the red church",
    10: "Catamaran tour",
  },
};

const captions: Record<Lang, string> = {
  de: "Pfeile = Fahrtrichtung · Rundreise ab und bis zum Flughafen · Klammer = Nächte vor Ort · gepunktete Abzweige = Tagesausflüge von der jeweiligen Unterkunft · 13 Nächte / 14 Tage",
  en: "Arrows = direction of travel · loop from and back to the airport · brackets = nights spent there · dotted branches = day trips from each base · 13 nights / 14 days",
};

// Vereinfachter Küstenumriss von Mauritius (lon, lat), im Uhrzeigersinn ab Cap Malheureux
const outline: [number, number][] = [
  [57.613, -19.983],
  [57.66, -20.005],
  [57.7, -20.06],
  [57.725, -20.1],
  [57.76, -20.14],
  [57.785, -20.19],
  [57.79, -20.25],
  [57.775, -20.31],
  [57.77, -20.37],
  [57.735, -20.42],
  [57.71, -20.45],
  [57.65, -20.49],
  [57.58, -20.515],
  [57.52, -20.525],
  [57.45, -20.51],
  [57.38, -20.495],
  [57.335, -20.49],
  [57.31, -20.465],
  [57.33, -20.44],
  [57.355, -20.415],
  [57.37, -20.37],
  [57.365, -20.32],
  [57.36, -20.28],
  [57.385, -20.235],
  [57.42, -20.2],
  [57.47, -20.175],
  [57.5, -20.15],
  [57.52, -20.11],
  [57.54, -20.06],
  [57.565, -20.02],
  [57.59, -19.995],
];

const MIN_LON = 57.28;
const MAX_LAT = -19.84;
const PX_PER_DEG = 700;
// Längengrade liegen auf 20° Süd etwas enger beieinander als Breitengrade.
const LON_SCALE = 0.94;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG * LON_SCALE, (MAX_LAT - lat) * PX_PER_DEG];
}

const outlinePath =
  outline
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

const [flatIslandX, flatIslandY] = project(57.655, -19.87);

export function MauritiusRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];

  // Route verbindet alle Übernachtungsstopps samt Tagesstopp Port Louis und
  // schließt am Ende zurück zum Flughafen (Z). Tagesausflüge liegen nicht auf
  // der Route.
  const routeCoords: [number, number][] = stops
    .filter((s) => !s.bases)
    .map((s) => project(s.lon, s.lat));
  const routePath =
    routeCoords
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ") + " Z";
  // Für die Richtungspfeile zählt auch die Schlussetappe zurück zum Flughafen.
  const arrowCoords: [number, number][] = [...routeCoords, routeCoords[0]];

  const byName = new Map(stops.map((s) => [s.name, s]));

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-95 -10 590 485"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the Mauritius trip with all stops, overnight stays and day trips"
              : "Karte der Mauritius-Reise mit allen Stationen, Übernachtungen und Tagesausflügen"
          }
          className="h-auto w-full max-w-[520px]"
        >
          {/* Landfläche */}
          <path
            d={outlinePath}
            className="fill-accent-soft stroke-border"
            strokeWidth={2}
          />
          <ellipse
            cx={flatIslandX}
            cy={flatIslandY}
            rx={9}
            ry={6}
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
          {/* Richtungspfeile: sie machen die Reihenfolge der Etappen auf einen Blick klar */}
          <RouteArrows points={arrowCoords} size={8} />
          {/* Abzweige der Tagesausflüge von der jeweiligen Unterkunft aus */}
          {stops.flatMap((s) =>
            (s.bases ?? []).map((baseName) => {
              const base = byName.get(baseName)!;
              const [bx, by] = project(base.lon, base.lat);
              const [x, y] = project(s.lon, s.lat);
              return (
                <line
                  key={`branch-${s.n}-${baseName}`}
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
            }),
          )}
          {/* Verbindungslinie zum Label von Chamarel */}
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

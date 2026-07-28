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

// Stationen in Reisereihenfolge: ab Orlando im Uhrzeigersinn die Ostküste
// hinunter (Kennedy Space Center, Cocoa Beach, West Palm Beach, Miami), über
// die Keys bis Key West, zurück durch die Everglades und die Golfküste hinauf
// (Naples, Fort Myers, Sarasota, St. Pete Beach) und wieder nach Orlando.
// Ostküsten-Stationen beschriften nach rechts, Golfküste nach links.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Orlando", note: "Start & Ziel", highlight: "Ankunft · Universal · Abschied", lon: -81.38, lat: 28.54, lx: 128, ly: 108, anchor: "middle" },
    { n: 2, name: "Kennedy SC", note: "Raketen", highlight: "Kennedy Space Center · Saturn V", lon: -80.65, lat: 28.57, lx: 250, ly: 118, anchor: "start" },
    { n: 3, name: "Cocoa Beach", note: "1 Nacht", highlight: "Line Dancing · Ron Jon Surf Shop", lon: -80.61, lat: 28.30, lx: 250, ly: 156, anchor: "start" },
    { n: 4, name: "West Palm Beach", note: "Attentat", highlight: "Mar-a-Lago · Attentatsversuch", lon: -80.05, lat: 26.71, lx: 250, ly: 232, anchor: "start" },
    { n: 5, name: "Miami", note: "2 Nächte", highlight: "Ocean Drive · Miami Beach", lon: -80.19, lat: 25.79, lx: 250, ly: 294, anchor: "start" },
    { n: 6, name: "Key Largo", note: "Keys", highlight: "Ankunft Keys · Schnorcheln", lon: -80.43, lat: 25.10, lx: 250, ly: 344, anchor: "start" },
    { n: 7, name: "Key West", note: "südlichster Punkt", highlight: "Southernmost Point · Overseas Highway", lon: -81.78, lat: 24.55, lx: 106, ly: 400, anchor: "middle" },
    { n: 8, name: "Everglades", note: "Airboat", highlight: "Airboat-Tour · Alligatoren", lon: -80.90, lat: 25.85, lx: 178, ly: 270, anchor: "start" },
    { n: 9, name: "Naples", note: "1 Nacht", highlight: "La Quinta · White Beach", lon: -81.79, lat: 26.14, lx: 40, ly: 290, anchor: "end" },
    { n: 10, name: "Fort Myers", note: "1 Nacht", highlight: "Pool & Deutsche getroffen", lon: -81.87, lat: 26.64, lx: 40, ly: 252, anchor: "end" },
    { n: 11, name: "Sarasota", note: "Manatees", highlight: "Manatee-Suche · Siesta Beach", lon: -82.53, lat: 27.34, lx: 40, ly: 212, anchor: "end" },
    { n: 12, name: "St. Pete Beach", note: "Helene", highlight: "Hurrikan Helene · Planänderung", lon: -82.74, lat: 27.73, lx: 40, ly: 172, anchor: "end" },
  ],
  en: [
    { n: 1, name: "Orlando", note: "start & finish", highlight: "Arrival · Universal · farewell", lon: -81.38, lat: 28.54, lx: 128, ly: 108, anchor: "middle" },
    { n: 2, name: "Kennedy SC", note: "rockets", highlight: "Kennedy Space Center · Saturn V", lon: -80.65, lat: 28.57, lx: 250, ly: 118, anchor: "start" },
    { n: 3, name: "Cocoa Beach", note: "1 night", highlight: "Line dancing · Ron Jon Surf Shop", lon: -80.61, lat: 28.30, lx: 250, ly: 156, anchor: "start" },
    { n: 4, name: "West Palm Beach", note: "assassination", highlight: "Mar-a-Lago · assassination attempt", lon: -80.05, lat: 26.71, lx: 250, ly: 232, anchor: "start" },
    { n: 5, name: "Miami", note: "2 nights", highlight: "Ocean Drive · Miami Beach", lon: -80.19, lat: 25.79, lx: 250, ly: 294, anchor: "start" },
    { n: 6, name: "Key Largo", note: "Keys", highlight: "Arrival Keys · snorkelling", lon: -80.43, lat: 25.10, lx: 250, ly: 344, anchor: "start" },
    { n: 7, name: "Key West", note: "southernmost point", highlight: "Southernmost Point · Overseas Highway", lon: -81.78, lat: 24.55, lx: 106, ly: 400, anchor: "middle" },
    { n: 8, name: "Everglades", note: "airboat", highlight: "Airboat tour · alligators", lon: -80.90, lat: 25.85, lx: 178, ly: 270, anchor: "start" },
    { n: 9, name: "Naples", note: "1 night", highlight: "La Quinta · White Beach", lon: -81.79, lat: 26.14, lx: 40, ly: 290, anchor: "end" },
    { n: 10, name: "Fort Myers", note: "1 night", highlight: "Pool & met Germans", lon: -81.87, lat: 26.64, lx: 40, ly: 252, anchor: "end" },
    { n: 11, name: "Sarasota", note: "manatees", highlight: "Manatee search · Siesta Beach", lon: -82.53, lat: 27.34, lx: 40, ly: 212, anchor: "end" },
    { n: 12, name: "St. Pete Beach", note: "Helene", highlight: "Hurricane Helene · change of plans", lon: -82.74, lat: 27.73, lx: 40, ly: 172, anchor: "end" },
  ],
};

// Zielüberschrift je Station (Titel der ## -Überschrift im Beitrag). Der
// englische Beitrag ist noch ein Platzhalter ohne passende Abschnitte und
// bindet die Karte nicht ein, daher bleibt `en` leer.
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Ankunft in Orlando",
    2: "Kennedy Space Center",
    3: "Cocoa Beach und die Hurricane Greek Bar",
    4: "West Palm Beach und ein Attentatsversuch",
    5: "Miami",
    6: "Ankunft auf den Florida Keys",
    7: "Key West",
    8: "Airboat-Tour durch die Everglades",
    9: "Weiter an die Westküste",
    10: "Weiter an die Westküste",
    11: "Auf der Suche nach Manatees",
    12: "St. Petersburg im Ausnahmezustand",
  },
  en: {},
};

const captions: Record<Lang, string> = {
  de: "Im Uhrzeigersinn ab Orlando: die Ostküste hinab über Kennedy Space Center, Miami und die Keys bis Key West, dann die Golfküste hinauf und zurück nach Orlando · Zahl = Reihenfolge der Stationen · rund 1.900 km / 14 Tage",
  en: "Clockwise from Orlando: down the east coast via Kennedy Space Center, Miami and the Keys to Key West, then up the Gulf coast and back to Orlando · number = order of stops · about 1,900 km / 14 days",
};

// Stilisierter, aber erkennbarer Umriss der Florida-Halbinsel (lon, lat),
// im Uhrzeigersinn: Ostküste von Jacksonville hinab, um die Keys herum und
// die Golfküste über Tampa Bay und den Big Bend zurück in den Norden.
const outline: [number, number][] = [
  // Ostküste, Nord → Süd
  [-81.5, 30.75],
  [-80.9, 29.5],
  [-80.55, 28.8],
  [-80.4, 28.5],
  [-80.1, 27.3],
  [-80.03, 26.7],
  [-80.12, 25.85],
  // Südküste rund um die Florida Bay, Ost → West (die Keys sind eine eigene
  // Inselkette und gehören nicht zum Festlandumriss)
  [-80.30, 25.52],
  [-80.42, 25.32],
  [-80.55, 25.22],
  [-80.88, 25.18],
  [-81.12, 25.15],
  // Golfküste, Süd → Nord
  [-81.7, 25.85],
  [-81.95, 26.45],
  [-82.25, 26.95],
  [-82.85, 27.7],
  [-82.65, 28.2],
  [-82.75, 28.9],
  [-83.3, 29.5],
  [-83.6, 29.9],
  [-82.9, 30.4],
  [-82.2, 30.55],
];

const MIN_LON = -83.6;
const MAX_LAT = 31.0;
const PX_PER_DEG = 58;

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

// Die Florida Keys als eigene, dünne Inselkette entlang des Overseas Highway
// von Key Largo (Station 6) bis Key West (Station 7) – als schmales Band
// gezeichnet, damit die Kette klar vom Festland getrennt ist.
const keys: [number, number][] = [
  [-80.33, 25.28],
  [-80.45, 25.10], // Key Largo (Station 6)
  [-80.63, 24.92],
  [-80.9, 24.78],
  [-81.1, 24.71], // Marathon
  [-81.4, 24.66],
  [-81.62, 24.6],
  [-81.8, 24.55], // Key West (Station 7)
];

const keysPath = keys
  .map(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  })
  .join(" ");

export function FloridaRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];

  // Route in Reisereihenfolge: Ostküste 1 → 5, dann über die Keys-Inselkette
  // nach Key West (7), dieselbe Kette zurück aufs Festland und weiter zu den
  // Everglades (8) und die Golfküste hinauf (9 → 12), zum Schluss zurück nach
  // Orlando (Z).
  const at = (n: number) => stops.find((s) => s.n === n)!;
  const routeCoords: [number, number][] = [
    [at(1).lon, at(1).lat],
    [at(2).lon, at(2).lat],
    [at(3).lon, at(3).lat],
    [at(4).lon, at(4).lat],
    [at(5).lon, at(5).lat],
    ...keys, // Key Largo (6) über die Inseln bis Key West (7)
    ...keys.slice(0, -1).reverse(), // Key West zurück Richtung Festland
    [at(8).lon, at(8).lat],
    [at(9).lon, at(9).lat],
    [at(10).lon, at(10).lat],
    [at(11).lon, at(11).lat],
    [at(12).lon, at(12).lat],
  ];
  const routePath =
    routeCoords
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-110 5 535 415"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of the 14-day Florida road trip with all stops"
              : "Karte des 14-tägigen Florida-Roadtrips mit allen Stationen"
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
          {/* Florida Keys – eigene Inselkette (Overseas Highway) */}
          <path
            d={keysPath}
            fill="none"
            className="stroke-border"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={keysPath}
            fill="none"
            className="stroke-accent-soft"
            strokeWidth={6}
            strokeLinecap="round"
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

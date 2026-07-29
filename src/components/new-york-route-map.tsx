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

// New York war keine Rundreise, sondern eine einzelne Stadt. Deshalb zeichnet
// diese Karte keine verbundene Route, sondern nur die einzelnen Stopps des
// Berichts als nummerierte Marker – nummeriert in der Reihenfolge, in der sie
// im Reisebericht (nach Tagen) vorkommen. Ostseitige/nördliche Stopps werden
// nach rechts beschriftet, westseitige/südliche nach links. Einige Koordinaten
// im dichten Midtown sind leicht entzerrt, damit die Marker lesbar bleiben.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Central Park", note: "täglich", highlight: "Fahrradtour & tägliche Spaziergänge", lon: -73.9657, lat: 40.7825, lx: 205, ly: 46, anchor: "start" },
    { n: 2, name: "Times Square", note: "Neonlichter", highlight: "Riesenbildschirme & Neonlichter", lon: -73.9888, lat: 40.757, lx: -6, ly: 96, anchor: "end" },
    { n: 3, name: "Grand Central", note: "Gossip Girl", highlight: "Grand Central Terminal · Gossip-Girl-Szene", lon: -73.9729, lat: 40.753, lx: 205, ly: 140, anchor: "start" },
    { n: 4, name: "Empire State", note: "Wahrzeichen", highlight: "Empire State & Flatiron Building", lon: -73.9822, lat: 40.744, lx: 205, ly: 166, anchor: "start" },
    { n: 5, name: "Top of the Rock", note: "Aussicht", highlight: "Top of the Rock · anderthalb Stunden Aussicht", lon: -73.9756, lat: 40.762, lx: 205, ly: 116, anchor: "start" },
    { n: 6, name: "Staten Island Ferry", note: "gratis", highlight: "Kostenlose Fähre · Blick auf Lady Liberty", lon: -74.0139, lat: 40.701, lx: -6, ly: 262, anchor: "end" },
    { n: 7, name: "Freiheitsstatue", note: "Lady Liberty", highlight: "Die kleine Lady Liberty von der Fähre aus", lon: -74.0445, lat: 40.6892, lx: -6, ly: 286, anchor: "end" },
    { n: 8, name: "Chinatown", note: "Little Italy", highlight: "Chinatown & Little Italy · Nudeln", lon: -73.9965, lat: 40.717, lx: -6, ly: 198, anchor: "end" },
    { n: 9, name: "Broadway", note: "Harry Potter", highlight: "Harry Potter im Theater am Broadway", lon: -73.9914, lat: 40.749, lx: -6, ly: 122, anchor: "end" },
    { n: 10, name: "Metropolitan Museum", note: "Frühstück", highlight: "Frühstück auf den Stufen des Met", lon: -73.9597, lat: 40.775, lx: 205, ly: 90, anchor: "start" },
    { n: 11, name: "Greenwich Village", note: "Friends", highlight: "Friends- & Sex-and-the-City-Häuser", lon: -73.9973, lat: 40.7308, lx: -6, ly: 172, anchor: "end" },
    { n: 12, name: "Brooklyn Bridge", note: "zu Fuß", highlight: "Zu Fuß über die Brooklyn Bridge", lon: -73.9969, lat: 40.7061, lx: -6, ly: 240, anchor: "end" },
    { n: 13, name: "Botanic Garden", note: "Kirschblüte", highlight: "Blühende Kirschbäume im Brooklyn Botanic Garden", lon: -73.963, lat: 40.668, lx: 205, ly: 292, anchor: "start" },
    { n: 14, name: "9/11 Memorial", note: "Twin Towers", highlight: "9/11 Memorial an der Stelle der Twin Towers", lon: -74.0125, lat: 40.7115, lx: -6, ly: 218, anchor: "end" },
    { n: 15, name: "High Line", note: "Hochbahn", highlight: "High Line auf der alten Hochbahntrasse", lon: -74.0072, lat: 40.744, lx: -6, ly: 146, anchor: "end" },
    { n: 16, name: "Naturkundemuseum", note: "Dinos", highlight: "Dinosaurier & „Nachts im Museum“", lon: -73.9756, lat: 40.78, lx: 205, ly: 68, anchor: "start" },
  ],
  en: [
    { n: 1, name: "Central Park", note: "daily", highlight: "Bike ride & daily strolls", lon: -73.9657, lat: 40.7825, lx: 205, ly: 46, anchor: "start" },
    { n: 2, name: "Times Square", note: "neon lights", highlight: "Giant screens & neon lights", lon: -73.9888, lat: 40.757, lx: -6, ly: 96, anchor: "end" },
    { n: 3, name: "Grand Central", note: "Gossip Girl", highlight: "Grand Central Terminal · Gossip Girl scene", lon: -73.9729, lat: 40.753, lx: 205, ly: 140, anchor: "start" },
    { n: 4, name: "Empire State", note: "landmark", highlight: "Empire State & Flatiron Building", lon: -73.9822, lat: 40.744, lx: 205, ly: 166, anchor: "start" },
    { n: 5, name: "Top of the Rock", note: "the view", highlight: "Top of the Rock · an hour and a half of views", lon: -73.9756, lat: 40.762, lx: 205, ly: 116, anchor: "start" },
    { n: 6, name: "Staten Island Ferry", note: "free", highlight: "Free ferry · view of Lady Liberty", lon: -74.0139, lat: 40.701, lx: -6, ly: 262, anchor: "end" },
    { n: 7, name: "Statue of Liberty", note: "Lady Liberty", highlight: "The little Lady Liberty from the ferry", lon: -74.0445, lat: 40.6892, lx: -6, ly: 286, anchor: "end" },
    { n: 8, name: "Chinatown", note: "Little Italy", highlight: "Chinatown & Little Italy · noodles", lon: -73.9965, lat: 40.717, lx: -6, ly: 198, anchor: "end" },
    { n: 9, name: "Broadway", note: "Harry Potter", highlight: "Harry Potter at the theatre on Broadway", lon: -73.9914, lat: 40.749, lx: -6, ly: 122, anchor: "end" },
    { n: 10, name: "Metropolitan Museum", note: "breakfast", highlight: "Breakfast on the steps of the Met", lon: -73.9597, lat: 40.775, lx: 205, ly: 90, anchor: "start" },
    { n: 11, name: "Greenwich Village", note: "Friends", highlight: "Friends & Sex and the City houses", lon: -73.9973, lat: 40.7308, lx: -6, ly: 172, anchor: "end" },
    { n: 12, name: "Brooklyn Bridge", note: "on foot", highlight: "Crossing the Brooklyn Bridge on foot", lon: -73.9969, lat: 40.7061, lx: -6, ly: 240, anchor: "end" },
    { n: 13, name: "Botanic Garden", note: "cherry blossom", highlight: "Cherry blossom at the Brooklyn Botanic Garden", lon: -73.963, lat: 40.668, lx: 205, ly: 292, anchor: "start" },
    { n: 14, name: "9/11 Memorial", note: "Twin Towers", highlight: "9/11 Memorial where the Twin Towers stood", lon: -74.0125, lat: 40.7115, lx: -6, ly: 218, anchor: "end" },
    { n: 15, name: "High Line", note: "elevated rail", highlight: "High Line on the old elevated railway", lon: -74.0072, lat: 40.744, lx: -6, ly: 146, anchor: "end" },
    { n: 16, name: "Natural History Museum", note: "dinosaurs", highlight: "Dinosaurs & “Night at the Museum”", lon: -73.9756, lat: 40.78, lx: 205, ly: 68, anchor: "start" },
  ],
};

// Zielüberschrift je Stopp (Titel der ## -Überschrift im Beitrag, in beiden
// Sprachen vorhanden). Ein Klick auf den Marker springt zum Tag, an dem der
// Stopp beschrieben wird.
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Central Park, Times Square & mittendrin in einer Serie",
    2: "Central Park, Times Square & mittendrin in einer Serie",
    3: "Central Park, Times Square & mittendrin in einer Serie",
    4: "Central Park, Times Square & mittendrin in einer Serie",
    5: "Top of the Rock & die kleine Lady Liberty",
    6: "Top of the Rock & die kleine Lady Liberty",
    7: "Top of the Rock & die kleine Lady Liberty",
    8: "Chinatown, Central Park per Rad & Harry Potter im Theater",
    9: "Chinatown, Central Park per Rad & Harry Potter im Theater",
    10: "Ein Tag zum Treibenlassen",
    11: "Ein Tag zum Treibenlassen",
    12: "Brooklyn und die Klassenunterschiede",
    13: "Brooklyn und die Klassenunterschiede",
    14: "9/11-Museum, Wall Street & Rooftop mit Aussicht",
    15: "Naturkundemuseum, High Line & letzte Erledigungen",
    16: "Naturkundemuseum, High Line & letzte Erledigungen",
  },
  en: {
    1: "Central Park, Times Square & right inside a TV series",
    2: "Central Park, Times Square & right inside a TV series",
    3: "Central Park, Times Square & right inside a TV series",
    4: "Central Park, Times Square & right inside a TV series",
    5: "Top of the Rock & the little Lady Liberty",
    6: "Top of the Rock & the little Lady Liberty",
    7: "Top of the Rock & the little Lady Liberty",
    8: "Chinatown, Central Park by bike & Harry Potter at the theatre",
    9: "Chinatown, Central Park by bike & Harry Potter at the theatre",
    10: "A day to just drift",
    11: "A day to just drift",
    12: "Brooklyn and the class divide",
    13: "Brooklyn and the class divide",
    14: "9/11 Museum, Wall Street & a rooftop with a view",
    15: "Natural History Museum, the High Line & final errands",
    16: "Natural History Museum, the High Line & final errands",
  },
};

const captions: Record<Lang, string> = {
  de: "Keine Rundreise, sondern eine Stadt – die Karte zeigt die wichtigsten Stopps des Berichts in Manhattan, Brooklyn und im Hafen · Zahl = Reihenfolge im Reisebericht · Klick auf einen Marker führt zur passenden Textstelle",
  en: "Not a round trip but a single city – the map shows the trip’s main stops across Manhattan, Brooklyn and the harbour · number = order in the report · tap a marker to jump to the matching section",
};

const MIN_LON = -74.06;
const MAX_LAT = 40.815;
const PX_PER_DEG = 2000;
// Längengrade sind auf New Yorks Breite stark gestaucht (cos 40,73° ≈ 0,758),
// damit Manhattan nicht in die Breite gezogen wirkt.
const LON_SCALE = 0.758;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG * LON_SCALE, (MAX_LAT - lat) * PX_PER_DEG];
}

// Stilisierter Umriss von Manhattan (lon, lat), im Uhrzeigersinn vom oberen
// Rand über die Ostseite (East River) hinab bis zur Battery und die Westseite
// (Hudson) wieder hinauf. Über dem Central Park abgeschnitten.
const manhattan: [number, number][] = [
  [-73.968, 40.808],
  [-73.933, 40.8],
  [-73.935, 40.782],
  [-73.943, 40.775],
  [-73.958, 40.762],
  [-73.968, 40.752],
  [-73.972, 40.74],
  [-73.973, 40.73],
  [-73.978, 40.718],
  [-73.997, 40.709],
  [-74.01, 40.703],
  [-74.016, 40.701],
  [-74.017, 40.706],
  [-74.013, 40.714],
  [-74.011, 40.722],
  [-74.009, 40.735],
  [-74.008, 40.745],
  [-74.005, 40.755],
  [-73.998, 40.766],
  [-73.99, 40.776],
  [-73.982, 40.786],
  [-73.975, 40.797],
];

// Brooklyn als eigene Landmasse im Südosten, jenseits des East River.
const brooklyn: [number, number][] = [
  [-74.01, 40.698],
  [-73.985, 40.7],
  [-73.958, 40.696],
  [-73.935, 40.686],
  [-73.918, 40.672],
  [-73.918, 40.66],
  [-73.945, 40.658],
  [-73.985, 40.66],
  [-74.012, 40.668],
  [-74.02, 40.682],
];

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

const manhattanPath = toPath(manhattan);
const brooklynPath = toPath(brooklyn);
const [libertyX, libertyY] = project(-74.0445, 40.6892);
const [brooklynLabelX, brooklynLabelY] = project(-74.0, 40.664);

export function NewYorkRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-200 6 650 320"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of New York with the trip’s main stops across Manhattan, Brooklyn and the harbour"
              : "Karte von New York mit den wichtigsten Stopps des Trips in Manhattan, Brooklyn und im Hafen"
          }
          className="h-auto w-full max-w-[640px]"
        >
          {/* Landflächen */}
          <path
            d={manhattanPath}
            className="fill-accent-soft stroke-border"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path
            d={brooklynPath}
            className="fill-accent-soft stroke-border"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* Liberty Island als kleine Landmarke im Hafen */}
          <circle
            cx={libertyX}
            cy={libertyY}
            r={5}
            className="fill-accent-soft stroke-border"
            strokeWidth={1.5}
          />
          {/* Stadtteil-Beschriftung */}
          <text
            x={brooklynLabelX}
            y={brooklynLabelY}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted"
            fontSize={12}
            fontWeight={600}
            opacity={0.7}
          >
            Brooklyn
          </text>
          {/* Verbindungslinien zu den Labels */}
          {stops.map((s) => {
            const [x, y] = project(s.lon, s.lat);
            const endX = s.anchor === "start" ? s.lx - 4 : s.lx + 4;
            return (
              <line
                key={`leader-${s.n}`}
                x1={x}
                y1={y}
                x2={endX}
                y2={s.ly}
                className="stroke-muted"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
          {/* Beschriftung: Name + kurzes Stichwort in Klammern */}
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

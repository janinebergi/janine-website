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

// Rom war wie New York keine Rundreise, sondern eine Stadt. Die Karte zeigt
// deshalb keine verbundene Route, sondern jeden Tipp aus dem Beitrag als
// eigenen Marker – nummeriert in der Reihenfolge, in der er im Reisebericht
// vorkommt. Stopps westlich des Tibers werden nach links beschriftet, östliche
// nach rechts. Im dichten Trastevere und rund um den Piazza Navona liegen
// mehrere Tipps nur wenige Meter auseinander; ihre Koordinaten sind leicht
// entzerrt, damit sich die Marker nicht überdecken.
const stopsByLang: Record<Lang, Stop[]> = {
  de: [
    { n: 1, name: "Trastevere", note: "unser Viertel", highlight: "Unsere Unterkunft mitten im Szeneviertel", lon: 12.4676, lat: 41.8902, lx: -10, ly: 220, anchor: "end" },
    { n: 2, name: "Kolosseum", note: "Tickets vorab", highlight: "Kolosseum · Tickets für einen späteren Zeitslot", lon: 12.4922, lat: 41.8902, lx: 420, ly: 286, anchor: "start" },
    { n: 3, name: "Via del Cardello", note: "Geheimspot", highlight: "Versteckter Blick auf das Kolosseum", lon: 12.4905, lat: 41.8938, lx: 420, ly: 262, anchor: "start" },
    { n: 4, name: "Pasta e Vino", note: "Ravioli", highlight: "Die besten selbst gemachten Ravioli", lon: 12.4646, lat: 41.8873, lx: -10, ly: 292, anchor: "end" },
    { n: 5, name: "Piazza Navona", note: "Zentrum", highlight: "Piazza Navona im Centro Storico", lon: 12.4725, lat: 41.8991, lx: 420, ly: 166, anchor: "start" },
    { n: 6, name: "Pantheon", note: "gleich nebenan", highlight: "Das Pantheon liegt nur ein paar Schritte weiter", lon: 12.4773, lat: 41.8984, lx: 420, ly: 190, anchor: "start" },
    { n: 7, name: "Trevi-Brunnen", note: "früh hin", highlight: "Um halb 10 schon unfassbar voll", lon: 12.4833, lat: 41.9009, lx: 420, ly: 118, anchor: "start" },
    { n: 8, name: "Spanische Treppe", note: "Maronen", highlight: "Heiße Maronen mit Blick über Rom", lon: 12.4823, lat: 41.9058, lx: 420, ly: 70, anchor: "start" },
    { n: 9, name: "Castel Sant'Angelo", note: "am Weg", highlight: "Castel Sant'Angelo auf dem Weg nach Prati", lon: 12.4663, lat: 41.9031, lx: -10, ly: 108, anchor: "end" },
    { n: 10, name: "Prati", note: "gehoben", highlight: "Prati · gehobenes Viertel am Westufer", lon: 12.465, lat: 41.909, lx: -10, ly: 60, anchor: "end" },
    { n: 11, name: "Villa Doria Pamphilj", note: "Park", highlight: "Orangenbäume und Ruhe über der Stadt", lon: 12.4459, lat: 41.8795, lx: -10, ly: 344, anchor: "end" },
    { n: 12, name: "Trapizzino", note: "Streetfood", highlight: "Trapizzino · italienisches Streetfood", lon: 12.4716, lat: 41.8907, lx: -10, ly: 196, anchor: "end" },
    { n: 13, name: "Bar San Calisto", note: "günstig", highlight: "Günstige Drinks to go und immer was los", lon: 12.4686, lat: 41.8869, lx: -10, ly: 316, anchor: "end" },
    { n: 14, name: "Bar Santa Maria", note: "Rotwein", highlight: "Rotwein mit Oliven, Chips und Erdnüssen", lon: 12.4715, lat: 41.8884, lx: -10, ly: 268, anchor: "end" },
    { n: 15, name: "Two Sizes", note: "Tiramisu", highlight: "Tiramisu zum Frühstück in der Sonne", lon: 12.4677, lat: 41.9004, lx: 420, ly: 142, anchor: "start" },
    { n: 16, name: "Chiostro del Bramante", note: "Espresso 2 €", highlight: "Espresso für 2 € mit Blick in den Innenhof", lon: 12.4686, lat: 41.8977, lx: 420, ly: 214, anchor: "start" },
    { n: 17, name: "Terrazza Borromini", note: "Aussicht", highlight: "Dachterrasse mit Blick über ganz Rom", lon: 12.4719, lat: 41.9018, lx: 420, ly: 94, anchor: "start" },
    { n: 18, name: "Vittoriano", note: "Denkmal", highlight: "Vom Vittoriano noch einmal aufs Kolosseum", lon: 12.4831, lat: 41.8947, lx: 420, ly: 238, anchor: "start" },
    { n: 19, name: "Tonnarello", note: "letzter Abend", highlight: "Selbst gemachte Pasta am letzten Abend", lon: 12.4651, lat: 41.8898, lx: -10, ly: 244, anchor: "end" },
    { n: 20, name: "Petersdom", note: "Kuppel", highlight: "Die Kuppel des Petersdoms im Nebel", lon: 12.4539, lat: 41.9022, lx: -10, ly: 136, anchor: "end" },
  ],
  en: [
    { n: 1, name: "Trastevere", note: "our quarter", highlight: "Our place right in the middle of the quarter", lon: 12.4676, lat: 41.8902, lx: -10, ly: 220, anchor: "end" },
    { n: 2, name: "Colosseum", note: "book ahead", highlight: "Colosseum · tickets for a later time slot", lon: 12.4922, lat: 41.8902, lx: 420, ly: 286, anchor: "start" },
    { n: 3, name: "Via del Cardello", note: "secret spot", highlight: "The hidden view of the Colosseum", lon: 12.4905, lat: 41.8938, lx: 420, ly: 262, anchor: "start" },
    { n: 4, name: "Pasta e Vino", note: "ravioli", highlight: "The best homemade ravioli", lon: 12.4646, lat: 41.8873, lx: -10, ly: 292, anchor: "end" },
    { n: 5, name: "Piazza Navona", note: "the centre", highlight: "Piazza Navona in the Centro Storico", lon: 12.4725, lat: 41.8991, lx: 420, ly: 166, anchor: "start" },
    { n: 6, name: "Pantheon", note: "right nearby", highlight: "The Pantheon is only a few steps further", lon: 12.4773, lat: 41.8984, lx: 420, ly: 190, anchor: "start" },
    { n: 7, name: "Trevi Fountain", note: "go early", highlight: "Already packed at half past nine", lon: 12.4833, lat: 41.9009, lx: 420, ly: 118, anchor: "start" },
    { n: 8, name: "Spanish Steps", note: "chestnuts", highlight: "Hot chestnuts with a view over Rome", lon: 12.4823, lat: 41.9058, lx: 420, ly: 70, anchor: "start" },
    { n: 9, name: "Castel Sant'Angelo", note: "on the way", highlight: "Castel Sant'Angelo on the walk to Prati", lon: 12.4663, lat: 41.9031, lx: -10, ly: 108, anchor: "end" },
    { n: 10, name: "Prati", note: "upmarket", highlight: "Prati · upmarket quarter on the west bank", lon: 12.465, lat: 41.909, lx: -10, ly: 60, anchor: "end" },
    { n: 11, name: "Villa Doria Pamphilj", note: "park", highlight: "Orange trees and quiet above the city", lon: 12.4459, lat: 41.8795, lx: -10, ly: 344, anchor: "end" },
    { n: 12, name: "Trapizzino", note: "street food", highlight: "Trapizzino · Italian street food", lon: 12.4716, lat: 41.8907, lx: -10, ly: 196, anchor: "end" },
    { n: 13, name: "Bar San Calisto", note: "cheap", highlight: "Cheap drinks to go and always something going on", lon: 12.4686, lat: 41.8869, lx: -10, ly: 316, anchor: "end" },
    { n: 14, name: "Bar Santa Maria", note: "red wine", highlight: "Red wine with olives, crisps and peanuts", lon: 12.4715, lat: 41.8884, lx: -10, ly: 268, anchor: "end" },
    { n: 15, name: "Two Sizes", note: "tiramisu", highlight: "Tiramisu for breakfast in the sun", lon: 12.4677, lat: 41.9004, lx: 420, ly: 142, anchor: "start" },
    { n: 16, name: "Chiostro del Bramante", note: "€2 espresso", highlight: "A €2 espresso with a view of the courtyard", lon: 12.4686, lat: 41.8977, lx: 420, ly: 214, anchor: "start" },
    { n: 17, name: "Terrazza Borromini", note: "the view", highlight: "Roof terrace with a view over all of Rome", lon: 12.4719, lat: 41.9018, lx: 420, ly: 94, anchor: "start" },
    { n: 18, name: "Vittoriano", note: "monument", highlight: "The Colosseum once more from the Vittoriano", lon: 12.4831, lat: 41.8947, lx: 420, ly: 238, anchor: "start" },
    { n: 19, name: "Tonnarello", note: "last evening", highlight: "Homemade pasta on the last evening", lon: 12.4651, lat: 41.8898, lx: -10, ly: 244, anchor: "end" },
    { n: 20, name: "St Peter's Basilica", note: "the dome", highlight: "The dome of St Peter's in the fog", lon: 12.4539, lat: 41.9022, lx: -10, ly: 136, anchor: "end" },
  ],
};

// Zielüberschrift je Stopp (Titel der ##-Überschrift im Beitrag, in beiden
// Sprachen vorhanden). Ein Klick auf den Marker springt zu der Stelle, an der
// der Tipp beschrieben wird.
const sectionsByLang: Record<Lang, Record<number, string>> = {
  de: {
    1: "Ankunft in Trastevere und ein eiskalter Start",
    2: "Kolosseum: Gladiatoren, Menschenmassen und ein Geheimspot",
    3: "Kolosseum: Gladiatoren, Menschenmassen und ein Geheimspot",
    4: "Die besten Ravioli hatte Christine",
    5: "Centro Storico: Navona, Pantheon, Trevi-Brunnen und Spanische Treppe",
    6: "Centro Storico: Navona, Pantheon, Trevi-Brunnen und Spanische Treppe",
    7: "Centro Storico: Navona, Pantheon, Trevi-Brunnen und Spanische Treppe",
    8: "Centro Storico: Navona, Pantheon, Trevi-Brunnen und Spanische Treppe",
    9: "Über den Tiber nach Prati und hinauf zur Villa Doria Pamphilj",
    10: "Über den Tiber nach Prati und hinauf zur Villa Doria Pamphilj",
    11: "Über den Tiber nach Prati und hinauf zur Villa Doria Pamphilj",
    12: "Streetfood und Barhopping in Trastevere",
    13: "Streetfood und Barhopping in Trastevere",
    14: "Streetfood und Barhopping in Trastevere",
    15: "Tag der Geheimtipps: Tiramisu, Innenhof und Dachterrasse",
    16: "Tag der Geheimtipps: Tiramisu, Innenhof und Dachterrasse",
    17: "Tag der Geheimtipps: Tiramisu, Innenhof und Dachterrasse",
    18: "Tag der Geheimtipps: Tiramisu, Innenhof und Dachterrasse",
    19: "Der letzte Abend bei Tonnarello",
    20: "Früh aufstehen für die Kuppel des Petersdoms",
  },
  en: {
    1: "Arriving in Trastevere and an ice-cold start",
    2: "The Colosseum: gladiators, crowds and a secret spot",
    3: "The Colosseum: gladiators, crowds and a secret spot",
    4: "Christine had the better ravioli",
    5: "Centro Storico: Navona, the Pantheon, the Trevi Fountain and the Spanish Steps",
    6: "Centro Storico: Navona, the Pantheon, the Trevi Fountain and the Spanish Steps",
    7: "Centro Storico: Navona, the Pantheon, the Trevi Fountain and the Spanish Steps",
    8: "Centro Storico: Navona, the Pantheon, the Trevi Fountain and the Spanish Steps",
    9: "Across the Tiber to Prati and up to the Villa Doria Pamphilj",
    10: "Across the Tiber to Prati and up to the Villa Doria Pamphilj",
    11: "Across the Tiber to Prati and up to the Villa Doria Pamphilj",
    12: "Street food and bar hopping in Trastevere",
    13: "Street food and bar hopping in Trastevere",
    14: "Street food and bar hopping in Trastevere",
    15: "A day of secret tips: tiramisu, a courtyard and a roof terrace",
    16: "A day of secret tips: tiramisu, a courtyard and a roof terrace",
    17: "A day of secret tips: tiramisu, a courtyard and a roof terrace",
    18: "A day of secret tips: tiramisu, a courtyard and a roof terrace",
    19: "The last evening at Tonnarello",
    20: "Up early for the dome of St Peter's",
  },
};

const captions: Record<Lang, string> = {
  de: "Keine Rundreise, sondern eine Stadt – die Karte zeigt alle Tipps aus dem Beitrag: Viertel, Sehenswürdigkeiten, Restaurants und Bars · Zahl = Reihenfolge im Reisebericht · Klick auf einen Marker führt zur passenden Textstelle · schematische Darstellung, im dichten Trastevere und rund um den Piazza Navona sind die Punkte leicht auseinandergezogen",
  en: "Not a round trip but a single city – the map shows every tip from the report: quarters, sights, restaurants and bars · number = order in the report · tap a marker to jump to the matching section · schematic drawing; in dense Trastevere and around Piazza Navona the dots are spread out slightly",
};

const MIN_LON = 12.434;
const MAX_LAT = 41.916;
const PX_PER_DEG = 9000;
// Auf Roms Breite sind die Längengrade gestaucht (cos 41,9° ≈ 0,744) – ohne
// diesen Faktor würde die Stadt in die Breite gezogen wirken.
const LON_SCALE = 0.744;

function project(lon: number, lat: number): [number, number] {
  return [(lon - MIN_LON) * PX_PER_DEG * LON_SCALE, (MAX_LAT - lat) * PX_PER_DEG];
}

function toPath(points: [number, number][], close = true): string {
  const path = points
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return close ? `${path} Z` : path;
}

// Stark vereinfachte Umrisse der Viertel, in denen die Tipps liegen – sie
// dienen nur der Orientierung, nicht der Katastergenauigkeit.
const areas: { label: Record<Lang, string>; points: [number, number][]; lon: number; lat: number }[] = [
  {
    label: { de: "Trastevere", en: "Trastevere" },
    points: [
      [12.462, 41.894],
      [12.47, 41.893],
      [12.4745, 41.8895],
      [12.4735, 41.8845],
      [12.466, 41.883],
      [12.46, 41.8875],
    ],
    lon: 12.466,
    lat: 41.8845,
  },
  {
    label: { de: "Prati", en: "Prati" },
    points: [
      [12.4585, 41.913],
      [12.468, 41.91],
      [12.4715, 41.906],
      [12.465, 41.901],
      [12.4585, 41.9045],
    ],
    lon: 12.46,
    lat: 41.9115,
  },
  {
    label: { de: "Vatikan", en: "Vatican" },
    points: [
      [12.4455, 41.907],
      [12.4565, 41.9055],
      [12.4585, 41.8995],
      [12.446, 41.899],
    ],
    lon: 12.4498,
    lat: 41.9058,
  },
  {
    label: { de: "Centro Storico", en: "Centro Storico" },
    points: [
      [12.468, 41.9045],
      [12.48, 41.9085],
      [12.4885, 41.9035],
      [12.4875, 41.893],
      [12.476, 41.8895],
      [12.4665, 41.896],
    ],
    lon: 12.4863,
    lat: 41.9036,
  },
];

// Park der Villa Doria Pamphilj, südwestlich über der Stadt.
const park: [number, number][] = [
  [12.438, 41.8855],
  [12.452, 41.8835],
  [12.4545, 41.8755],
  [12.4395, 41.874],
];

// Der Tiber von Norden nach Süden: an Prati vorbei, am Castel Sant'Angelo
// vorbei, dann in der großen Schleife zwischen Trastevere und dem Centro
// Storico hindurch.
const tiber: [number, number][] = [
  [12.475, 41.915],
  [12.474, 41.91],
  [12.4722, 41.9065],
  [12.47, 41.904],
  [12.4665, 41.9016],
  [12.466, 41.8985],
  [12.468, 41.8955],
  [12.4707, 41.8925],
  [12.476, 41.8905],
  [12.48, 41.889],
  [12.479, 41.886],
  [12.474, 41.8835],
  [12.4715, 41.879],
];

const parkPath = toPath(park);
const tiberPath = toPath(tiber, false);
const [tiberLabelX, tiberLabelY] = project(12.4795, 41.9127);

export function RomeRouteMap({ lang = "de" }: { lang?: Lang }) {
  const stops = stopsByLang[lang];

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex justify-center p-6 sm:p-8">
        <svg
          viewBox="-205 0 870 390"
          role="img"
          aria-label={
            lang === "en"
              ? "Map of Rome with every tip from the report: quarters, sights, restaurants and bars"
              : "Karte von Rom mit allen Tipps aus dem Beitrag: Viertel, Sehenswürdigkeiten, Restaurants und Bars"
          }
          className="h-auto w-full max-w-[720px]"
        >
          {/* Park über der Stadt */}
          <path
            d={parkPath}
            className="fill-accent-soft stroke-border"
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity={0.75}
          />
          {/* Viertel */}
          {areas.map((area) => (
            <path
              key={area.label.de}
              d={toPath(area.points)}
              className="fill-accent-soft stroke-border"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          ))}
          {/* Tiber */}
          <path
            d={tiberPath}
            fill="none"
            className="stroke-accent"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
          <text
            x={tiberLabelX}
            y={tiberLabelY}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted"
            fontSize={12}
            fontWeight={600}
            opacity={0.7}
          >
            Tiber
          </text>
          {/* Viertel-Beschriftung */}
          {areas.map((area) => {
            const [x, y] = project(area.lon, area.lat);
            return (
              <text
                key={`label-${area.label.de}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-muted"
                fontSize={12}
                fontWeight={600}
                opacity={0.7}
              >
                {area.label[lang]}
              </text>
            );
          })}
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
              key={`stop-${s.n}`}
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

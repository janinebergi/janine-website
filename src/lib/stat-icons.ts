import { Globe, CalendarDays, Compass, Sparkles, type LucideIcon } from "lucide-react";

// Ordnet einem Fakt (z. B. "Länder bereist") anhand des Labels ein
// passendes Icon zu, ohne die Datenstruktur (und damit den Admin-Editor)
// anfassen zu müssen. Wird sowohl auf der Startseite als auch auf der
// „Über mich“-Seite verwendet, damit die Fakten-Kacheln überall gleich
// aussehen.
export function iconForStat(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("länder") || l.includes("reise")) return Globe;
  if (l.includes("jahr")) return CalendarDays;
  if (l.includes("abenteuer") || l.includes("sport")) return Compass;
  return Sparkles;
}

import { notFound } from "next/navigation";

// Ohne diese Catch-all-Route zeigt Next.js für unbekannte Adressen seine
// nackte Standard-404 an: Bei zwei Root-Layouts ((de)/(en)) gibt es kein
// globales app/not-found.tsx. So landet man stattdessen auf der 404-Seite
// im Seitenlayout – der Statuscode bleibt in beiden Fällen 404.
export default function CatchAll() {
  notFound();
}

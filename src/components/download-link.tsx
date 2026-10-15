"use client";

import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

// Download-Verweis auf den Reiseführer. Einziger Grund, warum das ein
// Client-Bauteil ist: der Klick wird an Vercel Analytics gemeldet, zusammen
// mit der Stelle, von der aus er kam („startseite“, „beitrag-ende“ …). So ist
// später zu sehen, welche Platzierung tatsächlich etwas bringt.
//
// Ohne eingeschaltete Statistik passiert beim Klick einfach nichts
// Zusätzliches – der Download läuft so oder so.
export function DownloadLink({
  href,
  ort,
  className,
  children,
}: {
  href: string;
  ort: string;
  className?: string;
  children: ReactNode;
}) {
  // Zeigt der Wert nach außen (später der Shop statt der Datei), ist es ein
  // normaler Verweis in einem neuen Tab statt eines Downloads.
  const external = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      className={className}
      onClick={() => track("reisefuehrer-download", { ort })}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : { download: true })}
    >
      {children}
    </a>
  );
}

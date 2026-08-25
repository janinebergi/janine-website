"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n-constants";
import { homePath } from "@/lib/routes";

// Der Umschalter ist bewusst ein echter <Link> auf die übersetzte URL (und
// kein Cookie-Schalter mehr): Nur so findet Google die zweite Sprachfassung,
// und nur so hat jede Sprache eine eigene, indexierbare Adresse.
export function LanguageToggle({
  lang,
  langPaths,
}: {
  lang: Lang;
  // Pfad in der aktuellen Sprache -> derselbe Inhalt in der anderen Sprache
  langPaths: Record<string, string>;
}) {
  const pathname = usePathname();
  const target: Lang = lang === "en" ? "de" : "en";

  // Ohne passenden Eintrag (z. B. auf der 404-Seite) landet man auf der
  // Startseite der anderen Sprache statt im Nichts.
  const normalized = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const href = langPaths[normalized] ?? homePath(target);

  return (
    <Link
      href={href}
      hrefLang={target}
      prefetch={false}
      aria-label={target === "en" ? "Switch to English" : "Auf Deutsch umschalten"}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-foreground"
    >
      <span aria-hidden="true">{target === "en" ? "🇬🇧" : "🇩🇪"}</span>
      {target === "en" ? "EN" : "DE"}
    </Link>
  );
}

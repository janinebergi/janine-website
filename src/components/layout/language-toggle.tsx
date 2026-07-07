"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n-constants";

export function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: Lang = lang === "en" ? "de" : "en";
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  const target = lang === "en" ? "de" : "en";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={
        target === "en" ? "Switch to English" : "Auf Deutsch umschalten"
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-foreground disabled:opacity-60"
    >
      <span aria-hidden="true">{target === "en" ? "🇬🇧" : "🇩🇪"}</span>
      {target === "en" ? "EN" : "DE"}
    </button>
  );
}

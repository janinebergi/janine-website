"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { aboutPath, blogPath, contactPath, homePath } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { SiteSearch } from "@/components/layout/site-search";

// Die Navigationspfade hängen an der Sprache (/blog vs. /en/blog), die
// Labels kommen aus site.json – deshalb hier die Zuordnung über den key.
const NAV_PATH: Record<string, (lang: Lang) => string> = {
  home: homePath,
  about: aboutPath,
  blog: blogPath,
  contact: contactPath,
};

export function Header({
  lang,
  langPaths,
}: {
  lang: Lang;
  langPaths: Record<string, string>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { nav, pages, site } = getSiteContent(lang);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href={homePath(lang)}
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo.avif"
            alt={site.fullName}
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full ring-1 ring-border"
          />
          {site.fullName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const href = NAV_PATH[item.key](lang);
            const active =
              href === homePath(lang)
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={item.key}
                href={href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-semibold text-accent-hover"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SiteSearch lang={lang} labels={pages.header} />
          <Button href={contactPath(lang)} className="px-5 py-2.5">
            {pages.header.cta}
          </Button>
          <LanguageToggle lang={lang} langPaths={langPaths} />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:hidden">
          <SiteSearch
            lang={lang}
            labels={pages.header}
            onOpenChange={setSearchOpen}
            className={searchOpen ? "min-w-0 flex-1" : ""}
          />
          {!searchOpen && (
            <>
              <button
                type="button"
                aria-label={pages.header.menuAriaLabel}
                className="shrink-0 text-foreground"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
              <LanguageToggle lang={lang} langPaths={langPaths} />
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-bg md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((item) => {
              const href = NAV_PATH[item.key](lang);
              const active =
                href === homePath(lang)
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={item.key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base transition-colors ${
                    active
                      ? "font-semibold text-accent-hover"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button href={contactPath(lang)} className="mt-3">
              {pages.header.cta}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

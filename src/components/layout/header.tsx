"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { SiteSearch } from "@/components/layout/site-search";

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { nav, pages, site } = getSiteContent(lang);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo.avif"
            alt={site.name}
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full ring-1 ring-border"
          />
          {site.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "text-accent-hover"
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
          <LanguageToggle lang={lang} />
          <Button href="/kontakt" className="px-5 py-2.5">
            {pages.header.cta}
          </Button>
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
              <LanguageToggle lang={lang} />
              <button
                type="button"
                aria-label={pages.header.menuAriaLabel}
                className="shrink-0 text-foreground"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-bg md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/kontakt" className="mt-3" >
              {pages.header.cta}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

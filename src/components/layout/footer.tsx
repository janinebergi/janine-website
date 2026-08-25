import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import {
  aboutPath,
  blogPath,
  contactPath,
  feedPath,
  homePath,
  imprintPath,
  privacyPath,
} from "@/lib/routes";

const NAV_PATH: Record<string, (lang: Lang) => string> = {
  home: homePath,
  about: aboutPath,
  blog: blogPath,
  contact: contactPath,
};

export function Footer({ lang }: { lang: Lang }) {
  const { nav, pages, site } = getSiteContent(lang);
  const t = pages.footer;

  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href={homePath(lang)} className="flex items-center gap-2.5 text-base font-semibold">
              <Image
                src="/assets/logo.avif"
                alt={site.name}
                width={40}
                height={40}
                className="h-9 w-9 rounded-full ring-1 ring-border"
              />
              {site.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.role}. {site.tagline} {t.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              {t.navLabel}
            </span>
            {nav.map((item) => (
              <Link
                key={item.key}
                href={NAV_PATH[item.key](lang)}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              {t.contactLabel}
            </span>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={feedPath(lang)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              RSS
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}. {t.rights}
          </span>
          <div className="flex gap-4">
            <Link href={imprintPath(lang)} className="hover:text-foreground">
              {t.impressum}
            </Link>
            <Link href={privacyPath(lang)} className="hover:text-foreground">
              {t.datenschutz}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

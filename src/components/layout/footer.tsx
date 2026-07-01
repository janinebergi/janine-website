import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold">
              <Image
                src="/assets/logo.png"
                alt={site.name}
                width={40}
                height={40}
                className="h-9 w-9 rounded-full ring-1 ring-border"
              />
              {site.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.role}. {site.tagline} Texte, die Fernweh wecken und Reisende
              zur Buchung bewegen.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              Navigation
            </span>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              Kontakt
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
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Instagram
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              TikTok
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-foreground">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-foreground">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

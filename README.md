# Janine Bergmann — Reiseblog

Moderne Dark-Mode-Website mit Blog, gebaut mit **Next.js (App Router)**,
**TypeScript** und **Tailwind CSS v4**. Bereit für Deployment auf **Vercel**.

## Schnellstart

```bash
npm install
npm run dev      # http://localhost:3000
```

Weitere Befehle:

```bash
npm run build    # Produktions-Build
npm run start    # Produktionsserver lokal
```

> Hinweis: Node.js wurde via Homebrew installiert. Falls `node` nicht gefunden
> wird, ist `/opt/homebrew/bin` im PATH erforderlich.

## Projektstruktur

```
content/blog/            # Blogartikel als .mdx (Frontmatter + Markdown), deutsch
content/blog/en/         # dieselben Artikel auf Englisch (gleicher Dateiname)
src/content/site.json    # Alle Texte der Website (deutsch)
src/content/site.en.json # dieselben Texte auf Englisch, gleiche Struktur

src/app/(de)/            # deutsche Seiten auf der Wurzel: /, /blog,
                         #   /blog/[slug], /blog/land/[country],
                         #   /blog/thema/[topic], /ueber-mich, /kontakt,
                         #   /impressum, /datenschutz, /feed.xml
src/app/(en)/en/         # dieselben Seiten unter /en: /en/blog, /en/about,
                         #   /en/contact, /en/blog/country/…, /en/blog/topic/…
src/app/robots.ts        # robots.txt
src/app/sitemap.ts       # sitemap.xml (beide Sprachen inkl. hreflang)

src/components/pages/    # Der eigentliche Seiteninhalt – einmal geschrieben,
                         #   von beiden Sprachbäumen mit `lang` benutzt
src/components/layout/   # Header, Footer, Sprachumschalter, Suche
src/lib/routes.ts        # Alle internen Pfade (Quelle der Wahrheit)
src/lib/metadata.ts      # Title, Description, canonical, hreflang, Open Graph
src/lib/jsonld.ts        # Strukturierte Daten (schema.org)
src/lib/archives.ts      # Länder- und Themenseiten
src/lib/blog.ts          # Liest & parst die MDX-Artikel
src/app/globals.css      # Designtokens (dunkles Blau) & globale Styles
```

## Zwei Sprachen, zwei URLs

Deutsch liegt auf der Wurzel (`/blog`), Englisch unter `/en` (`/en/blog`).
Jede Seite existiert damit unter einer eigenen Adresse und verweist per
`hreflang` auf ihre Übersetzung – nur so kann Google beide Fassungen
indexieren. Die Pfade stehen **ausschließlich** in `src/lib/routes.ts`;
in Komponenten nie Pfade hart schreiben, sondern die Helfer benutzen
(`blogPath(lang)`, `postPath(lang, slug)` …).

Beide Sprachbäume rendern dieselben Komponenten aus `src/components/pages/`.
Eine neue Seite braucht deshalb drei Dateien: die Komponente plus je eine
dünne `page.tsx` in `src/app/(de)/…` und `src/app/(en)/en/…`.

## Inhalte pflegen

- **Texte / Navigation:** `src/content/site.json` (deutsch) und
  `src/content/site.en.json` (englisch). Beide Dateien müssen **dieselben Keys**
  haben — eine Änderung immer in beiden nachziehen. Die Navigation enthält nur
  noch Labels; die Pfade kommen aus `src/lib/routes.ts`.
- **Farben & Design:** `@theme`-Block in `src/app/globals.css`
- **Neuer Blogartikel:** neue Datei `content/blog/mein-artikel.mdx` mit
  Frontmatter, dazu die englische Fassung unter `content/blog/en/` mit
  demselben Dateinamen:

  ```mdx
  ---
  title: "Titel des Artikels"
  date: "2026-06-19"
  excerpt: "Kurzer Teaser für Übersicht & SEO."
  coverImage: "/assets/website/Ort/bild.avif"
  country: "Italien"
  tags: ["Reisebericht"]
  ---

  Hier der Artikeltext in Markdown/MDX …
  ```

## Bilder

Alle Beiträge nutzen lokale Bilder aus `public/assets/website/`. Neue Bilder
dort ablegen und relativ referenzieren (`/assets/website/…`).

## Deployment (Vercel)

1. Repository zu GitHub pushen.
2. Auf [vercel.com](https://vercel.com) das Repo importieren — Next.js wird
   automatisch erkannt, keine zusätzliche Konfiguration nötig.
3. Deploy. Fertig.

Umgebungsvariablen werden nicht benötigt.

### Damit Google die Seite überhaupt sieht

1. **Deployment Protection ausschalten** — Vercel → Projekt → Settings →
   Deployment Protection → *Vercel Authentication* auf **Disabled**. Solange
   sie an ist, bekommt der Googlebot nur einen Login-Redirect.
2. **Domain verbinden** — Vercel → Settings → Domains → `janinebergmann.de`
   hinzufügen und die dort angezeigten DNS-Einträge bei Strato setzen
   (A-Record `76.76.21.21`, `www` als CNAME auf `cname.vercel-dns.com`).
   `src/content/site.json` → `site.url` muss zur echten Domain passen.
3. **Search Console** — Property für `https://janinebergmann.de` anlegen und
   `https://janinebergmann.de/sitemap.xml` einreichen.

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
src/app/                 # Seiten (App Router): /, /blog, /blog/[slug],
                         #   /ueber-mich, /kontakt, /impressum, /datenschutz
src/components/          # Layout (Header/Footer), UI, Kontaktformular, MDX
src/lib/site.ts          # Lädt site.json / site.en.json je nach Sprache
src/lib/blog.ts          # Liest & parst die MDX-Artikel
src/app/globals.css      # Designtokens (dunkles Grün) & globale Styles
```

## Inhalte pflegen

- **Texte / Navigation:** `src/content/site.json` (deutsch) und
  `src/content/site.en.json` (englisch). Beide Dateien müssen **dieselben Keys**
  haben — eine Änderung immer in beiden nachziehen.
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

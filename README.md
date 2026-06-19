# Janine Bergmann — Copywriter-Website

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
content/blog/            # Blogartikel als .mdx (Frontmatter + Markdown)
src/app/                 # Seiten (App Router): /, /leistungen, /arbeiten,
                         #   /ueber-mich, /blog, /blog/[slug], /kontakt
src/components/          # Layout (Header/Footer), UI, Kontaktformular, MDX
src/lib/site.ts          # Zentrale Inhalte: Name, Navigation, Leistungen, …
src/lib/blog.ts          # Liest & parst die MDX-Artikel
src/app/globals.css      # Designtokens (dunkles Grün) & globale Styles
```

## Inhalte pflegen

- **Texte / Navigation / Leistungen:** `src/lib/site.ts`
- **Farben & Design:** `@theme`-Block in `src/app/globals.css`
- **Neuer Blogartikel:** neue Datei `content/blog/mein-artikel.mdx` mit
  Frontmatter:

  ```mdx
  ---
  title: "Titel des Artikels"
  date: "2026-06-19"
  excerpt: "Kurzer Teaser für Übersicht & SEO."
  coverImage: "https://picsum.photos/seed/mein-artikel/1200/700"
  tags: ["Copywriting"]
  ---

  Hier der Artikeltext in Markdown/MDX …
  ```

## Bilder

Aktuell Platzhalter von `picsum.photos`. Zum Austauschen die URLs in
`src/lib/site.ts`, den Seiten und den Artikel-Frontmattern ersetzen — oder
eigene Bilder unter `public/` ablegen und relativ referenzieren.

## Deployment (Vercel)

1. Repository zu GitHub pushen.
2. Auf [vercel.com](https://vercel.com) das Repo importieren — Next.js wird
   automatisch erkannt, keine zusätzliche Konfiguration nötig.
3. Deploy. Fertig.

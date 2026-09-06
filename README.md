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

### Bildausschnitt einstellen

Hoch- und Querformate werden in die Kacheln (16:10) und ins Beitragsbild (16:9)
hineingeschnitten – dabei landen Köpfe schnell außerhalb. Drei Frontmatter-Felder
steuern das:

| Feld | wirkt auf |
| --- | --- |
| `coverPosition` | Beitragsbild, und als Rückfallwert für die beiden anderen |
| `coverPositionMobile` | Beitragsbild unter 768 px |
| `coverPositionTile` | alle Vorschau-Kacheln |

Die Werte sind CSS-`object-position`, also `"center 40%"`: der erste Wert
waagerecht, der zweite senkrecht. Ein höherer Prozentwert schiebt den Ausschnitt
nach unten.

Statt zu raten: `npm run dev` starten und
[localhost:3000/dev/bildausschnitt](http://localhost:3000/dev/bildausschnitt)
öffnen. Dort gibt es zu jedem Beitrag eine Live-Vorschau mit Reglern; *Speichern*
schreibt den Wert in die deutsche **und** die englische `.mdx`. Die Seite
existiert nur lokal, im Deployment liefert sie 404.

## Deployment (Vercel)

1. Repository zu GitHub pushen.
2. Auf [vercel.com](https://vercel.com) das Repo importieren — Next.js wird
   automatisch erkannt, keine zusätzliche Konfiguration nötig.
3. Deploy. Fertig.

Umgebungsvariablen werden nicht benötigt.

### Damit Google die Seite findet

Die Seite läuft unter **https://www.janineunterwegs.de** (Domain bei IONOS,
DNS zeigt auf Vercel). Der Aufruf ohne `www` leitet dauerhaft auf `www` weiter.

- `site.url` in `src/content/site.json` und `site.en.json` **muss exakt der
  Adresse entsprechen, unter der die Seite ausgeliefert wird** – daraus werden
  Canonical-Tags, hreflang, Sitemap, robots.txt und die Vorschaubilder gebaut.
  Steht dort eine andere Domain, schickt die Seite Google auf eine falsche
  Fährte und fliegt aus dem Index.
- **Search Console:** Property für `https://www.janineunterwegs.de` anlegen und
  `https://www.janineunterwegs.de/sitemap.xml` einreichen.

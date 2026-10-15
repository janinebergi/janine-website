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
src/app/globals.css      # Designtokens (dunkles Blau) & globale Styles;
                         #   Helligkeit siehe src/lib/theme-brightness.ts
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

Dazu gibt es je einen Zoom (`coverZoom`, `coverZoomMobile`, `coverZoomTile`) als
Zahl: `1` ist unverändert, `1.5` anderthalbfach herangezoomt. Skaliert wird um
genau den Punkt, den die Position vorgibt – sonst würde das Motiv beim
Heranzoomen aus dem Bild wandern. Fehlt das Feld, wird nicht gezoomt.

Die Header-Bilder der vier Seiten funktionieren genauso, ihre Werte stehen aber
in `site.json`: `heroImagePosition`, `heroImagePositionMobile`, `heroZoom` und
`heroZoomMobile`.

Statt zu raten: `npm run dev` starten und
[localhost:3000/dev/bildausschnitt](http://localhost:3000/dev/bildausschnitt)
öffnen. Dort gibt es zu jedem Beitrag und zu jedem Header eine Live-Vorschau mit
Reglern; *Speichern* schreibt den Wert in die deutsche **und** die englische
Fassung. Über *Bild tauschen* lässt sich auch das Bild selbst wechseln – zur
Auswahl steht alles, was unter `public/assets/website/` liegt. Bei den Headern
gehört der Alternativtext dazu; der ist übersetzt und wird deshalb je Sprache
einzeln gespeichert.

Die Seite existiert nur lokal, im Deployment liefert sie 404. Nicht abgedeckt
sind die Galeriebilder in den Beiträgen: die werden quadratisch und mittig
beschnitten, ohne einstellbaren Ausschnitt.

## Reiseführer als PDF

Ein Reiseführer wird mit einem Kasten im Fließtext angeboten. Im Beitrag steht
dafür eine Zeile, an der Stelle, an der der Kasten erscheinen soll:

```mdx
<Reisefuehrer id="indonesien" />            <!-- deutsche Fassung -->
<Reisefuehrer id="indonesien" lang="en" />  <!-- englische Fassung -->
```

Die Texte dazu stehen in beiden Sprachdateien unter `pages.reisefuehrer.<id>`,
die Datei selbst unter `public/downloads/`. Die Größe wird beim Rendern aus der
Datei gelesen, steht also nirgends doppelt. Fehlt die Datei noch, erscheint
kein Kasten — lokal steht an seiner Stelle ein Hinweis, in der
veröffentlichten Fassung bleibt die Stelle leer. Die Zeile im Beitrag kann also
schon stehen, bevor das PDF fertig ist.

Eine Datei in `public/` ist für jeden erreichbar, der die Adresse kennt. Für
etwas, das verschenkt wird, ist das genau richtig.

### Wo er auftaucht

| Ort | wie |
| --- | --- |
| Eigene Seite `/reisefuehrer` bzw. `/en/travel-guide` | Menüpunkt, in Sitemap und Suche, mit eigenem Header-Bild (einstellbar unter `/dev/bildausschnitt`) |
| Bali-Beitrag | zweimal: früh vor „Ubud" und am Ende |
| Gili-T-Beitrag | am Ende |
| Startseite | Abschnitt vor dem Kontakt-Aufruf |
| Blog-Übersicht | über dem Zusammenarbeit-Kasten |
| Länderseite Indonesien | über der Beitragsliste |
| Fußzeile | Textverweis auf jeder Seite |

Jede dieser Stellen meldet beim Klick ein Vercel-Analytics-Ereignis
(`reisefuehrer-download`) mit der Platzierung als Merkmal — `startseite`,
`beitrag-oben`, `beitrag-ende`, `beitrag-gili-t`, `blog-uebersicht`,
`laenderseite`, `reisefuehrer-seite`, `footer`. In der Vercel-Statistik ist
damit zu sehen, welche Platzierung tatsächlich Downloads bringt. Ob eigene
Ereignisse im gebuchten Tarif enthalten sind, zeigt das Vercel-Dashboard unter
*Analytics → Events*; ohne sie läuft der Download trotzdem, nur ungezählt.

Fällt eine Platzierung weg, reicht es, die Zeile bzw. das Bauteil zu
entfernen — Texte und Ziel stehen an einer einzigen Stelle in site.json.

### Export komprimieren

Canva exportiert mit *PDF Drucken* in Druckqualität: Die Fotos liegen dann
verlustfrei im PDF, 22 Seiten werden so 268 MB groß. Das lädt niemand herunter
und GitHub lehnt Dateien über 100 MB beim Push ohnehin ab. Entweder in Canva
*PDF Standard* wählen oder den vorhandenen Export nachrechnen lassen:

```bash
brew install ghostscript   # einmalig

gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
   -dDownsampleColorImages=true -dColorImageDownsampleType=/Bicubic \
   -dColorImageResolution=300 \
   -dDownsampleGrayImages=true -dGrayImageDownsampleType=/Bicubic \
   -dGrayImageResolution=300 \
   -dAutoFilterColorImages=false -dColorImageFilter=/DCTEncode \
   -dAutoFilterGrayImages=false -dGrayImageFilter=/DCTEncode \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=public/downloads/indonesien-reisefuehrer.pdf "Rohexport.pdf"
```

Aus 268 MB werden damit 11 MB, bei 300 dpi — vom Original ist auch bei vollem
Zoom nichts zu unterscheiden. Der Text bleibt Vektor, also scharf und
durchsuchbar.

Zwei Eigenheiten von Ghostscript, die einiges Ausprobieren gekostet haben:

- Nur das Profil `/ebook` rechnet die Bilder überhaupt in JPEG um. Mit
  `/printer`, `/prepress` oder ganz ohne Profil bleiben sie verlustfrei, und
  die Datei bleibt bei rund 190 MB — trotz gesetztem `/DCTEncode`.
- `-dJPEGQ` wird ignoriert (q92 und q96 ergeben byteidentische Dateien). Die
  Qualität steuert man deshalb über die Auflösung: `/ebook` allein nimmt
  150 dpi (sichtbar weich auf Retina-Displays), die 300 dpi oben sind die
  Einstellung, die zählt — und sind dabei sogar kleiner als 150 dpi ohne die
  erzwungenen DCT-Filter.

Der Rohexport gehört nicht ins Repo – er steht deshalb in `.gitignore`.

## Texte direkt auf der Seite bearbeiten

`npm run dev` starten: unten links sitzt auf jeder Seite der Knopf *Texte
bearbeiten*. Eingeschaltet bekommt jeder Text, der aus einer Quelldatei stammt,
einen gestrichelten Rahmen. Ein Klick öffnet ein kleines Fenster mit dem Text,
*Speichern* schreibt ihn in seine Datei zurück – die Seite baut sich sofort neu
auf, der Modus bleibt beim Klicken durch die Seiten erhalten.

| auf der Seite | landet in |
| --- | --- |
| Überschriften, Absätze, Knopftexte, Menü, Fußzeile | `src/content/site.json` |
| Titel und Teaser eines Beitrags (auch in den Kacheln) | Frontmatter der `.mdx` |
| Fragen und Antworten im Q&A | `faq:` im Frontmatter der `.mdx` |
| die Absätze des Beitragstextes | Fließtext der `.mdx` |

Im Fenster steht immer, in welche Datei und an welche Stelle gespeichert wird.
Bei einem Absatz aus einem Beitrag steht dort die Markdown-Quelle, also mit
`## Überschrift`, `**fett**` und `[Text](/pfad)` – so bleiben Überschriften,
Links und Betonungen beim Bearbeiten erhalten. Eine Leerzeile im Fenster teilt
den Absatz in zwei.

Kommt derselbe Text an mehreren Stellen vor („Kontakt“ ist Menüpunkt,
Überschrift und Knopf), erscheint ein Auswahlfeld mit allen Stellen.

Gespeichert wird immer die Sprachfassung, die gerade offen ist: unter `/…` die
deutsche, unter `/en/…` die englische. Deutsch bleibt die Leitfassung – die
englische Fassung danach also unter `/en/…` nachziehen.

Ein Klick trifft im Bearbeiten-Modus immer den Text, nicht den Link. Zum
Weiterklicken deshalb auf *Fertig* gehen oder mit ⌘ bzw. Strg klicken. `Esc`
schließt das Fenster, ⌘ + `Enter` speichert.

Die Seiten selbst wissen nichts von dem Werkzeug: es holt sich die
bearbeitbaren Texte der offenen Seite vom Server und sucht sie im fertigen
HTML. Deshalb muss an einer neuen Seite nichts markiert werden, damit ihre
Texte bearbeitbar sind.

Wie die beiden anderen Werkzeuge existiert es nur lokal: im Deployment wird der
Knopf nicht angezeigt und die Route, die schreibt, liefert 404.

## Helligkeit des Designs

Das Design ist bewusst dunkel, lässt sich aber in einer Stufe von 0 bis 100 %
aufhellen. `npm run dev` starten: unten rechts sitzt auf jeder Seite ein
Regler (*Helligkeit*). Er hellt die Seite sofort auf, sodass sich die Wirkung
live beurteilen lässt, und bleibt beim Klicken durch die Seiten erhalten.
*Speichern* schreibt die Werte in `src/app/globals.css` – ab dann gilt die
Helligkeit überall, auch in der veröffentlichten Fassung.

Aufgehellt werden nur die fünf Flächenfarben (Seitenhintergrund, Karten,
Rahmen, Akzentfläche); Text- und Akzentfarbe bleiben, damit der Kontrast
stimmt und das Ozean-Blau erhalten bleibt. Gerechnet wird immer ab den
Ausgangsfarben in `src/lib/theme-brightness.ts`, mehrmals Speichern hellt also
nicht immer weiter auf. Stufe 0 stellt genau das ursprüngliche Design wieder
her.

Wie das Bildausschnitt-Werkzeug existiert der Regler nur lokal: im Deployment
wird er nicht angezeigt.

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

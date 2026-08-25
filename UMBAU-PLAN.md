# Umbau: Business-Website → reiner Reiseblog

## Context

Die Website ist heute eine Copywriting-Business-Seite mit angehängtem Blog: Startseite
mit Leistungs-Kacheln und Kundenstimmen, `/leistungen`, `/mediakit`, ein
passwortgeschützter Texteditor unter `/admin`. Der Blog selbst ist das Herzstück —
9 Reiseberichte als MDX, jeweils auf Deutsch und Englisch, mit Galerien, FAQs,
Routenkarten und Budget-Charts.

Ziel: alles Geschäftliche fällt weg, übrig bleibt ein Reiseblog mit Startseite,
Über mich, Kontakt und den Pflichtseiten. **Harte Vorgabe: die MDX-Dateien in
`content/blog/` bleiben unverändert** — Frontmatter-Felder (`coverImage`,
`coverPosition`, `country`, `travelBuddy`, `gallery`, `faq`), die Custom-Komponenten
`<BudgetChart>`, `<Faq>`, `<FaqItem>` und die Render-Pipeline in
[src/lib/blog.ts](src/lib/blog.ts) und [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx)
werden nicht angefasst. Neue Blog-Features (Tag-Filter, RSS, JSON-LD) sind
ausdrücklich **nicht** Teil dieses Umbaus.

### Entscheidungen

| Frage | Entscheidung |
|---|---|
| Kompatibilität | Nur MDX-Format. URLs, Design, alte Seiten dürfen sich ändern. |
| Seiten behalten | `/`, `/blog`, `/blog/[slug]`, `/ueber-mich`, `/kontakt`, `/impressum`, `/datenschutz` |
| Seiten entfernen | `/leistungen`, `/mediakit`, `/admin` |
| Startseite | Hero + Stats + neueste Beiträge + Link zum Archiv. `/blog` bleibt die volle Liste. |
| Alte URLs | Einfach 404, keine Redirects. |
| Blog-Features | Keine neuen. |
| Geschäftliche Texte | Blöcke löschen, Resttexte als markierte Platzhalter — nichts erfinden. |
| Stats / Kundenstimmen | Stats bleiben, Kundenstimmen weg. |

---

## Schritt 1 — Seiten und Admin entfernen

Löschen:

```
src/app/leistungen/page.tsx
src/app/mediakit/page.tsx
src/components/mediakit-download.tsx
src/app/admin/page.tsx
src/app/api/admin/login/route.ts
src/app/api/admin/content/route.ts
src/components/admin/content-editor.tsx
src/components/admin/login-form.tsx
src/components/admin/logout-button.tsx
src/lib/auth.ts
src/lib/github.ts
```

Verzeichnisse `src/app/admin/`, `src/app/api/admin/`, `src/components/admin/`
fallen damit komplett weg. `src/app/api/search/route.ts` bleibt.

## Schritt 2 — Startseite umbauen

[src/app/page.tsx](src/app/page.tsx) behält Hero (Zeilen 19–73) inkl. Stats-Leiste
und `iconForStat` aus [src/lib/stat-icons.ts](src/lib/stat-icons.ts). Ersetzt werden:

- **Services-Section (Z. 76–117)** → Grid mit den 3 neuesten Beiträgen, Datenquelle
  `getAllPosts(lang).slice(0, 3)` aus [src/lib/blog.ts](src/lib/blog.ts) —
  dasselbe Muster wie bereits in [src/app/ueber-mich/page.tsx](src/app/ueber-mich/page.tsx)
  und [src/app/kontakt/page.tsx](src/app/kontakt/page.tsx). Deren Karten-Markup
  wiederverwenden, nicht neu erfinden. Link darunter: `/blog` statt `/leistungen`.
- **Testimonials-Section (Z. 120–145)** → entfällt ersatzlos; `Quote`-Icon-Import
  und `testimonials` aus dem Destructuring in Z. 13 mit entfernen.
- **CTA-Section (Z. 148–161)** bleibt strukturell, Texte werden zu Platzhaltern
  (Schritt 5).

## Schritt 3 — Navigation, Footer, Sitemap, Suche

- **`nav` in beiden JSON-Dateien**: Eintrag `/leistungen` streichen →
  Start · Über mich · Blog · Kontakt (bzw. Home · About me · Blog · Contact).
- **[src/components/layout/footer.tsx](src/components/layout/footer.tsx)**: den
  `/mediakit`-Link (Z. 71–78) entfernen, `pages.footer.mediakitLabel` aus beiden
  JSONs löschen.
- **[src/app/sitemap.ts](src/app/sitemap.ts) Z. 6**: Routen-Array auf
  `["", "/ueber-mich", "/blog", "/kontakt"]` kürzen. Blogpost-Einträge bleiben wie sie sind.
- **[src/lib/search.ts](src/lib/search.ts)**: die `staticPages`-Einträge für
  `/leistungen` (Z. 63–69) und `/mediakit` (Z. 84–90) entfernen. Der Rest der
  Index-Logik bleibt unverändert.
- **[src/components/layout/header.tsx](src/components/layout/header.tsx)**: der
  CTA-Button `/kontakt` bleibt, nur sein Label wird in Schritt 5 zum Platzhalter.

## Schritt 4 — Content-Layer aufräumen

**[src/lib/site.ts](src/lib/site.ts)**: die Exporte `services`, `testimonials` und
`mediakit` entfernen, ebenso `siteContent` (wurde nur vom Admin-Editor gebraucht).
Übrig bleiben `site`, `nav`, `stats`, `pages`, `getSiteContent`, `SiteContent`.
Der Kommentarblock über den Editor (Z. 1–3, 20–21) wird angepasst.

**In `src/content/site.json` und `src/content/site.en.json` löschen:**

- Top-Level: `services`, `testimonials`
- `pages.leistungen` (kompletter Teilbaum)
- `pages.mediakit` (kompletter Teilbaum)
- `pages.home`: `servicesEyebrow`, `servicesTitle`, `servicesDescription`,
  `servicesLink`, `testimonialsEyebrow`, `testimonialsTitle`
- `pages.footer.mediakitLabel`
- `pages.ueberMich.ctaButton`, falls die Über-mich-CTA auf ein Projekt zielt —
  vorher in [src/app/ueber-mich/page.tsx:75](src/app/ueber-mich/page.tsx#L75) prüfen

**Neu hinzufügen in `pages.home`:** `latestEyebrow`, `latestTitle`, `latestLink`
für die neue Beitrags-Section — als Platzhalter (Schritt 5).

> Beide JSON-Dateien bleiben strukturgleich. Nach dem Umbau prüfen, dass sie
> dieselben Keys haben (`SiteContent = typeof contentDe` würde sonst über
> `getSiteContent("en")` zur Laufzeit ins Leere greifen).

## Schritt 5 — Geschäftliche Texte als Platzhalter markieren

Konvention: Der alte Wert wird durch `«… »` ersetzt, mit einer Kurzbeschreibung,
was dort hingehört. Guillemets sind auf der Seite sofort sichtbar und per
`grep -rn "«" src/content/` auffindbar.

Beispiel:

```jsonc
"role": "«Rolle: wie du dich hier nennen willst, z. B. Reisebloggerin»",
"heroPrimaryCta": "«Button-Text, z. B. Beiträge lesen»",
```

Zu markieren sind (DE **und** EN, gleiche Keys):

| Ort | Aktueller Text |
|---|---|
| `site.role` | „Texterin & Copywriterin" |
| `site.tagline` | „Weil guter Text kein Zufall, sondern Wortwahl ist." |
| `site.description` | Copywriting-Beschreibung (geht auch in OG/Meta) |
| `pages.home.heroHeadingPre/Highlight/Post` | „Texte, die **Fernweh** wecken." |
| `pages.home.heroText` | „Ich helfe dir, deine Angebote …" |
| `pages.home.heroPrimaryCta` | „Projekt anfragen" |
| `pages.home.ctaTitle` / `ctaText` / `ctaButton` | „Bereit für Texte, die wirken?" … |
| `pages.home.latestEyebrow` / `latestTitle` / `latestLink` | neu |
| `pages.header.cta` | „Projekt anfragen" |
| `pages.footer.tagline` | „Texte, die Angebote emotional präsentieren …" |
| `pages.blog.collabEyebrow/Title/Text/Cta` | Kooperations-Block unter der Blogliste |
| `pages.blogPost.projectCta` | „Projekt anfragen →" |
| `pages.kontakt.heroTitle` / `heroText` | „Erzähl mir von deinem Projekt." |
| `pages.ueberMich.blogNote` | „Lust auf eine Leseprobe meines Schreibstils?" |
| `pages.ueberMich.paragraphs` | Vor dem Markieren durchlesen — vermutlich nur teilweise geschäftlich |
| `stats[1].label` | „Jahre im Tourismus" (`stats[0]` „17 Länder bereist" bleibt) |

Auch anzupassen: das Platzhalter-`alt` in
[src/app/page.tsx:26](src/app/page.tsx#L26) und der Placeholder im Kontaktformular
[src/components/contact-form.tsx:67](src/components/contact-form.tsx#L67)
(„Erzähl mir kurz von deinem Projekt …").

Am Ende entsteht `PLATZHALTER.md` im Repo-Root: eine Checkliste aller markierten
Stellen mit Dateipfad, Key und altem Text, zum Abhaken.

## Schritt 6 — Doku und Umgebung

- **[README.md](README.md)**: Abschnitt „Texte bearbeiten mit Login (`/admin`)"
  komplett streichen; die Projektstruktur (nennt noch `/leistungen`, `/arbeiten`
  und ein nicht mehr existierendes `src/lib/site.ts` als Contentquelle) auf den
  Ist-Stand bringen: Texte liegen in `src/content/site.json` / `site.en.json`,
  Beiträge in `content/blog/` und `content/blog/en/`. Deployment-Schritt 3
  (Env-Variablen) entfällt. Der Bilder-Abschnitt („Platzhalter von picsum.photos")
  stimmt nicht mehr — alle Beiträge nutzen lokale Assets.
- **[.env.example](.env.example)**: `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`,
  `GITHUB_BRANCH` entfernen. Bleibt die Datei damit leer, wird sie gelöscht.
- **[next.config.mjs](next.config.mjs)**: `remotePatterns` für `picsum.photos` und
  `images.unsplash.com` entfernen, sofern `grep -rn "picsum\|unsplash" content/ src/`
  nichts mehr findet.
- **Aufräumen im Root**: `.tmp-convert-videos.mjs` und das eingecheckte
  `tsconfig.tsbuildinfo` löschen, `tsconfig.tsbuildinfo` in `.gitignore` aufnehmen.
- **Ungenutzte Assets**: `public/assets/website/Rom/` gehört zu keinem Beitrag.
  Vor dem Löschen kurz rückfragen — vielleicht ist ein Rom-Beitrag geplant.

**Manuell nach dem Deploy (nicht im Code):** in Vercel unter
Project → Settings → Environment Variables die Variablen `ADMIN_PASSWORD` und
`GITHUB_TOKEN` löschen. Danach den GitHub-Token unter
github.com/settings/personal-access-tokens widerrufen — er hat Schreibrechte aufs Repo
und wird nicht mehr gebraucht.

---

## Verifikation

```bash
# 1. Nichts verweist mehr auf entfernte Seiten
grep -rn --include='*.tsx' --include='*.ts' --include='*.json' \
  -e 'leistungen' -e 'mediakit' -e '/admin' -e 'testimonials' src/

# 2. Beide Sprachdateien haben identische Keys
node -e "
const w=(o,p='',s=[])=>{for(const k of Object.keys(o)){const v=o[k],q=p?p+'.'+k:k;
  (v&&typeof v==='object'&&!Array.isArray(v))?w(v,q,s):s.push(q)} return s};
const a=w(require('./src/content/site.json')), b=w(require('./src/content/site.en.json'));
const d=[...a.filter(k=>!b.includes(k)).map(k=>'nur DE: '+k),
         ...b.filter(k=>!a.includes(k)).map(k=>'nur EN: '+k)];
console.log(d.length ? d.join('\n') : 'Keys identisch ✓');"

# 3. Offene Platzhalter auflisten
grep -rn '«' src/content/ src/

# 4. Build muss durchlaufen (prüft auch die 9 statischen Blog-Routen)
npm run build
```

Danach `npm run dev` und manuell durchklicken:

- `/` → Hero, Stats, 3 neueste Beiträge, Link auf `/blog`
- `/blog` → Featured-Karte + Grid, alle 9 Beiträge
- `/blog/harry-potter-tour-schottland` → Cover mit `coverPosition`, Routenkarte,
  Inhaltsverzeichnis, Vorlesen-Button, Galerie, FAQ, „Weiterlesen"
- `/blog/open-water-diver` → prüft `<BudgetChart>` und die per-Bild-`credit`s
- Sprachumschalter auf EN → dieselben Seiten, EN-Texte, keine leeren Stellen
- Header-Suche „Schottland" → nur noch Blog- und verbliebene Seitentreffer
- `/leistungen`, `/mediakit`, `/admin` → 404
- `/kontakt` → Formular öffnet weiterhin den Mail-Client
- `/sitemap.xml` → 4 statische Routen + 9 Beiträge, kein `/leistungen`, kein `/mediakit`

> Falls `npm run dev` eine leere Seite oder 500 liefert: bekanntes Turbopack-Problem
> unter Node 26 — `dev`-Skript vorübergehend ohne Turbopack starten.

## Reihenfolge

Schritte 1–4 in einem Commit (Struktur), Schritt 5 in einem zweiten (Texte),
Schritt 6 in einem dritten (Doku/Aufräumen). So bleibt der Diff lesbar und die
Platzhalter-Arbeit lässt sich getrennt zurückrollen.

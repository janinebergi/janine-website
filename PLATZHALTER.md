# Platzhalter — offene Texte

Beim Umbau zum reinen Reiseblog (Schritt 5 aus [UMBAU-PLAN.md](UMBAU-PLAN.md))
wurden alle geschäftlichen Texte durch markierte Platzhalter ersetzt. Der alte
Text ist hier festgehalten, damit nichts verloren geht — auf der Website steht
stattdessen eine Kurzbeschreibung in Guillemets.

**Alle offenen Stellen finden:**

```bash
grep -rn '«' src/
```

Jede Zeile in DE **und** EN füllen — die beiden JSON-Dateien müssen strukturgleich bleiben.

---

## 1. Marke & Meta — `src/content/site.json` · `site.en.json`

| ✓ | Key | Alter Text (DE) |
|---|---|---|
| ☐ | `site.role` | Texterin & Copywriterin |
| ☐ | `site.tagline` | Weil guter Text kein Zufall, sondern Wortwahl ist. |
| ☐ | `site.description` | Janine ist Texterin & Copywriterin. Texte für Websites, Blogs und Newsletter, die Emotionen wecken, Fernweh auslösen und Geschichten erzählen. |
| ☐ | `stats[1].label` | Jahre im Tourismus |

> `stats[0]` („17 Länder bereist") bleibt unverändert.
> Das Icon der Kachel wird in [src/lib/stat-icons.ts](src/lib/stat-icons.ts)
> aus dem Label abgeleitet: enthält der neue Text „Jahr" bzw. „year", bleibt
> der Kalender, sonst erscheint ein Stern.

## 2. Startseite — `pages.home`

| ✓ | Key | Alter Text (DE) |
|---|---|---|
| ☐ | `heroHeadingPre` | „Texte, die " |
| ☐ | `heroHeadingHighlight` | Fernweh |
| ☐ | `heroHeadingPost` | " wecken." |
| ☐ | `heroText` | Ich bin Janine, Texterin & Copywriterin. Ich helfe dir, deine Angebote mit Worten ins beste Licht zu rücken: auf Websites, in Blogs und Newslettern. |
| ☐ | `heroPrimaryCta` | Projekt anfragen |
| ☐ | `latestEyebrow` | neu (Section „Neueste Beiträge") |
| ☐ | `latestTitle` | neu |
| ☐ | `latestLink` | neu |
| ☐ | `ctaTitle` | Bereit für Texte, die wirken? |
| ☐ | `ctaText` | Erzähl mir von deinem Projekt. Ich melde mich so schnell wie möglich mit den nächsten Schritten. |
| ☐ | `ctaButton` | Jetzt Projekt anfragen |

> Die drei Hero-Teile werden ohne Trennzeichen aneinandergehängt — die
> Leerzeichen am Ende von `heroHeadingPre` bzw. am Anfang von `heroHeadingPost`
> gehören mit in den Text.

## 3. Header & Footer

| ✓ | Key | Alter Text (DE) |
|---|---|---|
| ☐ | `pages.header.cta` | Projekt anfragen |
| ☐ | `pages.footer.tagline` | Texte, die Angebote emotional präsentieren und Geschichten erzählen. |

## 4. Blog — `pages.blog` · `pages.blogPost`

| ✓ | Key | Alter Text (DE) |
|---|---|---|
| ☐ | `blog.collabEyebrow` | Zusammenarbeit |
| ☐ | `blog.collabTitle` | Du möchtest mit mir zusammenarbeiten? |
| ☐ | `blog.collabText` | Du bist auf einen meiner Beiträge gestoßen und interessierst dich für eine Zusammenarbeit? Du hast ein Produkt, ein Hotel, eine Unterkunft oder ein Reiseerlebnis, das ich austesten und hier im Blog vorstellen soll? Dann melde dich gerne bei mir. Ich freue mich auf deine Nachricht. |
| ☐ | `blog.collabCta` | Schreib mir |
| ☐ | `blogPost.projectCta` | Projekt anfragen → |

> Der Kooperations-Block unter der Blogliste passt inhaltlich weiterhin zu einem
> Reiseblog. Wenn du ihn so behalten willst, kannst du den alten Text einfach
> wieder eintragen.

## 5. Kontakt & Über mich

| ✓ | Key | Alter Text (DE) |
|---|---|---|
| ☐ | `pages.kontakt.heroTitle` | Erzähl mir von deinem Projekt. |
| ☐ | `pages.kontakt.heroText` | Du hast Interesse an meinen Texten oder möchtest über dein Projekt sprechen? Dann schreib mir einfach kurz, worum es geht. Ich melde mich zeitnah und persönlich bei dir zurück. |
| ☐ | `pages.ueberMich.blogNote` | Lust auf eine Leseprobe meines Schreibstils? Ich schreibe regelmäßig eigene Reisegeschichten in meinem |
| ☐ | `pages.ueberMich.ctaButton` | Lass uns sprechen |

> `blogNote` steht direkt vor dem verlinkten Wort „Blog" — der Satz muss ohne
> Punkt enden, der wird im Code angehängt.
> `pages.ueberMich.paragraphs` wurde durchgelesen und **nicht** markiert: die
> Absätze erzählen deine Reise- und Berufsbiografie, kein Angebot.

## 6. Code

| ✓ | Ort | Alter Text |
|---|---|---|
| ☐ | [src/app/page.tsx:28](src/app/page.tsx#L28) — `alt` des Header-Bilds | Platzhalter – hier folgt das große Header-Bild |
| ☐ | [src/components/contact-form.tsx:18](src/components/contact-form.tsx#L18) — Betreff der Mail | Projektanfrage von … |
| ☐ | [src/components/contact-form.tsx:69](src/components/contact-form.tsx#L69) — Placeholder im Nachrichtenfeld | Erzähl mir kurz von deinem Projekt … |

> Das Kontaktformular ist fest auf Deutsch — es gibt hier keine EN-Variante.

---

## Nicht markiert, aber prüfenswert

Diese Texte stehen nicht im Umbau-Plan und wurden deshalb unverändert gelassen.
Für einen reinen Reiseblog passen sie aber nur bedingt:

- `pages.ueberMich.valuesEyebrow` / `valuesTitle` / `values` — „Warum ich?",
  „Was du von mir bekommst", inkl. „SEO-optimierte Inhalte" und
  „Maßgeschneiderte Lösungen … für dein Unternehmen".
- `pages.kontakt.callTitle` / `callValue` — „Erstgespräch · Kostenlos & unverbindlich".
- `pages.kontakt.metaDescription` — „für dein nächstes Copywriting-Projekt".
- `pages.ueberMich.metaDescription` — „Copywriterin mit einem Faible für …".
- `pages.blog.metaDescription` — „… sowie Gedanken zu Copywriting".
- Der Hero-Button auf der Startseite und der Button unter „Über mich" verlinken
  weiterhin auf `/kontakt`. Für einen Blog wäre `/blog` naheliegender — dann
  müssten die `href`s in [src/app/page.tsx](src/app/page.tsx) und
  [src/app/ueber-mich/page.tsx](src/app/ueber-mich/page.tsx) angepasst werden.

## Bereits vorher offen (Rechtstexte)

Andere Markierung: `⟨ … ⟩`, zu finden mit `grep -rn '⟨' src/content/`.

| ✓ | Key | Fehlt |
|---|---|---|
| ☐ | `pages.impressum.contact.street` / `.city` / `.phone` | Anschrift und Telefonnummer |
| ☐ | `pages.datenschutz.controller.street` / `.city` / `.phone` | dieselben Angaben |
| ☐ | `pages.datenschutz.sections[2].text` | Name und Anschrift des Hosting-Anbieters |

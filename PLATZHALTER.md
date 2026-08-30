# Platzhalter — offene Texte

Die beim Umbau zum Reiseblog markierten Platzhalter (`«… »`) sind **alle gefüllt**.
Auf der Website stehen jetzt durchgehend Texte, die zum Blog passen.

**Gegenprobe:**

```bash
grep -rn '«' src/          # muss leer sein
grep -rn '⟨' src/content/  # zeigt die verbliebenen Rechtstext-Lücken
```

---

## Offen: Rechtstexte

Diese Angaben kann nur Janine selbst eintragen — sie stehen weiterhin in
spitzen Klammern `⟨ … ⟩`.

| ✓ | Key | Fehlt |
|---|---|---|
| ☐ | `pages.impressum.contact.street` / `.city` / `.phone` | Anschrift und Telefonnummer |
| ☐ | `pages.datenschutz.controller.street` / `.city` / `.phone` | dieselben Angaben |
| ☐ | `pages.datenschutz.sections[2].text` | Name und Anschrift des Hosting-Anbieters |

---

## Erledigt: die gefüllten Texte

Alle Texte stehen in **beiden** Sprachdateien
(`src/content/site.json` · `site.en.json`) und sind aus den Blogbeiträgen und
der „Über mich"-Biografie abgeleitet.

### Marke & Meta

| Key | Text (DE) |
|---|---|
| `site.role` | Reisebloggerin |
| `site.tagline` | Berichte aus erster Hand. |
| `site.description` | Der Reiseblog von Janine Bergmann: ehrliche Reiseberichte aus 17 Ländern, vom Surfcamp in Portugal über den Roadtrip durch Florida bis zum Tauchschein im Roten Meer. |
| `stats[1].label` | Jahre im Tourismus (unverändert — die Zahl 8 deckt sich mit der Timeline ab 2018; das Kalender-Icon bleibt dadurch erhalten) |

### Startseite — `pages.home`

| Key | Text (DE) |
|---|---|
| `heroHeadingPre` / `Highlight` / `Post` | „Geschichten, die **Fernweh** wecken." |
| `heroText` | Ich bin Janine und liebe es nicht nur zu reisen, sondern auch darüber zu schreiben. Hier erzähle ich, wie meine Reisen wirklich waren: von der ersten Welle in Portugal bis zu den Mantas vor Nusa Penida. |
| `heroPrimaryCta` | Schreib mir |
| `latestEyebrow` / `latestTitle` / `latestLink` | Aus dem Blog · Zuletzt erschienen · Alle Beiträge |
| `ctaTitle` | Lust auf mehr Reisegeschichten? |
| `ctaText` | Du hast eine Frage zu einer meiner Reisen, einen Tipp für mein nächstes Ziel oder willst einfach Hallo sagen? Ich freue mich über jede Nachricht. |
| `ctaButton` | Schreib mir |

### Header & Footer

| Key | Text (DE) |
|---|---|
| `pages.header.cta` | Kontakt |
| `pages.footer.tagline` | Erfahrungen aus 17 Ländern, vom Surfcamp bis zum Tauchgang. |

### Blog — `pages.blog` · `pages.blogPost`

Der Block unter den Beiträgen ist bewusst nicht kommerziell formuliert:
„Austausch" · „Etwas, das ich mal erleben sollte?" · der Absatz über
Lieblingsorte und Reisetipps · „Schreib mir". `blogPost.projectCta` lautet
jetzt „Schreib mir →".

### Kontakt & Über mich

| Key | Text (DE) |
|---|---|
| `pages.kontakt.heroTitle` | Sag Hallo. |
| `pages.kontakt.heroText` | Du hast eine Frage zu einer meiner Reisen oder einen Tipp für mein nächstes Ziel? Oder du hast ein Hotel, einen Tauchkurs oder ein anderes Reiseerlebnis, das ich austesten und hier im Blog vorstellen soll? Dann schreib mir einfach kurz, worum es geht. Ich melde mich so schnell wie möglich persönlich bei dir zurück. |
| `pages.ueberMich.blogNote` | Meine Reisegeschichten von Portugal bis Indonesien findest du in meinem [Blog]. |
| `pages.ueberMich.ctaButton` | Schreib mir |

### Code

| Ort | Text |
|---|---|
| [src/app/page.tsx:26](src/app/page.tsx#L26) — `alt` des Header-Bilds | Taucherin im tiefblauen Wasser, über ihr eine Spur aus Luftblasen |
| [src/components/contact-form.tsx:18](src/components/contact-form.tsx#L18) — Betreff der Mail | Nachricht über den Blog von … |
| [src/components/contact-form.tsx:69](src/components/contact-form.tsx#L69) — Placeholder im Nachrichtenfeld | Erzähl mir kurz, worum es geht … |

---

## Zusätzlich überarbeitet

Diese Texte waren nicht als Platzhalter markiert, warben aber weiter für das
Copywriting-Angebot. Sie wurden auf den Reiseblog umgeschrieben:

- `pages.ueberMich.valuesEyebrow` / `valuesTitle` / `values` — statt „Warum ich?
  Was du von mir bekommst" mit SEO- und Agenturleistungen jetzt „Was mich
  antreibt · Worauf du dich hier freuen kannst": ehrliche Reiseberichte, immer in
  Bewegung, Tipps zum Nachreisen, Reisen ist mein Beruf.
- `pages.kontakt.callTitle` / `callValue` — statt „Erstgespräch · Kostenlos &
  unverbindlich" jetzt „Austesten · Hotels, Tauchkurse & Reiseerlebnisse".
- `pages.ueberMich.metaDescription`, `pages.kontakt.metaDescription` und
  `pages.blog.metaDescription` — ohne Copywriting-Bezug.

## Noch offen zur Entscheidung

Der Hero-Button auf der Startseite und der Button unter „Über mich" verlinken
weiterhin auf `/kontakt` und heißen deshalb „Schreib mir". Für einen Blog wäre
`/blog` mit „Beiträge lesen" naheliegender — dafür müssten die `href`s in
[src/app/page.tsx](src/app/page.tsx) und
[src/app/ueber-mich/page.tsx](src/app/ueber-mich/page.tsx) geändert werden.

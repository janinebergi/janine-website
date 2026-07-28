import type { Lang } from "@/lib/i18n-constants";

type Item = {
  label: string;
  amount: number;
  note?: string;
};

type Budget = {
  title: string;
  items: Item[];
  avgPerDay: {
    total: number;
    perPerson: number;
  };
};

const budgetsByLang: Record<Lang, Record<string, Budget>> = {
  de: {
    bali: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Flüge", amount: 1754 },
        {
          label: "Aktivitäten",
          amount: 1101.39,
          note: "inkl. Tauchtrips, 35–45 € pro Tauchgang inkl. kompletter Ausrüstung, 13 Tauchgänge",
        },
        { label: "Restaurants", amount: 429.39 },
        { label: "Getränke", amount: 393.49 },
        { label: "Unterkünfte", amount: 343.03 },
        { label: "Gebühren", amount: 330.21 },
        { label: "Wechselgebühren", amount: 255 },
        { label: "Andere", amount: 183.66, note: "Transport, Einkäufe, Sonstiges" },
      ],
      avgPerDay: { total: 217, perPerson: 108 },
    },
    srilanka: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Flüge", amount: 1664 },
        { label: "Unterkünfte", amount: 725 },
        { label: "Sonstige Ausgaben", amount: 454 },
        { label: "Restaurants & Essen", amount: 393 },
        { label: "Transport vor Ort", amount: 297, note: "Zug, TukTuk, Fahrer" },
        { label: "Freizeitaktivitäten & Eintritte", amount: 261 },
      ],
      avgPerDay: { total: 142, perPerson: 71 },
    },
    morocco: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Aktivitäten", amount: 284.14 },
        { label: "Unterkünfte", amount: 266.5 },
        { label: "Flüge", amount: 192.05 },
        { label: "Restaurants", amount: 132.27 },
        { label: "Transport", amount: 91 },
        { label: "Wechselgebühren", amount: 75.82 },
        { label: "Gebühren", amount: 13 },
      ],
      avgPerDay: { total: 144, perPerson: 72 },
    },
    portugal: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Unterkünfte", amount: 1870 },
        { label: "Surfcamp-Pauschale", amount: 1500 },
        { label: "Restaurants", amount: 509.8 },
        { label: "Getränke", amount: 369.8 },
        { label: "Andere", amount: 378, note: "Shopping, Aktivitäten, Einkäufe, Unterhaltung" },
        { label: "Transport", amount: 298.7 },
      ],
      avgPerDay: { total: 290, perPerson: 145 },
    },
    scotland: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Unterkünfte", amount: 1764 },
        { label: "Transport", amount: 284.25 },
        { label: "Andere", amount: 210.68, note: "Getränke, Sehenswürdigkeiten, Gebühren, Unterhaltung" },
        { label: "Einkäufe", amount: 161.95 },
        { label: "Restaurants", amount: 131.69 },
      ],
      avgPerDay: { total: 319, perPerson: 160 },
    },
    newyork: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Flüge", amount: 1329 },
        { label: "Unterkünfte", amount: 797 },
        { label: "Restaurants", amount: 510.94 },
        { label: "Unterhaltung", amount: 340.09 },
        { label: "Sehenswürdigkeiten", amount: 194.8 },
        { label: "Transport", amount: 176.77 },
        { label: "Andere", amount: 144.83, note: "Shopping, Gebühren" },
      ],
      avgPerDay: { total: 240, perPerson: 120 },
    },
    florida: {
      title: "Kosten für 2 Personen",
      items: [
        { label: "Flüge", amount: 1560 },
        { label: "Unterkünfte", amount: 1113.32 },
        { label: "Transport", amount: 828.11, note: "Mietwagen, Sprit, Maut, Parken" },
        { label: "Restaurants", amount: 719.66 },
        { label: "Aktivitäten", amount: 519.1 },
        { label: "Unterhaltung", amount: 275.2 },
        { label: "Andere", amount: 442.68, note: "Einkäufe, Sehenswürdigkeiten, Shopping, Getränke, Gebühren" },
      ],
      avgPerDay: { total: 278, perPerson: 139 },
    },
  },
  en: {
    bali: {
      title: "Cost for 2 people",
      items: [
        { label: "Flights", amount: 1754 },
        {
          label: "Activities",
          amount: 1101.39,
          note: "incl. dive trips, €35–45 per dive incl. full gear, 13 dives",
        },
        { label: "Restaurants", amount: 429.39 },
        { label: "Drinks", amount: 393.49 },
        { label: "Accommodation", amount: 343.03 },
        { label: "Fees", amount: 330.21 },
        { label: "Exchange fees", amount: 255 },
        { label: "Other", amount: 183.66, note: "Transport, shopping, miscellaneous" },
      ],
      avgPerDay: { total: 217, perPerson: 108 },
    },
    srilanka: {
      title: "Cost for 2 people",
      items: [
        { label: "Flights", amount: 1664 },
        { label: "Accommodation", amount: 725 },
        { label: "Other expenses", amount: 454 },
        { label: "Restaurants & food", amount: 393 },
        { label: "Local transport", amount: 297, note: "Train, tuk-tuk, driver" },
        { label: "Activities & admission fees", amount: 261 },
      ],
      avgPerDay: { total: 142, perPerson: 71 },
    },
    morocco: {
      title: "Cost for 2 people",
      items: [
        { label: "Activities", amount: 284.14 },
        { label: "Accommodation", amount: 266.5 },
        { label: "Flights", amount: 192.05 },
        { label: "Restaurants", amount: 132.27 },
        { label: "Transport", amount: 91 },
        { label: "Exchange fees", amount: 75.82 },
        { label: "Fees", amount: 13 },
      ],
      avgPerDay: { total: 144, perPerson: 72 },
    },
    portugal: {
      title: "Cost for 2 people",
      items: [
        { label: "Accommodation", amount: 1870 },
        { label: "Surf camp package", amount: 1500 },
        { label: "Restaurants", amount: 509.8 },
        { label: "Drinks", amount: 369.8 },
        { label: "Other", amount: 378, note: "Shopping, activities, purchases, entertainment" },
        { label: "Transport", amount: 298.7 },
      ],
      avgPerDay: { total: 290, perPerson: 145 },
    },
    scotland: {
      title: "Cost for 2 people",
      items: [
        { label: "Accommodation", amount: 1764 },
        { label: "Transport", amount: 284.25 },
        { label: "Other", amount: 210.68, note: "Drinks, sights, fees, entertainment" },
        { label: "Shopping", amount: 161.95 },
        { label: "Restaurants", amount: 131.69 },
      ],
      avgPerDay: { total: 319, perPerson: 160 },
    },
    newyork: {
      title: "Cost for 2 people",
      items: [
        { label: "Flights", amount: 1329 },
        { label: "Accommodation", amount: 797 },
        { label: "Restaurants", amount: 510.94 },
        { label: "Entertainment", amount: 340.09 },
        { label: "Sights", amount: 194.8 },
        { label: "Transport", amount: 176.77 },
        { label: "Other", amount: 144.83, note: "Shopping, fees" },
      ],
      avgPerDay: { total: 240, perPerson: 120 },
    },
    florida: {
      title: "Cost for 2 people",
      items: [
        { label: "Flights", amount: 1560 },
        { label: "Accommodation", amount: 1113.32 },
        { label: "Transport", amount: 828.11, note: "Rental car, fuel, tolls, parking" },
        { label: "Restaurants", amount: 719.66 },
        { label: "Activities", amount: 519.1 },
        { label: "Entertainment", amount: 275.2 },
        { label: "Other", amount: 442.68, note: "Purchases, sights, shopping, drinks, fees" },
      ],
      avgPerDay: { total: 278, perPerson: 139 },
    },
  },
};

const labels: Record<Lang, { total: string; avgPerDay: string; perPerson: string; excludingFlights: string }> = {
  de: { total: "Gesamt", avgPerDay: "⌀ pro Tag", perPerson: "p. P.", excludingFlights: "ohne Flüge" },
  en: { total: "Total", avgPerDay: "⌀ per day", perPerson: "p.p.", excludingFlights: "excluding flights" },
};

const euroDe = (value: number) =>
  value.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
const euroEn = (value: number) =>
  "€" + value.toLocaleString("en-GB", { maximumFractionDigits: 0 });

// Wandelt die Kostenübersicht einer Reise in vorlesbaren Fließtext um (ohne
// €-Zeichen, mit ausgeschriebenem "Euro" und runden Beträgen, damit die
// Sprachausgabe die Zahlen sauber vorliest). Wird vom Vorlese-Button genutzt.
export function budgetToSpeechText(trip: string, lang: Lang): string {
  const budgets = budgetsByLang[lang] ?? budgetsByLang.de;
  const budget = budgets[trip] ?? budgets.bali;
  const unit = lang === "en" ? "euros" : "Euro";
  const total = Math.round(
    budget.items.reduce((sum, item) => sum + item.amount, 0),
  );

  const items = budget.items
    .map((item) => `${item.label}: ${Math.round(item.amount)} ${unit}`)
    .join(". ");

  const intro =
    lang === "en"
      ? `${budget.title}. Total: ${total} ${unit}.`
      : `${budget.title}. Gesamt: ${total} ${unit}.`;
  const average =
    lang === "en"
      ? `On average ${budget.avgPerDay.total} ${unit} per day for 2 people, that is ${budget.avgPerDay.perPerson} ${unit} per person.`
      : `Durchschnittlich ${budget.avgPerDay.total} ${unit} pro Tag für 2 Personen, also ${budget.avgPerDay.perPerson} ${unit} pro Person.`;

  return `${intro} ${items}. ${average}`;
}

export function BudgetChart({
  trip = "bali",
  lang = "de",
}: {
  trip?: keyof typeof budgetsByLang.de;
  lang?: Lang;
}) {
  const budgets = budgetsByLang[lang];
  const budget = budgets[trip] ?? budgets.bali;
  const { title, items, avgPerDay } = budget;
  const t = labels[lang];
  const euro = lang === "en" ? euroEn : euroDe;

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted">
          {t.total}{" "}
          <strong className="font-semibold text-foreground">
            {euro(total)}
          </strong>
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {t.avgPerDay}{" "}
        <strong className="font-semibold text-foreground">
          {euro(avgPerDay.total)}
        </strong>{" "}
        {lang === "en" ? "for 2 people" : "für 2 Personen"} ({euro(avgPerDay.perPerson)} {t.perPerson}) · {t.excludingFlights}
      </p>

      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item) => {
          const share = Math.round((item.amount / total) * 100);
          const barWidth = (item.amount / max) * 100;
          return (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">
                  {item.label}
                  {item.note && (
                    <span className="ml-2 text-xs font-normal text-muted">
                      {item.note}
                    </span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  <strong className="font-semibold text-foreground">
                    {euro(item.amount)}
                  </strong>{" "}
                  · {share}%
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-accent-soft">
                <div
                  className="h-full rounded-full bg-accent-hover"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

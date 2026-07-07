type Item = {
  label: string;
  amount: number;
  note?: string;
};

type Budget = {
  title: string;
  items: Item[];
};

const budgets: Record<string, Budget> = {
  bali: {
    title: "Kosten für 2 Personen",
    items: [
      { label: "Flüge", amount: 1754 },
      { label: "Aktivitäten", amount: 1101.39 },
      { label: "Restaurants", amount: 429.39 },
      { label: "Getränke", amount: 393.49 },
      { label: "Unterkünfte", amount: 343.03 },
      { label: "Gebühren", amount: 330.21 },
      { label: "Wechselgebühren", amount: 255 },
      { label: "Andere", amount: 183.66, note: "Transport, Einkäufe, Sonstiges" },
    ],
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
  },
};

const euro = (value: number) =>
  value.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";

export function BudgetChart({ trip = "bali" }: { trip?: keyof typeof budgets }) {
  const budget = budgets[trip] ?? budgets.bali;
  const { title, items } = budget;

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted">
          Gesamt{" "}
          <strong className="font-semibold text-foreground">
            {euro(total)}
          </strong>
        </span>
      </div>

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

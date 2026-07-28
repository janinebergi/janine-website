import { List } from "lucide-react";

export type TocItem = {
  id: string;
  text: string;
};

export function BlogToc({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length < 2) return null;

  return (
    <details
      className="group mt-10 rounded-2xl border border-border bg-surface/60 px-6 py-5"
      aria-label={label}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-muted marker:content-['']">
        <span className="flex items-center gap-2">
          <List size={14} className="text-accent-hover" />
          {label}
        </span>
        <span className="text-accent-hover transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      {/* Zweispaltig als Spaltenfluss (columns) statt Grid: so wird erst die
          linke Spalte von oben nach unten und dann die rechte gelesen –
          chronologisch, nicht abwechselnd links/rechts. */}
      <ul className="mt-3 sm:columns-2 sm:[column-gap:1.5rem]">
        {items.map((item) => (
          <li key={item.id} className="mb-2 break-inside-avoid last:mb-0">
            <a
              href={`#${item.id}`}
              className="text-sm text-muted transition-colors hover:text-accent-hover"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

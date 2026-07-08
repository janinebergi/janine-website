"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Lang } from "@/lib/i18n-constants";
import type { SearchItem } from "@/lib/search";

type SearchLabels = {
  searchAriaLabelOpen: string;
  searchAriaLabelClose: string;
  searchPlaceholder: string;
  searchNoResults: string;
  searchTypeBlog: string;
  searchTypePage: string;
};

export function SiteSearch({
  lang,
  labels,
  onOpenChange,
  className,
}: {
  lang: Lang;
  labels: SearchLabels;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const [open, setOpenState] = useState(false);

  function setOpen(next: boolean) {
    setOpenState(next);
    onOpenChange?.(next);
  }
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Der Suchindex ist klein (Seiten + Blogbeiträge) – einmal laden und
  // danach clientseitig filtern, damit Vorschläge sofort beim Tippen erscheinen.
  useEffect(() => {
    fetch(`/api/search?lang=${lang}`)
      .then((res) => res.json())
      .then((data: SearchItem[]) => setIndex(data))
      .catch(() => setIndex([]));
  }, [lang]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeAndReset();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .map((item) => {
        // Treffer im Titel/in der Beschreibung wiegen schwerer als Treffer,
        // die nur im Volltext (Seiteninhalt, Blogtext, FAQ) stecken.
        let score = 0;
        if (item.title.toLowerCase().includes(q)) score += 3;
        if (item.description.toLowerCase().includes(q)) score += 2;
        if (item.content.toLowerCase().includes(q)) score += 1;
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ item }) => item);
  }, [query, index]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  function closeAndReset() {
    setOpen(false);
    setQuery("");
  }

  function go(url: string) {
    closeAndReset();
    router.push(url);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      closeAndReset();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex].url);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        aria-label={labels.searchAriaLabelOpen}
        onClick={() => setOpen(true)}
        className={`text-muted transition-colors hover:text-foreground ${className ?? ""}`}
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <div className="flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={labels.searchPlaceholder}
          className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none sm:w-56"
        />
        <button
          type="button"
          aria-label={labels.searchAriaLabelClose}
          onClick={closeAndReset}
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {query.trim() && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-2xl border border-border bg-bg shadow-lg">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((item, i) => (
                <li key={item.url}>
                  <button
                    type="button"
                    onClick={() => go(item.url)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`block w-full px-4 py-2.5 text-left transition-colors ${
                      i === activeIndex ? "bg-accent/10" : ""
                    }`}
                  >
                    <span className="block truncate text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {item.description}
                    </span>
                    <span className="mt-1 inline-block rounded-full bg-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                      {item.type === "blog" ? labels.searchTypeBlog : labels.searchTypePage}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted">{labels.searchNoResults}</p>
          )}
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Wiederverwendbare FAQ-Sektion für Blogbeiträge. Nutzt natives <details>,
// funktioniert also ohne JavaScript. Fragen/Antworten kommen als <FaqItem>
// direkt aus dem MDX, damit die Inhalte in den Content-Dateien bleiben.
export function Faq({ children }: { children: ReactNode }) {
  return <div className="not-prose my-8 flex flex-col gap-3">{children}</div>;
}

export function FaqItem({
  q,
  children,
}: {
  q: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-border bg-surface/60 px-5 transition-colors open:bg-surface/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown
          size={18}
          className="shrink-0 text-accent-hover transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border pb-4 pt-3 leading-relaxed text-muted [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </div>
    </details>
  );
}

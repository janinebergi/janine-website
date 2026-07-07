"use client";

import { Download } from "lucide-react";

// Löst den Druckdialog aus. In Kombination mit den Print-Styles in
// globals.css entsteht daraus ein sauberes A4-PDF des Media Kits.
export function MediakitDownload({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-[0_0_30px_-8px_var(--color-accent)] transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <Download size={16} />
      {label}
    </button>
  );
}

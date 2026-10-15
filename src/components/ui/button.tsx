import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[0_0_30px_-8px_var(--color-accent)]",
  secondary:
    "border border-border bg-surface text-foreground hover:border-accent hover:text-accent-hover",
  ghost: "text-foreground hover:text-accent-hover",
};

// Dieselben Klassen ohne das Bauteil – für die Fälle, in denen next/link
// nicht passt: ein Datei-Download aus public/ oder ein Verweis nach außen.
export function buttonClass(variant: Variant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={buttonClass(variant, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

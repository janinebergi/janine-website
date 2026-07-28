import type { Post } from "@/lib/blog";
import type { Lang } from "@/lib/i18n-constants";
import { budgetToSpeechText } from "@/components/budget-chart";

// Wandelt einen MDX-Beitrag in möglichst sauberen Fließtext um, den der Browser
// vorlesen kann. Bilder und Karten fliegen raus, die Kostenübersicht
// (<BudgetChart>) wird in gesprochene Zahlen übersetzt, aus <FaqItem q="…">
// wird die Frage als eigener Satz übernommen, Markdown-Syntax (Überschriften,
// Betonungen, Links …) wird auf den reinen Text reduziert.
export function postToSpeechText(
  post: Post,
  lang: Lang,
  labels: { qaTitle: string },
): string {
  let text = post.content;

  // <BudgetChart trip="…" /> → gesprochene Kostenübersicht statt Diagramm
  text = text.replace(/<BudgetChart\b([^>]*?)\/?>/g, (_match, attrs: string) => {
    const trip = attrs.match(/trip=["']([^"']+)["']/)?.[1] ?? "bali";
    return `\n\n${budgetToSpeechText(trip, lang)}\n\n`;
  });
  // <FaqItem q="Frage"> → Frage als eigener Satz behalten
  text = text.replace(/<FaqItem\s+q=["']([^"']*)["'][^>]*>/g, "\n$1.\n");
  // Übrige JSX-Komponenten (Karten, <Faq> …) komplett entfernen
  text = text.replace(/<\/?[A-Za-z][^>]*>/g, "");

  // Markdown-Bilder entfernen, Links auf ihren sichtbaren Text reduzieren
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Zeilenanfänge: Überschriften, Zitate, Listen- und Aufzählungszeichen
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}>\s?/gm, "");
  text = text.replace(/^\s{0,3}[-*+]\s+/gm, "");
  text = text.replace(/^\s{0,3}\d+\.\s+/gm, "");
  // Horizontale Linien, Inline-Code und Betonungen
  text = text.replace(/^\s*([-*_])\1{2,}\s*$/gm, "");
  text = text.replace(/`([^`]*)`/g, "$1");
  text = text.replace(/(\*\*|__|\*|_)/g, "");

  // FAQ aus dem Frontmatter (falls vorhanden) als Frage-Antwort-Block anhängen
  const faq = post.faq.map((f) => `${f.question} ${f.answer}`).join("\n");

  return [
    post.title,
    post.excerpt,
    text,
    faq && `${labels.qaTitle}. ${faq}`,
  ]
    .filter(Boolean)
    .join("\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

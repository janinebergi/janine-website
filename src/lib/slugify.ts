// Akzentbuchstaben, die in Reiseberichten regelmäßig vorkommen (Aït-Ben-Haddou,
// Ella, Málaga …). Ohne diese Zuordnung fällt der Buchstabe ersatzlos weg und
// aus "Aït" wird "a-t".
const REPLACEMENTS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => REPLACEMENTS[char] ?? char)
    // Zerlegt z. B. "ï" in "i" + Trema und wirft anschließend die
    // Akzentzeichen weg – der Grundbuchstabe bleibt erhalten.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

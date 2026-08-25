// Rendert strukturierte Daten (schema.org) als JSON-LD. Google liest damit
// Autor, Datum, Breadcrumbs und FAQ direkt aus – Grundlage für Rich Results.
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

// Beide Sprachfassungen des Feeds werden gleich ausgeliefert: als XML und mit
// einem Tag Cache, damit Leseprogramme den Feed nicht bei jedem Abruf neu vom
// Server holen.
export function feedResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}

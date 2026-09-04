/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],

    // Die Bilder liegen fest in public/assets und aendern sich nie: aendert
    // sich ein Bild, aendert sich sein Dateiname und damit die Adresse. Ohne
    // diese Zeile laeuft der Bild-Cache nach 60 Sekunden ab und jedes Bild
    // wird immer wieder neu optimiert. Das frisst das Vercel-Kontingent.
    minimumCacheTTL: 31536000,

    // Weniger Zwischengroessen bedeutet weniger Varianten, die optimiert und
    // gespeichert werden muessen. 1920px reicht fuer die groessten Bilder auf
    // der Seite; darueber wird leicht hochskaliert.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [128, 256, 384],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  // Die englischen Beiträge haben eigene, englische Slugs bekommen. Wer noch
  // die alte Adresse hat, wird dauerhaft (308) auf die neue geschickt.
  async redirects() {
    const renamedEnglishPosts = {
      "bali-reisebericht": "diving-bali",
      "harry-potter-tour-schottland": "harry-potter-tour-scotland",
      "marokko-wueste": "morocco-desert",
      "roadtrip-florida": "florida-road-trip",
      "sri-lanka-rundreise": "sri-lanka-road-trip",
      "surfcamp-portugal": "surf-camp-portugal",
    };

    return Object.entries(renamedEnglishPosts).map(([from, to]) => ({
      source: `/en/blog/${from}`,
      destination: `/en/blog/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

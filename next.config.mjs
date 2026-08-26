/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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

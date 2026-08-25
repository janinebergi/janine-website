import sharp from "sharp";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPostBySlug, formatDate } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";
import { OG_COLORS, OG_SIZE, coverImageDataUri, loadGoogleFont } from "@/lib/og";
import type { Lang } from "@/lib/i18n-constants";

export const size = OG_SIZE;
export const contentType = "image/jpeg";

// Die Karten werden beim Build erzeugt – je Sprachfassung eine, damit die
// englischen Beiträge auch englische Vorschaubilder bekommen.
export function createOpengraphImage(lang: Lang) {
  return async function OpengraphImage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const { site, pages } = getSiteContent(lang);
  const meta = [
    post.country,
    formatDate(post.date, lang),
    `${post.readingTime} ${pages.blog.readingTimeLong}`,
  ]
    .filter(Boolean)
    .join("  ·  ");
  const footer = site.url.replace(/^https?:\/\//, "");

  const [cover, displayFont, textFont] = await Promise.all([
    coverImageDataUri(post.coverImage, post.coverPosition),
    loadGoogleFont("Space Grotesk", 700, post.title),
    loadGoogleFont("Inter", 500, `${meta}${footer}${site.role}`),
  ]);

  const fonts = [
    displayFont && { name: "Space Grotesk", data: displayFont, weight: 700 as const, style: "normal" as const },
    textFont && { name: "Inter", data: textFont, weight: 500 as const, style: "normal" as const },
  ].filter((font): font is NonNullable<typeof font> => font !== null);

  const image = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: OG_COLORS.bg,
        }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
          />
        )}

        {/* Verlauf nach unten, damit die Schrift auf jedem Foto lesbar bleibt. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            backgroundImage: cover
              ? "linear-gradient(180deg, rgba(6,15,24,0.15) 0%, rgba(6,15,24,0.55) 40%, rgba(6,15,24,0.94) 100%)"
              : "linear-gradient(140deg, #0c1826 0%, #060f18 60%, #122c40 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 26,
              color: OG_COLORS.accentHover,
              letterSpacing: "0.02em",
            }}
          >
            {meta}
          </div>

          <div
            style={{
              marginTop: 20,
              fontFamily: "Space Grotesk",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: OG_COLORS.foreground,
              // Sehr lange Titel werden nach drei Zeilen abgeschnitten.
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {post.title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 40,
              paddingTop: 28,
              borderTop: `1px solid ${OG_COLORS.border}`,
              fontFamily: "Inter",
              fontSize: 28,
              color: OG_COLORS.muted,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 8,
                height: 34,
                borderRadius: 4,
                backgroundColor: OG_COLORS.accent,
              }}
            />
            <div style={{ display: "flex", color: OG_COLORS.foreground }}>{footer}</div>
            <div style={{ display: "flex" }}>·</div>
            <div style={{ display: "flex" }}>{site.role}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );

  // ImageResponse liefert nur PNG – bei Fotos sind das schnell über 1 MB, was
  // z. B. WhatsApp-Vorschauen sprengt. Als JPEG bleibt die Karte bei ~150 KB.
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 82, progressive: true }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, immutable, no-transform, max-age=31536000",
    },
  });
  };
}

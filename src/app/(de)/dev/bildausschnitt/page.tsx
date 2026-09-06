import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";
import { getHeroImages } from "@/lib/hero-images";
import { BildausschnittTool } from "@/components/dev/bildausschnitt-tool";
import type { CoverPost } from "@/components/dev/cover-editor";

export const metadata: Metadata = { title: "Bildausschnitte", robots: "noindex" };

// Werkzeug zum Einstellen der Bildausschnitte. Läuft nur lokal: im Deployment
// ist das Dateisystem nicht beschreibbar und die Seite hätte dort nichts verloren.
export default function BildausschnittPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const posts: CoverPost[] = getAllPosts("de").map((post) => ({
    id: post.id,
    title: post.title,
    coverImage: post.coverImage,
    coverPosition: post.coverPosition ?? null,
    coverPositionMobile: post.coverPositionMobile ?? null,
    coverPositionTile: post.coverPositionTile ?? null,
  }));

  return <BildausschnittTool posts={posts} heroes={getHeroImages()} />;
}

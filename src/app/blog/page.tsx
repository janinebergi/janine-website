import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Geschichten und Tipps rund ums Reisen — und Gedanken zu Copywriting. Persönlich von Janine Bergmann.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Blog</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Geschichten und Tipps rund ums Reisen.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Reisen ist meine Inspiration, Schreiben meine Leidenschaft. Hier
              teile ich Routen, Budgets und Abenteuer – und ab und zu Gedanken
              zum Copywriting.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-muted">Bald gibt es hier die ersten Artikel.</p>
          ) : (
            <div className="flex flex-col gap-12">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface/60 md:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="text-accent-hover">Neuester Beitrag</span>
                      <span>·</span>
                      <span>{formatDate(featured.date)}</span>
                      <span>·</span>
                      <span>{featured.readingTime} Min. Lesezeit</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold leading-snug group-hover:text-accent-hover">
                      {featured.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted">
                      {featured.excerpt}
                    </p>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <span>{formatDate(post.date)}</span>
                          <span>·</span>
                          <span>{post.readingTime} Min.</span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent-hover">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

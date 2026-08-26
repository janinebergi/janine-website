import Image from "next/image";
import Link from "next/link";
import { Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { getAllPosts, formatDate } from "@/lib/blog";
import { blogPath, postPath } from "@/lib/routes";

export async function ContactPage({ lang }: { lang: Lang }) {
  const { pages, site } = getSiteContent(lang);
  const t = pages.kontakt;
  const posts = getAllPosts(lang).slice(0, 3);

  const points = [
    {
      icon: Mail,
      title: t.emailTitle,
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: Clock,
      title: t.responseTitle,
      value: t.responseValue,
    },
    {
      icon: MessageCircle,
      title: t.callTitle,
      value: t.callValue,
    },
  ];

  return (
    <>
      <PageHeader
        image={t.heroImage}
        imageAlt={t.heroImageAlt}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-lg leading-relaxed text-muted">{t.heroText}</p>

              <div className="mt-10 flex flex-col gap-5">
                {points.map((p) => {
                  const Icon = p.icon;
                  const content = (
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
                        <Icon size={18} />
                      </span>
                      <div>
                        <div className="text-sm text-muted">{p.title}</div>
                        <div className="font-medium">{p.value}</div>
                      </div>
                    </div>
                  );
                  return p.href ? (
                    <a key={p.title} href={p.href} className="transition-opacity hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    <div key={p.title}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface/60 p-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-border py-16 sm:py-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm text-accent-hover">{t.blogEyebrow}</p>
                <h2 className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">
                  {t.blogTitle}
                </h2>
              </div>
              <Link
                href={blogPath(lang)}
                className="hidden flex-none items-center gap-2 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80 sm:inline-flex"
              >
                {t.allPostsLabel}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={postPath(lang, post.slug)}
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
                      <span>{formatDate(post.date, lang)}</span>
                      <span>·</span>
                      <span>{post.readingTime} {pages.blog.readingTimeShort}</span>
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

            <Link
              href={blogPath(lang)}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80 sm:hidden"
            >
              {t.allPostsLabel}
              <ArrowRight size={16} />
            </Link>
          </Container>
        </section>
      )}
    </>
  );
}

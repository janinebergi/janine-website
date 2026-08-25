import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site";
import type { Lang } from "@/lib/i18n-constants";
import { blogPath, homePath } from "@/lib/routes";

export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = getSiteContent(lang).pages.notFound;

  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="text-7xl font-semibold text-accent">404</span>
        <h1 className="mt-4 text-3xl font-semibold">{t.title}</h1>
        <p className="mt-3 max-w-md text-muted">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={homePath(lang)}>{t.homeCta}</Button>
          <Button href={blogPath(lang)} variant="secondary">
            {t.blogCta}
          </Button>
        </div>
      </Container>
    </section>
  );
}

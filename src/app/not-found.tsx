import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10" />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="text-7xl font-semibold text-accent">404</span>
        <h1 className="mt-4 text-3xl font-semibold">Seite nicht gefunden</h1>
        <p className="mt-3 max-w-md text-muted">
          Diese Seite existiert nicht (mehr). Vielleicht findest du, was du
          suchst, auf der Startseite.
        </p>
        <div className="mt-8">
          <Button href="/">Zur Startseite</Button>
        </div>
      </Container>
    </section>
  );
}

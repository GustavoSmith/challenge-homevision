import { PropertiesFeed } from "@/components/properties-feed";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-background to-muted/40"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-32 h-96 w-96 rounded-full bg-accent/50 blur-3xl" />
      </div>

      <header className="border-b border-border/70 bg-card/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-3xl space-y-3 border-l-4 border-primary pl-5 sm:pl-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Homevision
            </p>
            <h1 className="text-3xl font-medium sm:text-4xl">Curated listings</h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Browse homes with infinite scroll. Each batch loads on demand so the page stays fast
              and responsive.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <PropertiesFeed />
      </main>
    </div>
  );
}

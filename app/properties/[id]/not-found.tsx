import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-background to-muted/40"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-medium">Property not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The property you are looking for does not exist or could not be loaded.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to listings
        </Link>
      </div>
    </div>
  );
}

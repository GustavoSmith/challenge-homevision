import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft } from "lucide-react";

import type { House } from "@/lib/houses";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PropertyDetail({ house }: { house: House }) {
  const imageTransitionName = `property-image-${house.id}`;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-background to-muted/40"
      />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to listings
        </Link>

        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm ring-1 ring-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <ViewTransition name={imageTransitionName}>
              <div className="property-transition-media relative aspect-[4/3] w-full bg-muted md:aspect-auto md:min-h-[400px]">
                <Image
                  src={house.photoURL}
                  alt={house.address}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ViewTransition>

            <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Property
                </p>
                <h1 className="text-2xl font-medium sm:text-3xl">
                  {house.address}
                </h1>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Owner
                </p>
                <p className="text-base sm:text-lg">{house.homeowner}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Price
                </p>
                <p className="text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
                  {priceFormatter.format(house.price)}
                </p>
              </div>

              <p className="text-xs tabular-nums text-muted-foreground">
                ID #{house.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

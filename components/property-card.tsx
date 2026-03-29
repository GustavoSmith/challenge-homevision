"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ViewTransition } from "react";

import { PropertyImage } from "@/components/property-image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PROPERTY_LISTING_RETURN_KEY, type House } from "@/lib/houses";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PropertyCard({ house }: { house: House }) {
  const queryClient = useQueryClient();
  const imageTransitionName = `property-image-${house.id}`;

  return (
    <Link
      href={`/properties/${house.id}`}
      onClick={() => {
        // This is a small hack to allow the user to go back to the property listing page without losing the position the user was at without causing bugs when the first navigation is to the property detail page.
        sessionStorage.setItem(PROPERTY_LISTING_RETURN_KEY, String(house.id));
        queryClient.setQueryData(["house", house.id], house);
      }}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="h-full overflow-hidden shadow-sm ring-1 ring-border/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30">
        <ViewTransition name={imageTransitionName}>
          <div className="property-transition-media relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <PropertyImage
              src={house.photoURL}
              alt={house.address}
              className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
              fallbackClassName="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
              iconClassName="h-12 w-12"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        </ViewTransition>
        <CardHeader className="border-b border-border/50 pb-3">
          <CardTitle className="line-clamp-2 text-lg font-medium sm:text-xl">
            {house.address}
          </CardTitle>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Owner
            </p>
            <p className="line-clamp-1 text-sm">{house.homeowner}</p>
          </div>
        </CardHeader>
        <CardContent className="pb-0 pt-2">
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {priceFormatter.format(house.price)}
          </p>
        </CardContent>
        <CardFooter className="mt-auto border-0 bg-transparent pt-0">
          <span className="text-xs tabular-nums text-muted-foreground">ID #{house.id}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}

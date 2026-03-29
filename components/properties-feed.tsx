"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { PER_PAGE, fetchHousesPage } from "@/lib/houses";

import { PropertyCard } from "./property-card";
import { PropertyCardSkeleton } from "./property-card-skeleton";
const SKELETON_INITIAL = 6;
const SKELETON_MORE = 3;

const grid =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function PropertiesFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isPending,
    isSuccess,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["houses", PER_PAGE],
    queryFn: ({ pageParam }) => fetchHousesPage(pageParam as number, PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.houses.length === 0) return undefined;
      if (lastPage.houses.length < PER_PAGE) return undefined;
      return (lastPageParam as number) + 1;
    },
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchNextPageError
        ) {
          void fetchNextPage();
        }
      },
      { rootMargin: "280px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  const houses = data?.pages.flatMap((p) => p.houses) ?? [];

  if (isPending) {
    return (
      <div className={grid}>
        {Array.from({ length: SKELETON_INITIAL }, (_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError && houses.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm"
        role="alert"
      >
        <p className="max-w-md text-sm text-muted-foreground">
          We ran into a problem while loading the properties. Please try again.
        </p>
        <Button type="button" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (isSuccess && houses.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">No properties to show.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={grid}>
        {houses.map((house, idx) => (
          <PropertyCard key={`${house.id}-${idx}`} house={house} />
        ))}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-1 w-full" />

      {isFetchNextPageError ? (
        <div
          className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm"
          role="alert"
        >
          <p className="max-w-md text-sm text-muted-foreground">
            We had a problem while loading more properties. Please try again.
          </p>
          <Button type="button" onClick={() => void fetchNextPage()}>
            Try again
          </Button>
        </div>
      ) : null}

      {isFetchingNextPage ? (
        <div className={grid}>
          {Array.from({ length: SKELETON_MORE }, (_, i) => (
            <PropertyCardSkeleton key={`more-${i}`} />
          ))}
        </div>
      ) : null}

      {hasNextPage === false && houses.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          You have reached the end of the list.
        </p>
      ) : null}
    </div>
  );
}

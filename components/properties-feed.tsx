"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { fetchHousesPage } from "@/lib/houses";

import { PropertyCard } from "./property-card";
import { PropertyCardSkeleton } from "./property-card-skeleton";

const PER_PAGE = 20;
const SKELETON_INITIAL = 6;
const SKELETON_MORE = 3;

const grid =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function PropertiesFeed() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
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
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "280px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  if (isError) {
    const msg = error instanceof Error ? error.message : "Something went wrong. Try again!";
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm"
        role="alert"
      >
        <p className="max-w-md text-sm text-destructive">{msg}</p>
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

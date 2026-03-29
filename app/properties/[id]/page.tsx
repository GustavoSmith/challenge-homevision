"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use } from "react";

import { PropertyDetail } from "@/components/property-detail";
import { fetchHouseById } from "@/lib/houses";

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = Number(rawId);

  if (!Number.isFinite(id) || id < 0 || !Number.isInteger(id)) {
    notFound();
  }

  return <ResolvedProperty id={id} />;
}

function ResolvedProperty({ id }: { id: number }) {
  const {
    data: house,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["house", id],
    queryFn: () => fetchHouseById(id),
    staleTime: 60_000,
  });

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (isError || house === null || house === undefined) {
    notFound();
  }

  return <PropertyDetail house={house} />;
}

function DetailSkeleton() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm ring-1 ring-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/3] w-full animate-pulse bg-muted md:aspect-auto md:min-h-[400px]" />
            <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-10 animate-pulse rounded bg-muted" />
                <div className="h-10 w-2/5 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

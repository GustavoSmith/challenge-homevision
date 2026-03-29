"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";

import { PropertyDetail } from "@/components/property-detail";
import { Button } from "@/components/ui/button";
import { type House, fetchHouseById } from "@/lib/houses";

export default function PropertyPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);

  if (!Number.isFinite(id) || id < 0 || !Number.isInteger(id)) {
    notFound();
  }

  return <ResolvedProperty id={id} />;
}

function ResolvedProperty({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["house", id] as const;
  const cachedHouse = queryClient.getQueryData<House>(queryKey);
  const cachedHouseUpdatedAt = queryClient.getQueryState<House>(queryKey)?.dataUpdatedAt;
  const {
    data: house,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => fetchHouseById(id),
    staleTime: 60_000,
    initialData: cachedHouse,
    initialDataUpdatedAt: cachedHouseUpdatedAt,
  });

  if (isPending && house === undefined) {
    return <DetailSkeleton />;
  }

  if (house) {
    return <PropertyDetail house={house} />;
  }

  if (house === null) {
    notFound();
  }

  if (isError) {
    return (
      <DetailErrorState
        isRetrying={isFetching}
        message="We couldn't load this property right now. Please try again."
        onRetry={() => void refetch()}
      />
    );
  }

  return <DetailSkeleton />;
}

function DetailSkeleton() {
  return (
    <div
      data-testid="detail-loading"
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
    >
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

function DetailErrorState({
  isRetrying,
  message,
  onRetry,
}: {
  isRetrying: boolean;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-background to-muted/40"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm"
          role="alert"
        >
          <p className="max-w-md text-sm text-muted-foreground">{message}</p>
          <Button type="button" className="gap-2" onClick={onRetry} disabled={isRetrying}>
            Try again
            {isRetrying ? (
              <span
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
}

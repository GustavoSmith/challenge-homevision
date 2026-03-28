import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden shadow-sm ring-1 ring-border/70">
      <div className="relative aspect-[4/3] w-full">
        <Skeleton className="absolute inset-0 size-full rounded-none" />
      </div>
      <CardHeader className="border-b border-border/50 pb-3">
        <Skeleton className="h-5 w-[92%]" />
        <Skeleton className="mt-2 h-4 w-3/5" />
      </CardHeader>
      <CardContent className="pb-0 pt-2">
        <Skeleton className="h-8 w-2/5" />
      </CardContent>
      <CardFooter className="mt-auto border-0 bg-transparent pt-0">
        <Skeleton className="h-3 w-16" />
      </CardFooter>
    </Card>
  );
}

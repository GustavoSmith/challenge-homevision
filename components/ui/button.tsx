import * as React from "react";

import { cn } from "@/lib/utils";

export function Button({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export function EmptyState({
  title,
  description,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 px-6 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-3 rounded-full bg-muted p-3">
        <Inbox className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

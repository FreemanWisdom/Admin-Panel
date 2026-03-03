import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "focus-ring h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

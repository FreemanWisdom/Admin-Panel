"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted",
        className,
      )}
    >
      {src ? <AvatarPrimitive.Image src={src} alt={alt} className="size-full" /> : null}
      <AvatarPrimitive.Fallback className="text-sm font-semibold text-muted-foreground">
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow",
        outline:
          "border-border bg-transparent text-foreground hover:bg-muted",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-muted",
        success:
          "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow",
        danger:
          "border-transparent bg-danger text-danger-foreground shadow-sm hover:bg-danger/90 hover:shadow",
        icon: "border-border bg-transparent text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const computedSize = size ?? (variant === "icon" ? "icon" : undefined);
  const accessibleLabel =
    props["aria-label"] ?? (typeof children === "string" ? children : undefined);

  return (
    <Comp
      className={cn(buttonVariants({ variant, size: computedSize }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={accessibleLabel}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </Comp>
  );
}

export { Button, buttonVariants };

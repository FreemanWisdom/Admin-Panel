import { cva, type VariantProps } from "class-variance-authority";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative rounded-xl border bg-surface text-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm hover:shadow-card",
        stat: "border-border shadow-sm hover:shadow-card",
        modal: "border-border bg-surface shadow-card",
        analytics: "border-border shadow-card",
        action:
          "border-border bg-gradient-to-br from-surface to-muted/40 shadow-sm hover:-translate-y-0.5 hover:shadow-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type StatTrend = "up" | "down" | "neutral";

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  statTitle?: React.ReactNode;
  statValue?: React.ReactNode;
  statChange?: React.ReactNode;
  statChangeLabel?: React.ReactNode;
  statIcon?: React.ReactNode;
  statTrend?: StatTrend;
}

const statTrendClasses: Record<StatTrend, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
  neutral: "text-muted-foreground",
};

function getStatTrendIcon(trend: StatTrend) {
  if (trend === "up") {
    return <TrendingUp className="size-3.5" aria-hidden />;
  }

  if (trend === "down") {
    return <TrendingDown className="size-3.5" aria-hidden />;
  }

  return null;
}

export function Card({
  className,
  variant = "default",
  statTitle,
  statValue,
  statChange,
  statChangeLabel,
  statIcon,
  statTrend = "neutral",
  children,
  ...props
}: CardProps) {
  const useStatLayout =
    variant === "stat" &&
    (statTitle !== undefined ||
      statValue !== undefined ||
      statChange !== undefined ||
      statIcon !== undefined);

  if (useStatLayout) {
    return (
      <div className={cn(cardVariants({ variant }), "p-5 sm:p-6", className)} {...props}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{statTitle}</p>
            <p className="text-2xl font-semibold tracking-tight">{statValue}</p>
          </div>
          {statIcon ? (
            <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5">
              {statIcon}
            </div>
          ) : null}
        </div>

        {statChange !== undefined || statChangeLabel !== undefined || children ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            {statChange !== undefined || statChangeLabel !== undefined ? (
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  statTrendClasses[statTrend],
                )}
              >
                {getStatTrendIcon(statTrend)}
                {statChange !== undefined ? <span>{statChange}</span> : null}
                {statChangeLabel !== undefined ? (
                  <span className="text-muted-foreground">{statChangeLabel}</span>
                ) : null}
              </p>
            ) : null}
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("space-y-1 p-6", className)} {...props} />;
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("font-heading text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { cardVariants };

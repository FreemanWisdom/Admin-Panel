"use client";

import { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { cn } from "@/lib/utils";

import { ChartTimeRange, normalizeChartRange } from "./chart-utils";

interface ChartShellProps {
  title?: string;
  description?: string;
  range: ChartTimeRange;
  onRangeChange: (range: ChartTimeRange) => void;
  showRangeSelector?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function ChartShell({
  title,
  description,
  range,
  onRangeChange,
  showRangeSelector = true,
  className,
  contentClassName,
  children,
}: ChartShellProps) {
  const showHeader = Boolean(title || description || showRangeSelector);

  return (
    <Card variant="analytics" className={cn("overflow-hidden", className)}>
      {showHeader ? (
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {showRangeSelector ? (
            <TimeRangeSelector
              value={range}
              onChange={(nextRange) => onRangeChange(normalizeChartRange(nextRange, range))}
            />
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(showHeader ? "" : "pt-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}


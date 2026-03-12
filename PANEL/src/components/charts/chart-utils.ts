import { formatDateShort } from "@/lib/utils";
import { TimeRange } from "@/types";

export type ChartTimeRange = "day" | "week" | "month" | "year";

const RANGE_IN_MS: Record<ChartTimeRange, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

const RANGE_POINT_FALLBACK: Record<ChartTimeRange, number> = {
  day: 24,
  week: 7,
  month: 30,
  year: 12,
};

export const DEFAULT_CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--danger))",
];

export const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--surface))",
  color: "hsl(var(--foreground))",
};

export function normalizeChartRange(
  range: TimeRange | undefined,
  fallback: ChartTimeRange = "month",
): ChartTimeRange {
  if (range === "day" || range === "week" || range === "month" || range === "year") {
    return range;
  }

  return fallback;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function filterDataByRange<T extends object>(
  data: T[],
  range: ChartTimeRange,
  xKey: string,
): T[] {
  if (data.length <= 1) {
    return data;
  }

  const withDates = data.map((point) => ({
    point,
    date: toDate((point as Record<string, unknown>)[xKey]),
  }));
  const hasFullDateSeries = withDates.every((entry) => entry.date !== null);

  if (hasFullDateSeries) {
    const latest = withDates.reduce((latestDate, entry) => {
      const entryDate = entry.date as Date;
      return entryDate.getTime() > latestDate.getTime() ? entryDate : latestDate;
    }, withDates[0].date as Date);

    const start = new Date(latest.getTime() - RANGE_IN_MS[range]);
    const filtered = withDates
      .filter((entry) => (entry.date as Date).getTime() >= start.getTime())
      .map((entry) => entry.point);

    if (filtered.length > 0) {
      return filtered;
    }
  }

  const maxPoints = RANGE_POINT_FALLBACK[range];
  return data.slice(-Math.min(data.length, maxPoints));
}

export function formatRangeLabel(
  value: unknown,
  range: ChartTimeRange,
): string {
  const parsedDate = toDate(value);
  if (!parsedDate) {
    return String(value ?? "");
  }

  if (range === "day") {
    return parsedDate.toLocaleTimeString("en-US", { hour: "numeric" });
  }

  if (range === "year") {
    return parsedDate.toLocaleString("en-US", { month: "short" });
  }

  return formatDateShort(parsedDate.toISOString());
}

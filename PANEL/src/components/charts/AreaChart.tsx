"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TimeRange } from "@/types";

import { ChartShell } from "./ChartShell";
import {
  ChartTimeRange,
  DEFAULT_CHART_COLORS,
  chartTooltipStyle,
  filterDataByRange,
  formatRangeLabel,
  normalizeChartRange,
} from "./chart-utils";

export type AreaChartDatum = object;

export interface AreaChartSeries {
  key: string;
  label: string;
  color?: string;
  strokeWidth?: number;
}

interface AreaChartProps {
  data: AreaChartDatum[];
  series: AreaChartSeries[];
  title?: string;
  description?: string;
  xKey?: string;
  range?: TimeRange;
  defaultRange?: ChartTimeRange;
  onRangeChange?: (range: ChartTimeRange) => void;
  showRangeSelector?: boolean;
  height?: number;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function AreaChart({
  data,
  series,
  title,
  description,
  xKey = "date",
  range,
  defaultRange = "month",
  onRangeChange,
  showRangeSelector = true,
  height = 320,
  className,
  valueFormatter,
}: AreaChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const controlledRange = range
    ? normalizeChartRange(range, defaultRange)
    : undefined;
  const [internalRange, setInternalRange] = useState<ChartTimeRange>(
    controlledRange ?? defaultRange,
  );
  const activeRange = controlledRange ?? internalRange;

  const handleRangeChange = (nextRange: ChartTimeRange) => {
    if (!controlledRange) {
      setInternalRange(nextRange);
    }
    onRangeChange?.(nextRange);
  };

  const filteredData = useMemo(
    () => filterDataByRange(data, activeRange, xKey),
    [data, activeRange, xKey],
  );

  const normalizedSeries = useMemo(
    () =>
      series.map((entry, index) => ({
        ...entry,
        color: entry.color ?? DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
        strokeWidth: entry.strokeWidth ?? 2.5,
      })),
    [series],
  );

  const formatValue =
    valueFormatter ?? ((value: number) => Number(value).toLocaleString());

  return (
    <ChartShell
      title={title}
      description={description}
      range={activeRange}
      onRangeChange={handleRangeChange}
      showRangeSelector={showRangeSelector}
      className={className}
      contentClassName="pt-0"
    >
      <motion.div
        key={activeRange}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ height }}
      >
        {filteredData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={filteredData}
              margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
            >
              <defs>
                {normalizedSeries.map((entry) => (
                  <linearGradient
                    id={`${gradientId}-${entry.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    key={`${gradientId}-${entry.key}`}
                  >
                    <stop offset="5%" stopColor={entry.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={entry.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="hsl(var(--chart-grid))"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                tickFormatter={(value) => formatRangeLabel(value, activeRange)}
                tick={{ fill: "hsl(var(--chart-axis))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatValue(Number(value))}
                tick={{ fill: "hsl(var(--chart-axis))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                labelFormatter={(value) => formatRangeLabel(value, activeRange)}
                formatter={(value: number | string | undefined, name: string | undefined) => [
                  formatValue(Number(value ?? 0)),
                  name ?? "",
                ]}
              />
              {normalizedSeries.length > 1 ? (
                <Legend verticalAlign="top" height={28} />
              ) : null}
              {normalizedSeries.map((entry) => (
                <Area
                  key={entry.key}
                  type="monotone"
                  dataKey={entry.key}
                  name={entry.label}
                  stroke={entry.color}
                  strokeWidth={entry.strokeWidth}
                  fill={`url(#${gradientId}-${entry.key})`}
                  fillOpacity={1}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </ChartShell>
  );
}

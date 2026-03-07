"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart as RechartsBarChart,
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

export type BarChartDatum = object;

export interface BarChartSeries {
  key: string;
  label: string;
  color?: string;
}

interface BarChartProps {
  data: BarChartDatum[];
  series: BarChartSeries[];
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

export function BarChart({
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
}: BarChartProps) {
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
            <RechartsBarChart
              data={filteredData}
              margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
            >
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
                <Bar
                  key={entry.key}
                  dataKey={entry.key}
                  name={entry.label}
                  fill={entry.color}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </ChartShell>
  );
}

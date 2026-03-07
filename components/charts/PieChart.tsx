"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { TimeRange } from "@/types";

import { ChartShell } from "./ChartShell";
import {
  ChartTimeRange,
  DEFAULT_CHART_COLORS,
  chartTooltipStyle,
  filterDataByRange,
  normalizeChartRange,
} from "./chart-utils";

export type PieChartDatum = object;

interface PieChartProps {
  data: PieChartDatum[];
  title?: string;
  description?: string;
  nameKey?: string;
  valueKey?: string;
  colorKey?: string;
  xKey?: string;
  range?: TimeRange;
  defaultRange?: ChartTimeRange;
  onRangeChange?: (range: ChartTimeRange) => void;
  showRangeSelector?: boolean;
  height?: number;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function PieChart({
  data,
  title,
  description,
  nameKey = "name",
  valueKey = "value",
  colorKey = "color",
  xKey = "date",
  range,
  defaultRange = "month",
  onRangeChange,
  showRangeSelector = true,
  height = 320,
  className,
  valueFormatter,
}: PieChartProps) {
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

  const pieData = useMemo(
    () =>
      filteredData.map((entry, index) => {
        const record = entry as Record<string, unknown>;
        const numericValue = Number(record[valueKey] ?? 0);
        const color =
          typeof record[colorKey] === "string"
            ? record[colorKey]
            : DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];

        return {
          ...record,
          [valueKey]: Number.isFinite(numericValue) ? numericValue : 0,
          __resolvedColor: color,
        };
      }),
    [filteredData, valueKey, colorKey],
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
        {pieData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                dataKey={valueKey}
                nameKey={nameKey}
                innerRadius={64}
                outerRadius={96}
                paddingAngle={3}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`pie-cell-${index}`}
                    fill={entry.__resolvedColor as string}
                    stroke="hsl(var(--surface))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number | string | undefined, name: string | undefined) => [
                  formatValue(Number(value ?? 0)),
                  name ?? "",
                ]}
              />
              <Legend verticalAlign="bottom" height={32} />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </ChartShell>
  );
}

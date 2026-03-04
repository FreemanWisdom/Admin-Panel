"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DailyUsersPoint, TimeRange } from "@/types";
import { formatDate } from "@/lib/utils";

interface DailyUsersBarChartProps {
  data: DailyUsersPoint[];
  range?: TimeRange;
}

export function DailyUsersBarChart({ data, range = "month" }: DailyUsersBarChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => {
              if (range === "day") {
                return `${new Date(value).getHours()}:00`;
              }
              if (range === "year") {
                return new Date(value).toLocaleString("default", { month: "short" });
              }
              return formatDate(value).split(",")[0];
            }}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--surface))",
            }}
            labelFormatter={(value) => formatDate(value as string)}
            formatter={(value) => [Number(value).toLocaleString(), "Users"]}
          />
          <Bar
            dataKey="users"
            fill="hsl(var(--secondary))"
            radius={[8, 8, 0, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

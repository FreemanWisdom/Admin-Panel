"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { useTimeRange } from "@/hooks/use-time-range";
import { getOrderGrowth, getOrderStatusDistribution } from "@/lib/api";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export function OrderAnalytics() {
    const { range, setRange } = useTimeRange();

    const growthQuery = useQuery({
        queryKey: ["order-growth", range],
        queryFn: () => getOrderGrowth(range),
    });

    const distributionQuery = useQuery({
        queryKey: ["order-status-distribution"],
        queryFn: getOrderStatusDistribution,
    });

    const isLoading = growthQuery.isLoading || distributionQuery.isLoading;

    const totalOrders = growthQuery.data?.reduce((sum, p) => sum + p.orders, 0) ?? 0;
    const avgOrders = totalOrders > 0 ? (totalOrders / (growthQuery.data?.length ?? 1)).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Order Insights</h2>
                    <p className="text-muted-foreground text-sm">Monitor order volume and processing efficiency.</p>
                </div>
                <TimeRangeSelector value={range} onChange={setRange} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Orders"
                    value={totalOrders.toLocaleString()}
                    icon={ShoppingBag}
                    trend="+12.5%"
                    loading={isLoading}
                    delay={0}
                />
                <MetricCard
                    title="Avg. Daily Orders"
                    value={avgOrders.toString()}
                    icon={TrendingUp}
                    trend="+5.2%"
                    loading={isLoading}
                    delay={0.1}
                />
                <MetricCard
                    title="Est. Revenue"
                    value={formatCurrency(totalOrders * 125)}
                    icon={DollarSign}
                    trend="+8.1%"
                    loading={isLoading}
                    delay={0.2}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-muted-foreground">Orders over time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? (
                            <Skeleton className="h-full w-full rounded-lg" />
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={range}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={growthQuery.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="hsl(var(--chart-grid))"
                                                opacity={0.4}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                stroke="hsl(var(--chart-axis))"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={formatDateShort}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="hsl(var(--chart-axis))"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}`}
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-surface border-border rounded-lg border p-2 shadow-md backdrop-blur-sm">
                                                                <p className="text-xs font-medium text-muted-foreground">
                                                                    {formatDateShort(payload[0].payload.date)}
                                                                </p>
                                                                <p className="text-sm font-bold text-emerald-500">
                                                                    {payload[0].value} Orders
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="orders"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorOrders)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-muted-foreground">Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? (
                            <Skeleton className="h-full w-full rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionQuery.data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {distributionQuery.data?.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="hsl(var(--surface))"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    loading,
    delay
}: {
    title: string;
    value: string;
    icon: any;
    trend: string;
    loading: boolean;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-8 w-24" />
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{value}</div>
                            <p className="text-xs text-emerald-500 font-medium">
                                {trend} <span className="text-muted-foreground ml-1">from last period</span>
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

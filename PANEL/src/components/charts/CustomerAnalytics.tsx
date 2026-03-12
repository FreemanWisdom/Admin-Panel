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
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Users, ShieldCheck, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { useTimeRange } from "@/hooks/use-time-range";
import { getCustomerGrowth, getCustomerStatusDistribution } from "@/lib/api";
import { formatDateShort } from "@/lib/utils";

export function CustomerAnalytics() {
    const { range, setRange } = useTimeRange();

    const growthQuery = useQuery({
        queryKey: ["customer-growth", range],
        queryFn: () => getCustomerGrowth(range),
    });

    const distributionQuery = useQuery({
        queryKey: ["customer-status-distribution"],
        queryFn: getCustomerStatusDistribution,
    });

    const isLoading = growthQuery.isLoading || distributionQuery.isLoading;

    const totalCustomers = 18342; // Mock total
    const verifiedRate = "92.4%";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customer Growth</h2>
                    <p className="text-muted-foreground text-sm">Analyze user acquisition and account verification trends.</p>
                </div>
                <TimeRangeSelector value={range} onChange={setRange} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Customers"
                    value={totalCustomers.toLocaleString()}
                    icon={Users}
                    trend="+8.2%"
                    loading={isLoading}
                    delay={0}
                />
                <MetricCard
                    title="Verified Status"
                    value={verifiedRate}
                    icon={ShieldCheck}
                    trend="+1.4%"
                    loading={isLoading}
                    delay={0.1}
                />
                <MetricCard
                    title="New Growth"
                    value="+1,240"
                    icon={UserPlus}
                    trend="+12.1%"
                    loading={isLoading}
                    delay={0.2}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-muted-foreground">User Growth Over Time</CardTitle>
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
                                        <AreaChart data={growthQuery.data}>
                                            <defs>
                                                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="date"
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={formatDateShort}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}`}
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="surface border-border rounded-lg border p-2 shadow-md">
                                                                <p className="text-xs font-medium text-muted-foreground">
                                                                    {formatDateShort(payload[0].payload.date)}
                                                                </p>
                                                                <p className="text-sm font-bold text-violet-500">
                                                                    {payload[0].value} New Users
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="customers"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorCustomers)"
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
                        <CardTitle className="text-base font-medium text-muted-foreground">Account Breakdown</CardTitle>
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
                                            <Cell key={`cell-${index}`} fill={entry.color} />
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
                                {trend} <span className="text-muted-foreground ml-1">increase</span>
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

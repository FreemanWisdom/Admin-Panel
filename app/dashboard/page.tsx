"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Activity, DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { motion, Variants } from "framer-motion";

import {
  getDailyUsersSeries,
  getDashboardStats,
  getRecentOrders,
  getRevenueSeries,
  getMapData,
} from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useTimeRange } from "@/hooks/use-time-range";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";

const RevenueAreaChart = dynamic(
  () =>
    import("@/components/charts/RevenueAreaChart").then(
      (module) => module.RevenueAreaChart,
    ),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> },
);

const DailyUsersBarChart = dynamic(
  () =>
    import("@/components/charts/DailyUsersBarChart").then(
      (module) => module.DailyUsersBarChart,
    ),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> },
);

const WorldMap = dynamic(
  () =>
    import("@/components/charts/WorldMap").then((module) => module.WorldMap),
  { ssr: false, loading: () => <Skeleton className="h-[340px] w-full" /> },
);

const statusVariantMap = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
} as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function DashboardPage() {
  const { range: revenueRange, setRange: setRevenueRange } = useTimeRange("month");
  const { range: usersRange, setRange: setUsersRange } = useTimeRange("month");

  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const revenueQuery = useQuery({
    queryKey: ["revenue-series", revenueRange],
    queryFn: () => getRevenueSeries(revenueRange),
  });

  const dailyUsersQuery = useQuery({
    queryKey: ["daily-users-series", usersRange],
    queryFn: () => getDailyUsersSeries(usersRange),
  });

  const recentOrdersQuery = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrders(6),
  });

  const mapQuery = useQuery({
    queryKey: ["map-data"],
    queryFn: () => getMapData("month"),
  });

  const isError =
    statsQuery.isError ||
    revenueQuery.isError ||
    dailyUsersQuery.isError ||
    recentOrdersQuery.isError;

  if (isError) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description="Unable to load dashboard data right now."
      />
    );
  }

  const stats = statsQuery.data;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ? stats.totalUsers.toLocaleString() : "-",
      helper: "+4.2% from last week",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Orders",
      value: stats?.orders ? stats.orders.toLocaleString() : "-",
      helper: "+2.7% from yesterday",
      icon: ShoppingCart,
      color: "text-violet-500",
    },
    {
      title: "Revenue",
      value: stats?.revenue ? formatCurrency(stats.revenue) : "-",
      helper: "+8.5% from last month",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions ? stats.activeSessions.toLocaleString() : "-",
      helper: "121 live now",
      icon: Activity,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards with stagger animation */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))
          : statCards.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{item.title}</CardDescription>
                  <div className={`rounded-md bg-muted p-1.5 ${item.color}`}>
                    <item.icon className="size-3.5" aria-hidden />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                    <TrendingUp className="size-3" />
                    {item.helper}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>
                {revenueRange === "day" ? "Last 24 hours" :
                  revenueRange === "week" ? "Last 7 days" :
                    revenueRange === "month" ? "Last 14 days" : "Last 12 months"}
              </CardDescription>
            </div>
            <TimeRangeSelector value={revenueRange} onChange={setRevenueRange} />
          </CardHeader>
          <CardContent>
            {revenueQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <RevenueAreaChart data={revenueQuery.data ?? []} range={revenueRange} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daily Users</CardTitle>
              <CardDescription>
                {usersRange === "day" ? "Hourly today" :
                  usersRange === "week" ? "Last 7 days" :
                    usersRange === "month" ? "Last 10 days" : "Last 12 months"}
              </CardDescription>
            </div>
            <TimeRangeSelector value={usersRange} onChange={setUsersRange} />
          </CardHeader>
          <CardContent>
            {dailyUsersQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <DailyUsersBarChart data={dailyUsersQuery.data ?? []} range={usersRange} />
            )}
          </CardContent>
        </Card>
      </section>

      {/* World Map */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Global Orders Distribution</CardTitle>
            <CardDescription>Order volume by country · Hover markers for details</CardDescription>
          </CardHeader>
          <CardContent>
            {mapQuery.isLoading ? (
              <Skeleton className="h-[340px] w-full" />
            ) : (
              <WorldMap data={mapQuery.data ?? []} height={340} />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Recent Orders */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest incoming transactions</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {recentOrdersQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="pb-3 pr-4">Order</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(recentOrdersQuery.data ?? []).map((order) => (
                    <tr key={order.id} className="transition-colors duration-200 hover:bg-muted/40">
                      <td className="py-3 pr-4 font-medium">{order.id}</td>
                      <td className="py-3 pr-4">{order.customerName}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 pr-4">{formatCurrency(order.total)}</td>
                      <td className="py-3">
                        <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

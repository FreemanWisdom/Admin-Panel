"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  DollarSign,
  FileJson,
  ShoppingCart,
  Upload,
  Users,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueChart = dynamic(
  () =>
    import("@/components/charts/AreaChart").then((module) => module.AreaChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> },
);

const DailyUsersChart = dynamic(
  () =>
    import("@/components/charts/BarChart").then((module) => module.BarChart),
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
      change: "+4.2%",
      changeLabel: "from last week",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Orders",
      value: stats?.orders ? stats.orders.toLocaleString() : "-",
      change: "+2.7%",
      changeLabel: "from yesterday",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-violet-500",
    },
    {
      title: "Revenue",
      value: stats?.revenue ? formatCurrency(stats.revenue) : "-",
      change: "+8.5%",
      changeLabel: "from last month",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions ? stats.activeSessions.toLocaleString() : "-",
      change: "121 live now",
      trend: "neutral" as const,
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
              <Card
                variant="stat"
                statTitle={item.title}
                statValue={item.value}
                statChange={item.change}
                statChangeLabel={item.changeLabel}
                statTrend={item.trend}
                statIcon={<item.icon className={`size-4 ${item.color}`} aria-hidden />}
              />
            </motion.div>
          ))}
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card variant="action" className="p-5 sm:p-6">
          <CardTitle className="text-sm">Export Data</CardTitle>
          <CardDescription className="mt-1">
            Download a CSV snapshot of user and order metrics.
          </CardDescription>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="secondary" leftIcon={<FileJson className="size-4" aria-hidden />}>
              Export CSV
            </Button>
            <Button
              variant="icon"
              aria-label="More export settings"
              leftIcon={<Activity className="size-4" aria-hidden />}
            />
          </div>
        </Card>

        <Card variant="action" className="p-5 sm:p-6">
          <CardTitle className="text-sm">Import Data</CardTitle>
          <CardDescription className="mt-1">
            Upload prepared records into the admin workspace.
          </CardDescription>
          <div className="mt-4">
            <Button variant="ghost" leftIcon={<Upload className="size-4" aria-hidden />}>
              Import File
            </Button>
          </div>
        </Card>

        <Card variant="action" className="p-5 sm:p-6">
          <CardTitle className="text-sm">Download JSON</CardTitle>
          <CardDescription className="mt-1">
            Save a JSON backup of current dashboard analytics.
          </CardDescription>
          <div className="mt-4">
            <Button variant="success" leftIcon={<FileJson className="size-4" aria-hidden />}>
              Download JSON
            </Button>
          </div>
        </Card>
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {revenueQuery.isLoading ? (
          <Card variant="analytics">
            <CardContent className="pt-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <RevenueChart
            title="Revenue"
            description="Revenue trend over selected period"
            data={revenueQuery.data ?? []}
            xKey="date"
            range={revenueRange}
            onRangeChange={setRevenueRange}
            series={[
              {
                key: "revenue",
                label: "Revenue",
                color: "hsl(var(--primary))",
              },
            ]}
            valueFormatter={(value) => `$${Number(value).toLocaleString()}`}
          />
        )}

        {dailyUsersQuery.isLoading ? (
          <Card variant="analytics">
            <CardContent className="pt-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <DailyUsersChart
            title="Daily Users"
            description="User activity trend over selected period"
            data={dailyUsersQuery.data ?? []}
            xKey="date"
            range={usersRange}
            onRangeChange={setUsersRange}
            series={[
              {
                key: "users",
                label: "Users",
                color: "hsl(var(--secondary))",
              },
            ]}
          />
        )}
      </section>

      {/* World Map */}
      <section>
        <Card variant="analytics">
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
        <Card variant="default">
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

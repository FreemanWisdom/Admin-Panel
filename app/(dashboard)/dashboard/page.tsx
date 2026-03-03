"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Activity, DollarSign, ShoppingCart, Users } from "lucide-react";

import {
  getDailyUsersSeries,
  getDashboardStats,
  getRecentOrders,
  getRevenueSeries,
} from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
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

const RevenueAreaChart = dynamic(
  () =>
    import("@/components/charts/revenue-area-chart").then(
      (module) => module.RevenueAreaChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  },
);

const DailyUsersBarChart = dynamic(
  () =>
    import("@/components/charts/daily-users-bar-chart").then(
      (module) => module.DailyUsersBarChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  },
);

const statusVariantMap = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
} as const;

export default function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const revenueQuery = useQuery({
    queryKey: ["revenue-series"],
    queryFn: getRevenueSeries,
  });

  const dailyUsersQuery = useQuery({
    queryKey: ["daily-users-series"],
    queryFn: getDailyUsersSeries,
  });

  const recentOrdersQuery = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrders(6),
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
    },
    {
      title: "Orders",
      value: stats?.orders ? stats.orders.toLocaleString() : "-",
      helper: "+2.7% from yesterday",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: stats?.revenue ? formatCurrency(stats.revenue) : "-",
      helper: "+8.5% from last month",
      icon: DollarSign,
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions ? stats.activeSessions.toLocaleString() : "-",
      helper: "121 live now",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
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
          : statCards.map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{item.title}</CardDescription>
                  <item.icon className="size-4 text-muted-foreground" aria-hidden />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
                </CardContent>
              </Card>
            ))}
      </section>

      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <RevenueAreaChart data={revenueQuery.data ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Users</CardTitle>
            <CardDescription>Last 10 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyUsersQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <DailyUsersBarChart data={dailyUsersQuery.data ?? []} />
            )}
          </CardContent>
        </Card>
      </section>

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

"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

const activeUsersMock = [
  { name: "Mon", users: 1200 },
  { name: "Tue", users: 1350 },
  { name: "Wed", users: 980 },
  { name: "Thu", users: 1800 },
  { name: "Fri", users: 2100 },
  { name: "Sat", users: 2500 },
  { name: "Sun", users: 2400 },
];

const trafficMock = [
  { name: "Direct", value: 400 },
  { name: "Organic", value: 300 },
  { name: "Referral", value: 300 },
  { name: "Social", value: 200 },
];
const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#f59e0b", "#8b5cf6"];

const revenueTrendMock = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 5500 },
];

const customerGrowthMock = [
  { month: "Jan", total: 120 },
  { month: "Feb", total: 180 },
  { month: "Mar", total: 250 },
  { month: "Apr", total: 310 },
  { month: "May", total: 420 },
  { month: "Jun", total: 500 },
];

const topCountries = [
  { country: "United States", users: "12,450", trend: "+12%" },
  { country: "United Kingdom", users: "8,200", trend: "+8%" },
  { country: "Germany", users: "6,500", trend: "+5%" },
  { country: "Canada", users: "4,100", trend: "-2%" },
  { country: "Australia", users: "3,200", trend: "+1%" },
];

const recentActivity = [
  { user: "Alice Walker", action: "Signed up for Pro plan", time: "2 hours ago" },
  { user: "Bob Smith", action: "Purchased Enterprise License", time: "4 hours ago" },
  { user: "Charlie Davis", action: "Upgraded subscription", time: "5 hours ago" },
  { user: "Diana Prince", action: "Requested Support", time: "8 hours ago" },
];

export default function Dashboard2() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold font-heading">Analytics Visualization</h2>
        <p className="text-muted-foreground mt-1 text-sm">Unique metrics layout focusing on deep analytics.</p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Daily active users over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeUsersMock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{ backgroundColor: "hsl(var(--surface))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Composition of inbound traffic</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficMock}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficMock.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--surface))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendMock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--surface))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>Total active customers</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthMock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--surface))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="step" dataKey="total" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Regions with highest user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Country</th>
                    <th className="pb-3 font-medium text-muted-foreground">Users</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {topCountries.map((country, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3">{country.country}</td>
                      <td className="py-3 font-medium">{country.users}</td>
                      <td className={`py-3 text-right ${country.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {country.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Feed</CardTitle>
            <CardDescription>Latest system and user updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 size-2.5 rounded-full bg-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

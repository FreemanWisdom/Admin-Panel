export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  orders: number;
  revenue: number;
  activeSessions: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface DailyUsersPoint {
  date: string;
  users: number;
}

export interface ToastMessage {
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

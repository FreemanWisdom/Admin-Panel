export type OrderStatus = "pending" | "completed" | "cancelled";
export type PaymentType = "credit_card" | "paypal" | "bank_transfer";

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
    paymentType: PaymentType;
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

// ─── Customer ────────────────────────────────────────────────────────────────
export type CustomerStatus = "verified" | "pending" | "blocked";

export interface Customer {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    status: CustomerStatus;
    joinedAt: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export type AdminRole = "super_admin" | "admin" | "support";
export type AdminStatus = "active" | "disabled";

export interface Admin {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    status: AdminStatus;
    createdAt: string;
}

// ─── Map Data ────────────────────────────────────────────────────────────────
export type MapLevel = "highest" | "medium" | "low" | "lowest";

export interface MapCountry {
    country: string;
    countryCode: string;
    totalOrders: number;
    level: MapLevel;
}

// ─── Settings / Security ─────────────────────────────────────────────────────
export interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    time: string;
    success: boolean;
}

export interface Session {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface OrderGrowthPoint {
    date: string;
    orders: number;
}

export interface StatusDistribution {
    name: string;
    value: number;
    color: string;
}

export interface CustomerGrowthPoint {
    date: string;
    customers: number;
}

// ─── Time Range ───────────────────────────────────────────────────────────────
export type TimeRange = "day" | "week" | "month" | "year" | "custom";

import {
  Admin,
  AdminRole,
  AdminStatus,
  Customer,
  CustomerStatus,
  DailyUsersPoint,
  CustomerGrowthPoint,
  DashboardStats,
  LoginActivity,
  MapCountry,
  Order,
  OrderGrowthPoint,
  OrderStatus,
  PaymentType,
  RevenuePoint,
  Session,
  StatusDistribution,
  TimeRange,
} from "@/types";

// ─── Utilities ───────────────────────────────────────────────────────────────
function wait(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sortByDateDesc(data: Order[]) {
  return [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ─── Seeded Data ─────────────────────────────────────────────────────────────
const statuses: OrderStatus[] = ["pending", "completed", "cancelled"];
const paymentTypes: PaymentType[] = ["credit_card", "paypal", "bank_transfer"];

const phones = [
  "+1 (555) 001-0001",
  "+44 20 7946 0958",
  "+49 30 1234 5678",
  "+33 1 23 45 67 89",
  "+81 3-1234-5678",
  "+86 10-8765-4321",
  "+91 98765 43210",
  "+55 11 9876-5432",
];

const addresses = [
  "123 Main St, New York, US",
  "10 Downing St, London, UK",
  "Unter den Linden 1, Berlin, DE",
  "15 Rue de la Paix, Paris, FR",
  "1-1 Marunouchi, Tokyo, JP",
  "No.1 Financial St, Beijing, CN",
  "MG Road, Bangalore, IN",
  "Av. Paulista 1000, São Paulo, BR",
];

const seededOrders: Order[] = Array.from({ length: 48 }, (_, index) => {
  const dayOffset = (index % 28) + 1;
  const amount = 120 + (index % 9) * 35 + index * 4;
  const status = statuses[index % statuses.length];
  const paymentType = paymentTypes[index % paymentTypes.length];

  return {
    id: `ORD-${String(index + 1001)}`,
    customerName: `Customer ${index + 1}`,
    customerEmail: `customer${index + 1}@example.com`,
    phone: phones[index % phones.length],
    address: addresses[index % addresses.length],
    paymentType,
    total: amount,
    status,
    createdAt: new Date(2026, 1, dayOffset, 9 + (index % 8), 15).toISOString(),
  };
});

let orderStore = [...seededOrders];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  await wait();

  const revenue = orderStore.reduce((sum, order) => sum + order.total, 0);

  return {
    totalUsers: 18342,
    orders: orderStore.length,
    revenue,
    activeSessions: 512,
  };
}

// ─── Revenue Series (time-range aware) ────────────────────────────────────────
export async function getRevenueSeries(
  range: TimeRange = "month",
): Promise<RevenuePoint[]> {
  await wait(500);

  const lengths: Record<TimeRange, number> = {
    day: 24,
    week: 7,
    month: 14,
    year: 12,
    custom: 10,
  };

  const count = lengths[range];

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(2026, 1, index + 1).toISOString();
    const revenue = 2600 + index * 240 + (index % 3) * 180;
    return { date, revenue };
  });
}

// ─── Daily Users Series (time-range aware) ────────────────────────────────────
export async function getDailyUsersSeries(
  range: TimeRange = "month",
): Promise<DailyUsersPoint[]> {
  await wait(500);

  const lengths: Record<TimeRange, number> = {
    day: 24,
    week: 7,
    month: 10,
    year: 12,
    custom: 15,
  };

  const count = lengths[range];

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(2026, 1, index + 5).toISOString();
    const users = 180 + (index % 4) * 42 + index * 11;
    return { date, users };
  });
}

// ─── Analytics Helpers ────────────────────────────────────────────────────────
export async function getOrderGrowth(
  range: TimeRange = "month",
): Promise<OrderGrowthPoint[]> {
  await wait(600);
  const lengths: Record<TimeRange, number> = {
    day: 24,
    week: 7,
    month: 12,
    year: 12,
    custom: 14,
  };
  const count = lengths[range];
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(2026, 0, i + 1).toISOString(),
    orders: 12 + (i % 5) * 4 + i * 2,
  }));
}

export async function getOrderStatusDistribution(): Promise<StatusDistribution[]> {
  await wait(400);
  return [
    { name: "Completed", value: 65, color: "hsl(var(--chart-completed))" },
    { name: "Processing", value: 25, color: "hsl(var(--chart-processing))" },
    { name: "Cancelled", value: 10, color: "hsl(var(--chart-cancelled))" },
  ];
}

export async function getCustomerGrowth(
  range: TimeRange = "month",
): Promise<CustomerGrowthPoint[]> {
  await wait(600);
  const lengths: Record<TimeRange, number> = {
    day: 24,
    week: 7,
    month: 12,
    year: 12,
    custom: 14,
  };
  const count = lengths[range];
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(2026, 0, i + 1).toISOString(),
    customers: 45 + (i % 3) * 12 + i * 8,
  }));
}

export async function getCustomerStatusDistribution(): Promise<StatusDistribution[]> {
  await wait(400);
  return [
    { name: "Verified", value: 75, color: "#10b981" },
    { name: "Pending", value: 18, color: "#f59e0b" },
    { name: "Blocked", value: 7, color: "#ef4444" },
  ];
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  await wait(650);
  return sortByDateDesc(orderStore);
}

export async function getRecentOrders(limit = 6): Promise<Order[]> {
  await wait(450);
  return sortByDateDesc(orderStore).slice(0, limit);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  await wait(450);

  const targetIndex = orderStore.findIndex((order) => order.id === orderId);

  if (targetIndex < 0) {
    throw new Error("Order not found");
  }

  const updated = {
    ...orderStore[targetIndex],
    status,
  };

  orderStore[targetIndex] = updated;

  return updated;
}

export async function resetOrderStore() {
  orderStore = [...seededOrders];
}

// ─── Customers ───────────────────────────────────────────────────────────────
const customerStatuses: CustomerStatus[] = ["verified", "pending", "blocked"];

const avatarColors = [
  "3B82F6",
  "8B5CF6",
  "EC4899",
  "10B981",
  "F59E0B",
  "EF4444",
  "06B6D4",
  "84CC16",
];

const seededCustomers: Customer[] = Array.from({ length: 40 }, (_, i) => ({
  id: `USR-${String(i + 1).padStart(4, "0")}`,
  name: [
    "Alice Johnson",
    "Bob Martinez",
    "Carmen Lee",
    "David Kim",
    "Elena Rossi",
    "Frank Müller",
    "Grace Okafor",
    "Hiro Tanaka",
    "Isla MacLeod",
    "James Patel",
  ][i % 10],
  username: [
    "alice_j",
    "bob_m",
    "carmen_l",
    "david_k",
    "elena_r",
    "frank_m",
    "grace_o",
    "hiro_t",
    "isla_mac",
    "james_p",
  ][i % 10],
  email: `user${i + 1}@example.com`,
  avatar: `https://ui-avatars.com/api/?name=User+${i + 1}&background=${avatarColors[i % avatarColors.length]}&color=fff&size=40`,
  status: customerStatuses[i % customerStatuses.length],
  joinedAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
}));

let customerStore = [...seededCustomers];

export async function getCustomers(): Promise<Customer[]> {
  await wait(600);
  return [...customerStore].sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
  );
}

export async function createCustomer(
  data: Omit<Customer, "id" | "joinedAt" | "avatar">,
): Promise<Customer> {
  await wait(500);
  const newCustomer: Customer = {
    ...data,
    id: `USR-${String(customerStore.length + 1).padStart(4, "0")}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3B82F6&color=fff&size=40`,
    joinedAt: new Date().toISOString(),
  };
  customerStore.unshift(newCustomer);
  return newCustomer;
}

export async function updateCustomer(
  id: string,
  data: Partial<Customer>,
): Promise<Customer> {
  await wait(450);
  const idx = customerStore.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error("Customer not found");
  customerStore[idx] = { ...customerStore[idx], ...data };
  return customerStore[idx];
}

export async function deleteCustomer(id: string): Promise<void> {
  await wait(400);
  customerStore = customerStore.filter((c) => c.id !== id);
}

// ─── Admins ──────────────────────────────────────────────────────────────────
const adminRoles: AdminRole[] = ["super_admin", "admin", "support"];

let adminStore: Admin[] = [
  {
    id: "ADM-0001",
    name: "Sarah Connor",
    email: "sarah@adminpanel.com",
    role: "super_admin",
    status: "active",
    createdAt: new Date(2024, 0, 1).toISOString(),
  },
  {
    id: "ADM-0002",
    name: "John Smith",
    email: "john@adminpanel.com",
    role: "admin",
    status: "active",
    createdAt: new Date(2024, 2, 15).toISOString(),
  },
  {
    id: "ADM-0003",
    name: "Emma Wilson",
    email: "emma@adminpanel.com",
    role: "support",
    status: "disabled",
    createdAt: new Date(2024, 5, 10).toISOString(),
  },
  {
    id: "ADM-0004",
    name: "Carlos Ruiz",
    email: "carlos@adminpanel.com",
    role: "admin",
    status: "active",
    createdAt: new Date(2025, 0, 20).toISOString(),
  },
];

export async function getAdmins(): Promise<Admin[]> {
  await wait(500);
  return [...adminStore];
}

export async function createAdmin(
  data: Omit<Admin, "id" | "createdAt">,
): Promise<Admin> {
  await wait(500);
  const newAdmin: Admin = {
    ...data,
    id: `ADM-${String(adminStore.length + 1).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
  };
  adminStore.push(newAdmin);
  return newAdmin;
}

export async function updateAdminStatus(
  id: string,
  status: AdminStatus,
): Promise<Admin> {
  await wait(400);
  const idx = adminStore.findIndex((a) => a.id === id);
  if (idx < 0) throw new Error("Admin not found");
  adminStore[idx] = { ...adminStore[idx], status };
  return adminStore[idx];
}

export async function deleteAdmin(id: string): Promise<void> {
  await wait(400);
  adminStore = adminStore.filter((a) => a.id !== id);
}

// ─── Map Data ─────────────────────────────────────────────────────────────────
const mapData: MapCountry[] = [
  { country: "United States", countryCode: "US", totalOrders: 1200, level: "highest" },
  { country: "United Kingdom", countryCode: "GB", totalOrders: 480, level: "medium" },
  { country: "Germany", countryCode: "DE", totalOrders: 390, level: "medium" },
  { country: "France", countryCode: "FR", totalOrders: 310, level: "medium" },
  { country: "Canada", countryCode: "CA", totalOrders: 280, level: "medium" },
  { country: "Australia", countryCode: "AU", totalOrders: 220, level: "low" },
  { country: "India", countryCode: "IN", totalOrders: 560, level: "medium" },
  { country: "China", countryCode: "CN", totalOrders: 890, level: "highest" },
  { country: "Brazil", countryCode: "BR", totalOrders: 340, level: "medium" },
  { country: "Japan", countryCode: "JP", totalOrders: 420, level: "medium" },
  { country: "Russia", countryCode: "RU", totalOrders: 180, level: "low" },
  { country: "Mexico", countryCode: "MX", totalOrders: 150, level: "low" },
  { country: "South Korea", countryCode: "KR", totalOrders: 200, level: "low" },
  { country: "Italy", countryCode: "IT", totalOrders: 160, level: "low" },
  { country: "Spain", countryCode: "ES", totalOrders: 140, level: "low" },
  { country: "Netherlands", countryCode: "NL", totalOrders: 110, level: "low" },
  { country: "Sweden", countryCode: "SE", totalOrders: 90, level: "lowest" },
  { country: "Norway", countryCode: "NO", totalOrders: 80, level: "lowest" },
  { country: "New Zealand", countryCode: "NZ", totalOrders: 60, level: "lowest" },
  { country: "Argentina", countryCode: "AR", totalOrders: 70, level: "lowest" },
  { country: "South Africa", countryCode: "ZA", totalOrders: 55, level: "lowest" },
  { country: "Nigeria", countryCode: "NG", totalOrders: 45, level: "lowest" },
  { country: "Egypt", countryCode: "EG", totalOrders: 50, level: "lowest" },
  { country: "Turkey", countryCode: "TR", totalOrders: 130, level: "low" },
  { country: "Poland", countryCode: "PL", totalOrders: 95, level: "lowest" },
];

export async function getMapData(
  _range: TimeRange = "month",
): Promise<MapCountry[]> {
  await wait(600);
  return mapData;
}

// ─── Security / Sessions ──────────────────────────────────────────────────────
export async function getSessions(): Promise<Session[]> {
  await wait(400);
  return [
    {
      id: "SES-001",
      device: "Chrome on Windows – Current",
      location: "New York, US",
      lastActive: new Date().toISOString(),
      current: true,
    },
    {
      id: "SES-002",
      device: "Safari on iPhone",
      location: "London, UK",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      current: false,
    },
    {
      id: "SES-003",
      device: "Firefox on macOS",
      location: "Berlin, DE",
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      current: false,
    },
  ];
}

export async function getLoginActivity(): Promise<LoginActivity[]> {
  await wait(400);
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ACT-${String(i + 1).padStart(3, "0")}`,
    device: ["Chrome/Windows", "Safari/iOS", "Firefox/macOS", "Edge/Windows"][i % 4],
    location: ["New York, US", "London, UK", "Berlin, DE", "Tokyo, JP"][i % 4],
    ip: `192.168.${i}.${i * 13 + 1}`,
    time: new Date(Date.now() - i * 43200000).toISOString(),
    success: i !== 2 && i !== 5,
  }));
}

export async function revokeSession(_sessionId: string): Promise<void> {
  await wait(400);
}

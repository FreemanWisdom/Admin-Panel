import {
  DailyUsersPoint,
  DashboardStats,
  Order,
  OrderStatus,
  RevenuePoint,
} from "@/types";

const statuses: OrderStatus[] = ["pending", "completed", "cancelled"];

const seededOrders: Order[] = Array.from({ length: 48 }, (_, index) => {
  const dayOffset = (index % 28) + 1;
  const amount = 120 + (index % 9) * 35 + index * 4;
  const status = statuses[index % statuses.length];

  return {
    id: `ORD-${String(index + 1001)}`,
    customerName: `Customer ${index + 1}`,
    customerEmail: `customer${index + 1}@example.com`,
    total: amount,
    status,
    createdAt: new Date(2026, 1, dayOffset, 9 + (index % 8), 15).toISOString(),
  };
});

let orderStore = [...seededOrders];

function wait(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sortByDateDesc(data: Order[]) {
  return [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

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

export async function getRevenueSeries(): Promise<RevenuePoint[]> {
  await wait(500);

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(2026, 1, index + 1).toISOString();
    const revenue = 2600 + index * 240 + (index % 3) * 180;

    return { date, revenue };
  });
}

export async function getDailyUsersSeries(): Promise<DailyUsersPoint[]> {
  await wait(500);

  return Array.from({ length: 10 }, (_, index) => {
    const date = new Date(2026, 1, index + 5).toISOString();
    const users = 180 + (index % 4) * 42 + index * 11;

    return { date, users };
  });
}

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

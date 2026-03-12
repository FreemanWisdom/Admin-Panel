import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import OrdersPage from "@/app/(dashboard)/dashboard/orders/page";
import { getOrders } from "@/lib/api";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    pushToast: jest.fn(),
  }),
}));

jest.mock("@/lib/api", () => {
  const original = jest.requireActual("@/lib/api");

  return {
    ...original,
    getOrders: jest.fn(),
  };
});

describe("OrdersPage", () => {
  it("renders orders from query", async () => {
    (getOrders as jest.Mock).mockResolvedValue([
      {
        id: "ORD-1001",
        customerName: "Jane Cooper",
        customerEmail: "jane@example.com",
        total: 250,
        status: "pending",
        createdAt: "2026-02-01T10:00:00.000Z",
      },
    ]);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OrdersPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    });
  });
});

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Building2, Wallet, Search } from "lucide-react";

import { getOrders, updateOrderStatus } from "@/lib/api";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/modals/Modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { OrderAnalytics } from "@/components/charts/OrderAnalytics";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, OrderStatus, PaymentType } from "@/types";

const statusVariantMap = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
} as const;

const paymentIcons: Record<PaymentType, React.ReactNode> = {
  credit_card: <CreditCard className="size-3.5 text-blue-500" aria-hidden />,
  paypal: <Wallet className="size-3.5 text-amber-500" aria-hidden />,
  bank_transfer: <Building2 className="size-3.5 text-emerald-500" aria-hidden />,
};

const paymentLabels: Record<PaymentType, string> = {
  credit_card: "Credit Card",
  paypal: "PayPal",
  bank_transfer: "Bank Transfer",
};

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const newStatusOptions = statusOptions.filter((o) => o.value !== "all");

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");

  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      pushToast({ title: "Order updated", description: "Status updated successfully.", variant: "success" });
      setEditingOrder(null);
    },
    onError: () => {
      pushToast({ title: "Update failed", description: "Unable to update order status.", variant: "danger" });
    },
  });

  const filteredOrders = useMemo(() => {
    let base = ordersQuery.data ?? [];
    if (statusFilter !== "all") base = base.filter((o) => o.status === statusFilter);
    return base;
  }, [ordersQuery.data, statusFilter]);

  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.customerName}</p>
            <p className="text-xs text-muted-foreground">{row.original.customerEmail}</p>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
          <span className="max-w-[160px] truncate text-sm text-muted-foreground block">
            {row.original.address}
          </span>
        ),
      },
      {
        accessorKey: "paymentType",
        header: "Payment",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            {paymentIcons[row.original.paymentType]}
            <span className="text-sm">{paymentLabels[row.original.paymentType]}</span>
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-medium">{formatCurrency(row.original.total)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariantMap[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingOrder(row.original);
              setNextStatus(row.original.status);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [],
  );

  if (ordersQuery.isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            title="Could not load orders"
            description="There was a problem loading orders. Try again."
          />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => ordersQuery.refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <OrderAnalytics />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Detailed Orders</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | OrderStatus)
              }
              options={statusOptions}
              ariaLabel="Filter orders by status"
            />
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <DataTable
            data={filteredOrders}
            columns={columns}
            isLoading={ordersQuery.isLoading}
            searchPlaceholder="Search by ID, Customer Name, Phone, Email..."
            initialSorting={[{ id: "createdAt", desc: true }]}
            emptyTitle="No orders found"
            emptyDescription="Try adjusting your status filter or searching for a different term."
          />
        </CardContent>
      </Card>

      <Modal
        open={Boolean(editingOrder)}
        onOpenChange={(open) => { if (!open) setEditingOrder(null); }}
        title="Edit Order"
        description={editingOrder ? `Update status for ${editingOrder.id}.` : ""}
      >
        <div className="space-y-4">
          <Select
            value={nextStatus}
            onValueChange={(value) => setNextStatus(value as OrderStatus)}
            options={newStatusOptions}
            ariaLabel="Change order status"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditingOrder(null)}>Cancel</Button>
            <Button
              loading={updateOrderMutation.isPending}
              onClick={() => {
                if (!editingOrder) return;
                updateOrderMutation.mutate({ orderId: editingOrder.id, status: nextStatus });
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

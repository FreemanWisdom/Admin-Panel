"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getOrders, updateOrderStatus } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

const statusVariantMap = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
} as const;

const statusOptions = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      pushToast({
        title: "Order updated",
        description: "Order status was updated successfully.",
        variant: "success",
      });

      setEditingOrder(null);
    },
    onError: () => {
      pushToast({
        title: "Update failed",
        description: "Unable to update order status right now.",
        variant: "danger",
      });
    },
  });

  const filteredOrders = useMemo(() => {
    const base = ordersQuery.data ?? [];

    if (statusFilter === "all") {
      return base;
    }

    return base.filter((order) => order.status === statusFilter);
  }, [ordersQuery.data, statusFilter]);

  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order",
        cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
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
        accessorKey: "total",
        header: "Amount",
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariantMap[row.original.status]}>{row.original.status}</Badge>
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Orders</CardTitle>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | OrderStatus)}
            options={statusOptions}
            ariaLabel="Filter orders by status"
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={filteredOrders}
            columns={columns}
            isLoading={ordersQuery.isLoading}
            searchPlaceholder="Search orders, customer, email..."
            initialSorting={[{ id: "createdAt", desc: true }]}
            emptyTitle="No orders found"
            emptyDescription="Adjust your status filter or search query."
          />
        </CardContent>
      </Card>

      <Modal
        open={Boolean(editingOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOrder(null);
          }
        }}
        title="Edit Order"
        description={editingOrder ? `Update status for ${editingOrder.id}.` : ""}
      >
        <div className="space-y-4">
          <Select
            value={nextStatus}
            onValueChange={(value) => setNextStatus(value as OrderStatus)}
            options={statusOptions.filter((option) => option.value !== "all")}
            ariaLabel="Change order status"
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditingOrder(null)}>
              Cancel
            </Button>
            <Button
              loading={updateOrderMutation.isPending}
              onClick={() => {
                if (!editingOrder) {
                  return;
                }

                updateOrderMutation.mutate({
                  orderId: editingOrder.id,
                  status: nextStatus,
                });
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

"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, UserX, UserCheck, Shield, Key, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { DataTable } from "@/components/tables/DataTable";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modals/Modal";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CustomerAnalytics } from "@/components/charts/CustomerAnalytics";
import { formatDate } from "@/lib/utils";
import { Customer, CustomerStatus } from "@/types";

const statusVariantMap: Record<CustomerStatus, "success" | "warning" | "danger"> = {
    verified: "success",
    pending: "warning",
    blocked: "danger",
};

const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "blocked", label: "Blocked" },
];

const newCustomerStatusOptions = statusOptions.filter((o) => o.value !== "all");

type ModalMode = "add" | "edit" | "delete" | null;

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const { pushToast } = useToast();

    const [modal, setModal] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | CustomerStatus>("all");

    // Form state
    const [formName, setFormName] = useState("");
    const [formUsername, setFormUsername] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formStatus, setFormStatus] = useState<CustomerStatus>("pending");

    const customersQuery = useQuery({ queryKey: ["customers"], queryFn: getCustomers });

    const createMutation = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            pushToast({ title: "Customer added", variant: "success" });
            closeModal();
        },
        onError: () => pushToast({ title: "Failed to add customer", variant: "danger" }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
            updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            pushToast({ title: "Customer updated", variant: "success" });
            closeModal();
        },
        onError: () => pushToast({ title: "Failed to update customer", variant: "danger" }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            pushToast({ title: "Customer removed", variant: "success" });
            closeModal();
        },
        onError: () => pushToast({ title: "Failed to delete customer", variant: "danger" }),
    });

    function openModal(mode: ModalMode, customer?: Customer) {
        setModal(mode);
        setSelected(customer ?? null);
        if (customer && mode === "edit") {
            setFormName(customer.name);
            setFormUsername(customer.username);
            setFormEmail(customer.email);
            setFormStatus(customer.status);
        } else {
            setFormName("");
            setFormUsername("");
            setFormEmail("");
            setFormStatus("pending");
        }
    }

    function closeModal() {
        setModal(null);
        setSelected(null);
    }

    const filtered = useMemo(() => {
        let base = customersQuery.data ?? [];
        if (statusFilter !== "all") base = base.filter((c) => c.status === statusFilter);
        return base;
    }, [customersQuery.data, statusFilter]);

    const columns = useMemo<ColumnDef<Customer, unknown>[]>(
        () => [
            {
                accessorKey: "joinedAt",
                header: "Date Joined",
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDate(row.original.joinedAt)}
                    </span>
                ),
            },
            {
                accessorKey: "name",
                header: "User",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2.5">
                        <Avatar src={row.original.avatar} alt={row.original.name} fallback={row.original.name[0]} />
                        <div>
                            <p className="font-medium leading-none">{row.original.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{row.original.email}</p>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "username",
                header: "Username",
                cell: ({ row }) => (
                    <span className="text-sm text-primary underline-offset-2 hover:underline cursor-pointer">
                        @{row.original.username}
                    </span>
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
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            onClick={() => openModal("edit", row.original)}
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title={row.original.status === "blocked" ? "Unblock" : "Block"}
                            onClick={() =>
                                updateMutation.mutate({
                                    id: row.original.id,
                                    data: { status: row.original.status === "blocked" ? "pending" : "blocked" },
                                })
                            }
                        >
                            {row.original.status === "blocked" ? (
                                <UserCheck className="size-3.5 text-emerald-500" />
                            ) : (
                                <UserX className="size-3.5 text-amber-500" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Verify"
                            onClick={() =>
                                updateMutation.mutate({ id: row.original.id, data: { status: "verified" } })
                            }
                        >
                            <Shield className="size-3.5 text-blue-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Reset password"
                            onClick={() =>
                                pushToast({ title: "Password reset email sent", variant: "success" })
                            }
                        >
                            <Key className="size-3.5 text-violet-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Delete"
                            onClick={() => openModal("delete", row.original)}
                        >
                            <Trash2 className="size-3.5 text-danger" />
                        </Button>
                    </div>
                ),
            },
        ],
        [updateMutation],
    );

    return (
        <div className="space-y-6">
            <CustomerAnalytics />

            <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Detailed Customer List</CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Select
                            value={statusFilter}
                            onValueChange={(v) =>
                                setStatusFilter(v as "all" | CustomerStatus)
                            }
                            options={statusOptions}
                            ariaLabel="Filter by status"
                        />
                        <Button onClick={() => openModal("add")} className="shrink-0">
                            <Plus className="size-4" /> Add customer
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {customersQuery.isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : customersQuery.isError ? (
                        <EmptyState title="Failed to load customers" description="Please try again." />
                    ) : (
                        <DataTable
                            data={filtered}
                            columns={columns}
                            isLoading={false}
                            searchPlaceholder="Search by Name, Username, Email, ID..."
                            emptyTitle="No customers found"
                            emptyDescription="Try adjusting your status filter or searching for a different term."
                        />
                    )}
                </CardContent>
            </Card>

            {/* Add / Edit Modal */}
            <Modal
                open={modal === "add" || modal === "edit"}
                onOpenChange={(open) => { if (!open) closeModal(); }}
                title={modal === "add" ? "Add Customer" : "Edit Customer"}
                description={modal === "add" ? "Create a new customer account." : "Update customer details."}
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Username</label>
                        <Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="jane_doe" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                        <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="jane@example.com" type="email" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                        <Select
                            value={formStatus}
                            onValueChange={(v) => setFormStatus(v as CustomerStatus)}
                            options={newCustomerStatusOptions}
                            ariaLabel="Customer status"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button
                            loading={createMutation.isPending || updateMutation.isPending}
                            onClick={() => {
                                if (!formName || !formEmail) {
                                    pushToast({ title: "Name and email are required", variant: "warning" });
                                    return;
                                }
                                if (modal === "add") {
                                    createMutation.mutate({ name: formName, username: formUsername, email: formEmail, status: formStatus });
                                } else if (selected) {
                                    updateMutation.mutate({ id: selected.id, data: { name: formName, username: formUsername, email: formEmail, status: formStatus } });
                                }
                            }}
                        >
                            {modal === "add" ? "Add customer" : "Save changes"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                open={modal === "delete"}
                onOpenChange={(open) => { if (!open) closeModal(); }}
                title="Delete Customer"
                description={`Are you sure you want to delete ${selected?.name}? This action cannot be undone.`}
            >
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                    <Button
                        variant="outline"
                        loading={deleteMutation.isPending}
                        onClick={() => { if (selected) deleteMutation.mutate(selected.id); }}
                        className="border-danger text-danger hover:bg-danger hover:text-danger-foreground"
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

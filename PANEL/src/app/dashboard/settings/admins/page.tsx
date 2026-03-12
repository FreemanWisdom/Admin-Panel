"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Plus, Trash2, PowerOff, PowerIcon } from "lucide-react";
import { motion } from "framer-motion";

import { getAdmins, createAdmin, updateAdminStatus, deleteAdmin } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modals/Modal";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/tables/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Admin, AdminRole, AdminStatus } from "@/types";

const roleVariantMap: Record<AdminRole, "success" | "default" | "warning"> = {
    super_admin: "success",
    admin: "default",
    support: "warning",
};

const roleLabelMap: Record<AdminRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    support: "Support",
};

const roleOptions = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "support", label: "Support" },
];

export default function AdminsSettingsPage() {
    const queryClient = useQueryClient();
    const { pushToast } = useToast();

    const [addOpen, setAddOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState<AdminRole>("admin");

    const adminsQuery = useQuery({ queryKey: ["admins"], queryFn: getAdmins });

    const createMutation = useMutation({
        mutationFn: createAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            pushToast({ title: "Admin added successfully", variant: "success" });
            setAddOpen(false);
            setFormName("");
            setFormEmail("");
            setFormRole("admin");
        },
        onError: () => pushToast({ title: "Failed to add admin", variant: "danger" }),
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: AdminStatus }) =>
            updateAdminStatus(id, status),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            pushToast({
                title: `Admin ${updated.status === "active" ? "enabled" : "disabled"}`,
                variant: "success",
            });
        },
        onError: () => pushToast({ title: "Action failed", variant: "danger" }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            pushToast({ title: "Admin removed", variant: "success" });
            setDeleteTarget(null);
        },
        onError: () => pushToast({ title: "Failed to delete admin", variant: "danger" }),
    });

    const columns = useMemo<ColumnDef<Admin, unknown>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => (
                    <span className="text-muted-foreground">{row.original.email}</span>
                ),
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => (
                    <Badge variant={roleVariantMap[row.original.role]}>
                        {roleLabelMap[row.original.role]}
                    </Badge>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                    <Badge variant={row.original.status === "active" ? "success" : "danger"}>
                        {row.original.status}
                    </Badge>
                ),
            },
            {
                accessorKey: "createdAt",
                header: "Added",
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>
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
                            title={row.original.status === "active" ? "Disable" : "Enable"}
                            onClick={() =>
                                statusMutation.mutate({
                                    id: row.original.id,
                                    status: row.original.status === "active" ? "disabled" : "active",
                                })
                            }
                        >
                            {row.original.status === "active" ? (
                                <PowerOff className="size-3.5 text-amber-500" />
                            ) : (
                                <PowerIcon className="size-3.5 text-emerald-500" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Delete"
                            onClick={() => setDeleteTarget(row.original)}
                        >
                            <Trash2 className="size-3.5 text-danger" />
                        </Button>
                    </div>
                ),
            },
        ],
        [statusMutation],
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
        >
            <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Admin Management</CardTitle>
                        <CardDescription>Manage administrator accounts and roles</CardDescription>
                    </div>
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className="size-4" /> Add Admin
                    </Button>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {adminsQuery.isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            data={adminsQuery.data ?? []}
                            columns={columns}
                            isLoading={false}
                            searchPlaceholder="Search admins…"
                            hideRowsPerPage={true}
                            emptyTitle="No admins found"
                            emptyDescription="Add an admin to get started."
                        />
                    )}
                </CardContent>
            </Card>

            {/* Add Admin Modal */}
            <Modal
                open={addOpen}
                onOpenChange={setAddOpen}
                title="Add Admin"
                description="Create a new administrator account"
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                        <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="jane@company.com" type="email" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Role</label>
                        <Select
                            value={formRole}
                            onValueChange={(v) => setFormRole(v as AdminRole)}
                            options={roleOptions}
                            ariaLabel="Admin role"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                        <Button
                            loading={createMutation.isPending}
                            onClick={() => {
                                if (!formName || !formEmail) {
                                    pushToast({ title: "Name and email are required", variant: "warning" });
                                    return;
                                }
                                createMutation.mutate({ name: formName, email: formEmail, role: formRole, status: "active" });
                            }}
                        >
                            Add Admin
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                title="Remove Admin"
                description={`Are you sure you want to remove ${deleteTarget?.name}?`}
            >
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button
                        loading={deleteMutation.isPending}
                        onClick={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id); }}
                        className="bg-danger text-danger-foreground hover:bg-danger/90"
                    >
                        Remove
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
}

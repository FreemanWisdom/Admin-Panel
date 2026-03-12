"use client";

import { useQuery } from "@tanstack/react-query";
import { Monitor, Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getLoginActivity } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

const mockDevices = [
    { id: "DEV-001", name: "Chrome on Windows", type: "desktop", lastSeen: new Date().toISOString(), trusted: true },
    { id: "DEV-002", name: "Safari on iPhone 15", type: "mobile", lastSeen: new Date(Date.now() - 3600000).toISOString(), trusted: true },
    { id: "DEV-003", name: "Firefox on macOS", type: "desktop", lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), trusted: false },
];

export default function SecuritySettingsPage() {
    const activityQuery = useQuery({ queryKey: ["login-activity"], queryFn: getLoginActivity });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
        >
            {/* Login Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Login Activity History</CardTitle>
                    <CardDescription>Recent sign-in attempts to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {activityQuery.isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {(activityQuery.data ?? []).map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between rounded-lg border border-border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-full p-1.5 ${activity.success ? "bg-success/10" : "bg-danger/10"}`}>
                                            {activity.success ? (
                                                <CheckCircle2 className="size-4 text-success" />
                                            ) : (
                                                <XCircle className="size-4 text-danger" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{activity.device}</span>
                                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${activity.success ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                                                    {activity.success ? "Success" : "Failed"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.location} · {activity.ip}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDate(activity.time)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Device List */}
            <Card>
                <CardHeader>
                    <CardTitle>Trusted Devices</CardTitle>
                    <CardDescription>Devices that have accessed your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {mockDevices.map((device) => (
                        <div
                            key={device.id}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-md bg-muted p-2">
                                    {device.type === "mobile" ? (
                                        <Smartphone className="size-4 text-muted-foreground" />
                                    ) : (
                                        <Monitor className="size-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{device.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Last seen {formatDate(device.lastSeen)}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${device.trusted
                                        ? "bg-success/10 text-success"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {device.trusted ? "Trusted" : "Unknown"}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}

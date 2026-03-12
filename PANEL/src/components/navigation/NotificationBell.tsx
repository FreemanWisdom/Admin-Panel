"use client";

import { useState } from "react";
import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    unread: boolean;
    type: "info" | "success" | "warning";
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "New User Registration",
        message: "Alice Walker just signed up for the Pro plan.",
        timestamp: "2 mins ago",
        unread: true,
        type: "info",
    },
    {
        id: "2",
        title: "System Update",
        message: "Dashboard successfully updated to version 2.4.",
        timestamp: "1 hour ago",
        unread: true,
        type: "success",
    },
    {
        id: "3",
        title: "High Usage Alert",
        message: "Server CPU usage exceeded 85%.",
        timestamp: "5 hours ago",
        unread: false,
        type: "warning",
    },
];

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, unread: false }))
        );
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return <Check className="size-4 text-emerald-500" />;
            case "warning":
                return <AlertTriangle className="size-4 text-amber-500" />;
            default:
                return <Info className="size-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                aria-label="Notifications"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {/* Backdrop overlay for closing */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 z-40 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                No notifications right now.
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                                            notification.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                        )}
                                    >
                                        <div className="mt-0.5 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-sm font-medium leading-none", notification.unread ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                        {notification.unread && (
                                            <div className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

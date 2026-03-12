"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, UserCog, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const tabs = [
    { href: "/dashboard/settings/auth", label: "Authentication", icon: Lock },
    { href: "/dashboard/settings/admins", label: "Admins", icon: UserCog },
    { href: "/dashboard/settings/security", label: "Security", icon: ShieldCheck },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage authentication, admins, and security</p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <tab.icon className="size-3.5" aria-hidden />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {/* Sub-page content */}
            <div>{children}</div>
        </div>
    );
}

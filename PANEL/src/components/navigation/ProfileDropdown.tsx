"use client";

import { useRouter } from "next/navigation";
import { User, Bell, Settings, Lock, LogOut, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";

export function ProfileDropdown() {
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem("admin_token");
        router.push("/login");
    };

    return (
        <Dropdown
            trigger={
                <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-muted"
                    aria-label="Open user menu"
                >
                    <Avatar alt="Admin user" fallback="AD" />
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                </button>
            }
            items={[
                {
                    label: "Profile",
                    icon: <User className="size-4" />,
                    onSelect: () => router.push("/dashboard/profile"),
                },
                {
                    label: "Notifications",
                    icon: <Bell className="size-4" />,
                    onSelect: () => {
                        // Can be extended to open a standard notification panel
                        console.log("Open notifications");
                    },
                },
                {
                    label: "Account Settings",
                    icon: <Settings className="size-4" />,
                    onSelect: () => router.push("/dashboard/settings/account"),
                },
                {
                    label: "Lock Screen",
                    icon: <Lock className="size-4" />,
                    onSelect: () => router.push("/lock"),
                },
                {
                    label: "Logout",
                    icon: <LogOut className="size-4" />,
                    onSelect: handleSignOut,
                    destructive: true,
                },
            ]}
        />
    );
}

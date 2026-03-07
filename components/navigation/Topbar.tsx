"use client";

import { Menu, Sidebar as SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { ProfileDropdown } from "@/components/navigation/ProfileDropdown";
import { NotificationBell } from "@/components/navigation/NotificationBell";

interface TopbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/dashboard1": "Dashboard 1",
  "/dashboard/dashboard2": "Dashboard 2",
  "/dashboard/orders": "Orders",
  "/dashboard/customers": "Customers",
  "/dashboard/maps": "Maps",
  "/dashboard/profile": "Profile",
  "/dashboard/settings/account": "Account Settings",
};

export function Topbar({
  collapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}: TopbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="bg-surface/70 border-border sticky top-4 z-30 mx-4 flex h-[70px] shrink-0 items-center justify-between gap-3 rounded-2xl border px-4 backdrop-blur-md transition-all duration-300 lg:px-8">
      <div className="flex items-center gap-2">
        <motion.div whileTap={{ scale: 0.92 }} className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMobileMenu}
            aria-label="Open sidebar"
          >
            <Menu className="size-4" />
          </Button>
        </motion.div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hidden lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <SidebarIcon className="size-4" />
        </Button>

        <h1 className="font-heading text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex-1 lg:flex lg:justify-end lg:pr-4 ml-auto">
      </div>

      <div className="flex items-center gap-1.5 shrink-0">

        <ThemeToggle />
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
}

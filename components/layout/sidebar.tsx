"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageCheck, Settings2, UsersRound } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: PackageCheck,
  },
  {
    href: "#",
    label: "Customers",
    icon: UsersRound,
  },
  {
    href: "#",
    label: "Settings",
    icon: Settings2,
  },
];

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="surface m-4 hidden h-[calc(100vh-2rem)] shrink-0 overflow-hidden lg:block"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-5">
          <p className={cn("font-heading font-bold", collapsed ? "text-center" : "text-lg")}>
            {collapsed ? "AP" : "Admin Panel"}
          </p>
        </div>

        <nav className="space-y-1 p-3" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}

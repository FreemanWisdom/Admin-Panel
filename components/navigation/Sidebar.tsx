"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  PackageCheck,
  Settings2,
  UsersRound,
  ChevronDown,
  ShieldCheck,
  UserCog,
  Lock,
  CircleDot
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
  isMobile?: boolean;
}

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { href: "/dashboard/dashboard1", label: "Dashboard 1" },
      { href: "/dashboard/dashboard2", label: "Dashboard 2" },
    ],
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: PackageCheck,
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: UsersRound,
  },
  {
    href: "/dashboard/maps",
    label: "Maps",
    icon: Map,
  },
];

const settingsSubItems = [
  { href: "/dashboard/settings/auth", label: "Authentication", icon: Lock },
  { href: "/dashboard/settings/admins", label: "Admins", icon: UserCog },
  { href: "/dashboard/settings/security", label: "Security", icon: ShieldCheck },
];

export function Sidebar({ collapsed, onNavigate, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(
    pathname.startsWith("/dashboard/settings")
  );
  const [dashboardOpen, setDashboardOpen] = useState(
    pathname === "/dashboard" || pathname.startsWith("/dashboard/dashboard")
  );

  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "surface shrink-0 overflow-hidden",
        isMobile ? "h-full rounded-none border-y-0 border-l-0" : "sticky top-4 m-4 hidden h-[calc(100vh-2rem)] lg:block"
      )}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-5">
          <p className={cn("font-heading font-bold", collapsed ? "text-center" : "text-lg")}>
            {collapsed ? "AP" : "Admin Panel"}
          </p>
        </div>

        <motion.nav
          variants={isMobile ? containerVariants : undefined}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-1 overflow-y-auto p-3"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            if (item.subItems) {
              const isGroupActive = pathname.startsWith("/dashboard/dashboard") || pathname === "/dashboard";
              return (
                <motion.div key={item.label} variants={isMobile ? itemVariants : undefined}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!collapsed) setDashboardOpen((prev) => !prev);
                    }}
                    className={cn(
                      "focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                      isGroupActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "size-3.5 shrink-0 transition-transform duration-200",
                            dashboardOpen && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {dashboardOpen && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 space-y-0.5 pl-4">
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={onNavigate}
                                className={cn(
                                  "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                  isSubActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <CircleDot className="size-2 shrink-0 opacity-50" aria-hidden />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <motion.div key={item.label} variants={isMobile ? itemVariants : undefined}>
                <Link
                  href={item.href!}
                  onClick={onNavigate}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              </motion.div>
            );
          })}

          {/* Settings expandable nav item */}
          <motion.div variants={isMobile ? itemVariants : undefined}>
            <button
              type="button"
              onClick={() => {
                if (!collapsed) setSettingsOpen((prev) => !prev);
              }}
              className={cn(
                "focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isSettingsActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <Settings2 className="size-4 shrink-0" aria-hidden />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 transition-transform duration-200",
                      settingsOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </button>

            <AnimatePresence initial={false}>
              {settingsOpen && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 space-y-0.5 pl-4">
                    {settingsSubItems.map((sub) => {
                      const isSubActive =
                        pathname === sub.href ||
                        pathname.startsWith(`${sub.href}/`);
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={onNavigate}
                          className={cn(
                            "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                            isSubActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <sub.icon className="size-3.5 shrink-0" aria-hidden />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.nav>
      </div>
    </motion.aside>
  );
}

"use client";

import { Bell, ChevronDown, Menu, Search, Sidebar as SidebarIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface TopbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "Orders",
};

export function Topbar({
  collapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const title = pageTitles[pathname] ?? "Admin";

  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <header className="surface sticky top-4 z-30 mx-4 flex h-16 items-center justify-between gap-3 px-4 lg:mx-0 lg:mr-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMobileMenu}
          className="lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-4" />
        </Button>

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

      <div className="hidden flex-1 lg:flex lg:max-w-sm">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search" placeholder="Search…" className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <Dropdown
          trigger={
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-2 rounded-md p-1"
              aria-label="Open user menu"
            >
              <Avatar alt="Admin user" fallback="AD" />
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
            </button>
          }
          items={[
            {
              label: "Profile",
              onSelect: () => router.push("#"),
            },
            {
              label: "Sign out",
              onSelect: handleSignOut,
              destructive: true,
            },
          ]}
        />
      </div>
    </header>
  );
}

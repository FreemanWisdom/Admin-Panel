"use client";

import { ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "center" | "end";
}

export function Dropdown({ trigger, items, align = "end" }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          className={cn(
            "z-40 min-w-44 rounded-md border border-border bg-surface dark:bg-gray-900 dark:text-gray-100 p-1 shadow-card",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.onSelect}
              className={cn(
                "focus-ring cursor-pointer rounded px-3 py-2 text-sm",
                item.destructive
                  ? "text-danger hover:bg-danger/10"
                  : "text-foreground hover:bg-muted dark:hover:bg-gray-800",
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {item.icon && <span className="flex items-center justify-center shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}


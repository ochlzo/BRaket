"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export function NavMain({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              size="lg"
              tooltip={item.label}
              render={<Link href={item.href} prefetch />}
              className={cn(
                "h-12 rounded-xl px-4 text-sm font-medium transition-all",
                active
                  ? "bg-[color:var(--brand-orange)]/10 font-semibold text-[color:var(--brand-orange)]"
                  : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={2.1} />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

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
  badge?: number;
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
                "h-12 rounded-xl px-4 text-sm font-medium transition-all hover:shadow-[var(--shadow-menu)]",
                "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0!",
                active
                  ? "bg-[color:var(--brand-orange)]/10 font-semibold text-[color:var(--brand-orange)] hover:bg-[color:var(--brand-orange)]/10"
                  : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={2.1} />
              <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
              {typeof item.badge === "number" ? (
                <span className="ml-auto rounded-full bg-[color:var(--surface-alt)] px-2 py-0.5 text-xs font-bold leading-none text-[color:var(--ink-muted)] group-data-[collapsible=icon]:hidden">
                  {item.badge}
                </span>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

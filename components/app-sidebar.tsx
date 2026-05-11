"use client";

import {
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  UserRound,
  Wrench,
} from "lucide-react";

import { BrandMark } from "@/components/shared/branding/brand-mark";
import { NavMain, type SidebarNavItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/lib/types";

const clientNavItems: SidebarNavItem[] = [
  { href: "/dashboard/client", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: UserRound, label: "My Profile" },
  {
    href: "/dashboard/client/bookings",
    icon: ClipboardList,
    label: "My Bookings",
  },
  { href: "/browse", icon: Search, label: "Browse Talents" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const talentNavItems: SidebarNavItem[] = [
  { href: "/dashboard/talent", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: UserRound, label: "My Profile" },
  {
    href: "/dashboard/talent/services",
    icon: Wrench,
    label: "My Services",
  },
  {
    href: "/dashboard/talent/bookings",
    icon: ClipboardList,
    label: "My Bookings",
  },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar({ role }: { role: UserRole }) {
  const items = role === "client" ? clientNavItems : talentNavItems;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[color:var(--line-strong)] bg-white"
    >
      <SidebarHeader className="border-b border-[color:var(--line)] px-6 py-4">
        <BrandMark href="/" />
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[color:var(--line)] px-4 py-4">
        <NavUser role={role} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

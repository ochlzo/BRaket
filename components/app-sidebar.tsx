"use client";

import {
  ClipboardList,
  LayoutDashboard,
  Search,
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
} from "@/components/ui/sidebar";
import { getDashboardProfilePath } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types";

const clientNavItems: SidebarNavItem[] = [
  { href: "/dashboard/client", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: getDashboardProfilePath("client"),
    icon: UserRound,
    label: "Client Profile",
  },
  {
    href: "/dashboard/client/bookings",
    icon: ClipboardList,
    label: "My Bookings",
  },
  { href: "/browse", icon: Search, label: "Browse Talents" },
];

const talentNavItems: SidebarNavItem[] = [
  { href: "/dashboard/talent", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: getDashboardProfilePath("talent"),
    icon: UserRound,
    label: "Talent Profile",
  },
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
];

function getSidebarSubtitle(role: UserRole) {
  return role === "client" ? "Client Dashboard" : "Talent Dashboard";
}

type AppSidebarProps = {
  avatarUrl: string | null;
  initials: string;
  isTalent: boolean;
  role: UserRole;
};

export function AppSidebar({
  avatarUrl,
  initials,
  isTalent,
  role,
}: AppSidebarProps) {
  const items = role === "client" ? clientNavItems : talentNavItems;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[color:var(--line-strong)] bg-white"
    >
      <SidebarHeader className="h-16 justify-center border-b border-[color:var(--line)] px-4 py-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <div className="flex w-full items-center gap-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:flex-col">
          <BrandMark
            className="min-w-0"
            compactOnSidebarCollapse
            href="/"
            subtitle={getSidebarSubtitle(role)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[color:var(--line)] px-4 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <NavUser
          avatarUrl={avatarUrl}
          initials={initials}
          isTalent={isTalent}
          role={role}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

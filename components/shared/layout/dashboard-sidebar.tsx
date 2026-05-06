"use client";

import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  SquarePen,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { BrandMark } from "@/components/shared/branding/brand-mark";
import {
  getClientAppSessionSnapshot,
  subscribeToAppSession,
} from "@/lib/auth/client-session";
import type { UserRole } from "@/lib/types";

type SidebarItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const clientNavItems: SidebarItem[] = [
  { href: "/dashboard/client", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: UserRound, label: "My Profile" },
  { href: "/dashboard/client/bookings", icon: ClipboardList, label: "My Bookings" },
  { href: "/browse", icon: Search, label: "Browse Talents" },
  { href: "/post-project", icon: SquarePen, label: "Post a Project" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const talentNavItems: SidebarItem[] = [
  { href: "/dashboard/talent", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: UserRound, label: "My Profile" },
  { href: "/dashboard/talent/services", icon: Wrench, label: "My Services" },
  { href: "/dashboard/talent/bookings", icon: ClipboardList, label: "My Bookings" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function getInitials(value: string, fallback: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || fallback.slice(0, 1).toUpperCase();
}

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = role === "client" ? clientNavItems : talentNavItems;
  const session = useSyncExternalStore(
    subscribeToAppSession,
    getClientAppSessionSnapshot,
    () => null,
  );
  const displayName =
    session?.displayName ?? (role === "talent" ? "Talent User" : "Client User");
  const initials = getInitials(displayName, session?.username ?? role);

  useEffect(() => {
    items.forEach((item) => router.prefetch(item.href));
  }, [items, router]);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[color:var(--line-strong)] bg-white">
      <div className="flex h-16 items-center border-b border-[color:var(--line)] px-6">
        <BrandMark href="/" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-[color:var(--brand-orange)]/10 font-semibold text-[color:var(--brand-orange)]"
                  : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
              }`}
            >
              <span className="inline-flex min-w-8 justify-center">
                <Icon className="size-[18px]" strokeWidth={2.1} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[color:var(--line)] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs capitalize text-[color:var(--ink-soft)]">
              {role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

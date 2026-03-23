"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/branding/brand-mark";
import type { UserRole } from "@/types";

type SidebarItem = {
  href: string;
  label: string;
  emoji: string;
};

const clientNavItems: SidebarItem[] = [
  { href: "/dashboard/client", label: "Dashboard", emoji: "🏠" },
  { href: "/dashboard/profile", label: "My Profile", emoji: "👤" },
  { href: "/dashboard/client/bookings", label: "My Bookings", emoji: "📋" },
  { href: "/browse", label: "Browse Talents", emoji: "🔍" },
  { href: "/post-project", label: "Post a Project", emoji: "📝" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
];

const talentNavItems: SidebarItem[] = [
  { href: "/dashboard/talent", label: "Dashboard", emoji: "🏠" },
  { href: "/dashboard/profile", label: "My Profile", emoji: "👤" },
  { href: "/dashboard/talent/services", label: "My Services", emoji: "🛠️" },
  { href: "/dashboard/talent/bookings", label: "My Bookings", emoji: "📋" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
];

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = role === "client" ? clientNavItems : talentNavItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[color:var(--line-strong)] bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[color:var(--line)] px-6">
        <BrandMark href="/" />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] font-semibold"
                  : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="border-t border-[color:var(--line)] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand-orange)] to-[#FF9252] text-sm font-bold text-white">
            {role === "client" ? "A" : "M"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {role === "client" ? "Alex Tan" : "Maria Santos"}
            </p>
            <p className="truncate text-xs text-[color:var(--ink-soft)]">
              {role === "client" ? "Client" : "Talent"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

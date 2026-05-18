import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import type { AdminView } from "@/app/admin/_lib/admin-view";

export type AdminSidebarItem = {
  count: number;
  href: string;
  icon: LucideIcon;
  label: string;
  view: AdminView;
};

type AdminSidebarProps = {
  activeView: AdminView;
  items: AdminSidebarItem[];
};

export function AdminSidebar({ activeView, items }: AdminSidebarProps) {
  return (
    <aside className="border-b border-[color:var(--line-strong)] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="px-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
            Approvals
          </p>
        </div>

        <nav className="mt-4 grid gap-1">
          {items.map((item) => {
            const isActive = item.view === activeView;

            return (
              <Link
                className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-[color:var(--brand-blue)] text-white"
                    : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
                }`}
                href={item.href}
                key={item.view}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                <span
                  className={`min-w-8 rounded-full px-2 py-0.5 text-right text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[color:var(--surface-alt)] text-[color:var(--ink-muted)]"
                  }`}
                >
                  {item.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

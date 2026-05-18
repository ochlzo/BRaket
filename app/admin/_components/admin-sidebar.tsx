import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";

import type { AdminView } from "@/app/admin/_lib/admin-view";

export type AdminSidebarItem = {
  count: number;
  href: string;
  icon: LucideIcon;
  label: string;
  view: AdminView;
};

export type AdminSidebarGroup = {
  count: number;
  href?: string;
  icon: LucideIcon;
  items: AdminSidebarItem[];
  label: string;
  showCount?: boolean;
  view?: AdminView;
};

type AdminSidebarProps = {
  activeView: AdminView;
  groups: AdminSidebarGroup[];
};

export function AdminSidebar({ activeView, groups }: AdminSidebarProps) {
  return (
    <aside className="border-b border-[color:var(--line-strong)] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="px-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
            Admin
          </p>
        </div>

        <nav className="mt-4 grid gap-4">
          {groups.map((group) => {
            const hasActiveItem = group.items.some(
              (item) => item.view === activeView,
            );
            const isDirectActive = group.view === activeView;

            if (group.href && group.view) {
              return (
                <Link
                  className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black transition ${
                    isDirectActive
                      ? "bg-[color:var(--brand-blue)] text-white"
                      : "bg-[color:var(--surface-alt)] text-foreground hover:bg-[color:var(--surface-hover)]"
                  }`}
                  href={group.href}
                  key={group.label}
                >
                  <group.icon className="size-4 shrink-0" />
                  <span className="truncate">{group.label}</span>
                  {group.showCount === false ? null : (
                    <CountBadge count={group.count} isActive={isDirectActive} />
                  )}
                </Link>
              );
            }

            return (
              <details className="group" key={group.label} open={hasActiveItem}>
                <summary
                  className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-[color:var(--surface-alt)] px-3 py-2.5 text-sm font-black text-foreground transition hover:bg-[color:var(--surface-hover)] marker:hidden [&::-webkit-details-marker]:hidden"
                >
                  <group.icon className="size-4 shrink-0" />
                  <span className="truncate">{group.label}</span>
                  <span className="min-w-8 rounded-full bg-white px-2 py-0.5 text-right text-xs text-[color:var(--ink-muted)]">
                    {group.count}
                  </span>
                  <ChevronDown className="size-4 transition group-open:rotate-180" />
                </summary>

                <div className="mt-2 grid gap-1 pl-3">
                  {group.items.map((item) => {
                    const isActive = item.view === activeView;

                    return (
                      <Link
                        className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition ${
                          isActive
                            ? "bg-[color:var(--brand-blue)] text-white"
                            : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
                        }`}
                        href={item.href}
                        key={item.view}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        <CountBadge count={item.count} isActive={isActive} />
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function CountBadge({ count, isActive }: { count: number; isActive: boolean }) {
  return (
    <span
      className={`min-w-8 rounded-full px-2 py-0.5 text-right text-xs ${
        isActive
          ? "bg-white text-[color:var(--brand-blue)]"
          : "bg-[color:var(--surface-alt)] text-[color:var(--ink-muted)]"
      }`}
    >
      {count}
    </span>
  );
}

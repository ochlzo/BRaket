import type { ReactNode } from "react";
import type { UserRole } from "@/lib/types";
import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  noScroll?: boolean;
};

export function DashboardLayout({
  children,
  role,
  title,
  subtitle,
  action,
  noScroll = false,
}: DashboardLayoutProps) {
  return (
    <div className={`flex bg-[color:var(--surface-alt)] ${noScroll ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <DashboardSidebar role={role} />

      {/* Main content area */}
      <main className={`flex-1 pl-64 ${noScroll ? "flex flex-col h-screen" : ""}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 shrink-0 flex items-center justify-between border-b border-[color:var(--line)] bg-white/80 px-6 py-2 backdrop-blur-xl">
          <div>
            <h1 className="text-base font-bold tracking-[-0.02em] text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-[color:var(--ink-muted)]">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Page content */}
        <div className={`px-8 py-5 ${noScroll ? "flex-1 overflow-hidden" : "pb-8"}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

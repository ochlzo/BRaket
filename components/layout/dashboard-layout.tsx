import type { ReactNode } from "react";
import type { UserRole } from "@/types";
import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function DashboardLayout({
  children,
  role,
  title,
  subtitle,
  action,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[color:var(--surface-alt)]">
      <DashboardSidebar role={role} />

      {/* Main content area */}
      <main className="flex-1 pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--line)] bg-white/80 px-8 py-5 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-bold tracking-[-0.02em] text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Page content */}
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

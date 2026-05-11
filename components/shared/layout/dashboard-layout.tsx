import type { ReactNode } from "react";
import type { UserRole } from "@/lib/types";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <AppSidebar role={role} />

      <SidebarInset
        className={`flex flex-col bg-[color:var(--surface-alt)] ${noScroll ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[color:var(--line)] bg-white/80 px-6 backdrop-blur-xl">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold tracking-[-0.02em] text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[color:var(--ink-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        <div
          className={`px-8 py-5 ${noScroll ? "flex-1 overflow-hidden" : "pb-8"}`}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

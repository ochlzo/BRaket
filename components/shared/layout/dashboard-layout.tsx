import type { ReactNode } from "react";
import { cookies } from "next/headers";
import type { UserRole } from "@/lib/types";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentAppUser } from "@/server/users/current-user";

type DashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  noScroll?: boolean;
};

export async function DashboardLayout({
  children,
  role,
  title,
  subtitle,
  action,
  noScroll = false,
}: DashboardLayoutProps) {
  const [currentUser, cookieStore] = await Promise.all([
    getCurrentAppUser(),
    cookies(),
  ]);
  const defaultSidebarOpen =
    cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar
        avatarUrl={currentUser?.avatarUrl ?? null}
        initials={currentUser?.initials ?? ""}
        isTalent={currentUser?.isTalent ?? false}
        role={role}
      />

      <SidebarInset
        className={`flex flex-col bg-[color:var(--surface-alt)] ${noScroll ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[color:var(--line)] bg-white/80 px-4 backdrop-blur-xl sm:px-6">
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
          className={`px-4 py-4 sm:px-6 sm:py-5 lg:px-8 ${noScroll ? "flex-1 overflow-hidden" : "pb-8"}`}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

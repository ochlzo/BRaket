"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  getClientAppSessionSnapshot,
  subscribeToAppSession,
} from "@/lib/auth/client-session";
import { getDashboardProfilePath } from "@/lib/auth/session";
import { clearAppSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

function getInitials(value: string, fallback: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || fallback.slice(0, 1).toUpperCase();
}

export function NavUser({ role }: { role: UserRole }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToAppSession,
    getClientAppSessionSnapshot,
    () => null,
  );
  const displayName =
    session?.displayName ?? (role === "talent" ? "Talent User" : "Client User");
  const username = session?.username ?? role;
  const initials = getInitials(displayName, username);

  const handleSignOut = async () => {
    const supabase = createClient();

    try {
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      clearAppSession();
      window.location.href = "/";
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-xl aria-expanded:bg-[color:var(--surface-alt)]"
              />
            }
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-[color:var(--ink-muted)]">
                @{username}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-[color:var(--ink-muted)]">
                      @{username}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push(getDashboardProfilePath(role))}
              >
                <UserRound />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(role === "talent" ? "/dashboard/talent" : "/dashboard/client")
                }
              >
                <LayoutDashboard />
                Dashboard
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTransition, useSyncExternalStore } from "react";
import {
  ChevronsUpDown,
  LogOut,
  Settings,
  UserPlus,
  UserRound,
} from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
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
import { clearAppSession } from "@/lib/auth/session";
import { getNavUserProfileMenu } from "@/lib/dashboard/nav-user-menu";
import { createClient } from "@/lib/supabase/client";
import { resolveTalentRegistrationPathAction } from "@/server/talent-onboarding/resolve-talent-registration-path";
import type { UserRole } from "@/lib/types";

type NavUserProps = {
  avatarUrl: string | null;
  initials: string;
  isTalent: boolean;
  role: UserRole;
};

export function NavUser({
  avatarUrl,
  initials,
  isTalent,
  role,
}: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isRoutingTalent, startTalentRouting] = useTransition();
  const session = useSyncExternalStore(
    subscribeToAppSession,
    getClientAppSessionSnapshot,
    () => null,
  );
  const displayName =
    session?.displayName ?? (role === "talent" ? "Talent User" : "Client User");
  const username = session?.username ?? role;
  const profileMenu = getNavUserProfileMenu({ isTalent, role });
  const ProfileMenuIcon = profileMenu.icon === "user" ? UserRound : UserPlus;

  function handleProfileMenuClick() {
    if (profileMenu.href) {
      router.push(profileMenu.href);
      return;
    }

    startTalentRouting(async () => {
      const path = await resolveTalentRegistrationPathAction();
      router.push(
        path === "/onboarding/talent/verification"
          ? "/talent/verify?source=dashboard"
          : path,
      );
    });
  }

  const handleSignOut = async () => {
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
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
                className="rounded-xl transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-[var(--shadow-menu)] aria-expanded:bg-[color:var(--surface-alt)] aria-expanded:shadow-[var(--shadow-menu)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full"
              />
            }
          >
            <UserAvatar
              alt={displayName}
              className="h-9 w-9 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
              initials={initials}
              src={avatarUrl}
            />
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-[color:var(--ink-muted)]">
                @{username}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
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
                  <UserAvatar
                    alt={displayName}
                    className="h-9 w-9"
                    initials={initials}
                    src={avatarUrl}
                  />
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
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isRoutingTalent}
                onClick={handleProfileMenuClick}
              >
                <ProfileMenuIcon />
                {profileMenu.label}
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

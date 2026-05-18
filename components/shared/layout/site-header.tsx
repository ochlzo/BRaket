"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { BrandMark } from "@/components/shared/branding/brand-mark";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  getClientAppSessionSnapshot,
  subscribeToAppSession,
} from "@/lib/auth/client-session";
import {
  clearAppSession,
  getDashboardProfilePath,
  saveAppSession,
} from "@/lib/auth/session";
import type { NavItem } from "@/lib/content/navigation";
import { semantic } from "@/lib/theme/semantic";
import { createClient } from "@/lib/supabase/client";
import { getCurrentAppSessionAction } from "@/server/users/get-current-app-session-action";

type SiteHeaderProps = {
  activeHref: string;
  ctaHref: string;
  ctaLabel?: string;
  homeHref?: string;
  items: NavItem[];
  signInHref: string;
};

function getInitials(value: string, fallback: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || fallback.slice(0, 1).toUpperCase();
}

export function SiteHeader({
  activeHref,
  homeHref = "/",
  items,
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const session = useSyncExternalStore(
    subscribeToAppSession,
    getClientAppSessionSnapshot,
    () => null,
  );
  const sessionLabel = session?.displayName ?? "Your account";
  const sessionInitials = session
    ? getInitials(sessionLabel, session.username)
    : "";

  useEffect(() => {
    if (!session) {
      return;
    }

    const currentSession = session;
    let isActive = true;

    async function refreshSessionAvatar() {
      const nextSession = await getCurrentAppSessionAction();

      if (!isActive || !nextSession) {
        return;
      }

      if (
        nextSession.avatarUrl !== currentSession.avatarUrl ||
        nextSession.displayName !== currentSession.displayName ||
        nextSession.username !== currentSession.username ||
        nextSession.type !== currentSession.type
      ) {
        saveAppSession(nextSession);
      }
    }

    void refreshSessionAvatar();

    return () => {
      isActive = false;
    };
  }, [session]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line)] bg-white/82 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <BrandMark href={homeHref} />
        <nav className="typo-meta absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-[color:var(--ink-muted)] md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              className={
                item.href === activeHref
                  ? "typo-label-sm text-foreground"
                  : undefined
              }
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {mounted && session ? (
            <div className="group relative">
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm font-bold text-foreground transition-colors hover:border-[color:var(--brand-orange)] focus:outline-none"
              >
                <UserAvatar
                  alt={sessionLabel}
                  className="h-full w-full"
                  initials={sessionInitials}
                  src={session.avatarUrl}
                />
              </button>

              <div className="absolute right-0 top-full z-50 hidden w-48 pt-2 group-hover:block">
                <div className="overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">
                      {sessionLabel}
                    </p>
                    <p className="truncate text-xs font-medium text-[color:var(--ink-muted)]">
                      @{session.username}
                    </p>
                  </div>
                  <div className="h-px bg-[color:var(--line-strong)]" />
                  <div className="p-1.5">
                    <Link
                      href={getDashboardProfilePath(session.type)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
                    >
                      My Profile
                    </Link>
                    <Link
                      href={
                        session.type === "talent"
                          ? "/dashboard/talent"
                          : "/dashboard/client"
                      }
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <div className="h-px bg-[color:var(--line-strong)]" />
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={async () => {
                        const supabase = createClient();
                        try {
                          await supabase.auth.signOut();
                        } finally {
                          clearAppSession();
                          window.location.href = "/";
                        }
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[color:var(--tone-red-base)] hover:bg-[color:var(--tone-red-soft)] hover:text-[color:var(--tone-red-deep)]"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : mounted ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-[color:var(--ink-muted)] transition-colors hover:text-foreground md:inline-flex"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`hidden md:inline-flex !text-white ${semantic.button.brandOrange}`}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="h-10 w-[8.25rem] opacity-0" />
          )}
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-white text-foreground transition hover:bg-[color:var(--surface-alt)] md:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <XIcon aria-hidden="true" className="h-5 w-5" />
            ) : (
              <MenuIcon aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <div className="border-t border-[color:var(--line)] bg-white px-5 pb-5 pt-3 shadow-[var(--shadow-menu)] md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                className={
                  item.href === activeHref
                    ? "rounded-xl bg-[color:var(--surface-alt)] px-3 py-2.5 text-sm font-semibold text-foreground"
                    : "rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--ink-body)] transition hover:bg-[color:var(--surface-alt)] hover:text-foreground"
                }
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mx-auto mt-4 grid max-w-7xl gap-3 border-t border-[color:var(--line)] pt-4">
            {mounted && session ? (
              <>
                <Link
                  href={getDashboardProfilePath(session.type)}
                  className={semantic.button.outlineNeutral}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href={
                    session.type === "talent"
                      ? "/dashboard/talent"
                      : "/dashboard/client"
                  }
                  className={semantic.button.brandOrange}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : mounted ? (
              <>
                <Link
                  href="/login"
                  className={semantic.button.outlineNeutral}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={semantic.button.brandOrange}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

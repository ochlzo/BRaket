"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/branding/brand-mark";
import type { NavItem } from "@/content/navigation";
import { semantic } from "@/theme/semantic";
import Image from "next/image";

type Session = { type: string; username: string };

const subscribeToStorage = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
};

const getClientSessionSnapshot = (): Session | null => {
  const data = localStorage.getItem("braket_session");
  if (!data) return null;

  try {
    return JSON.parse(data) as Session;
  } catch {
    return null;
  }
};

type SiteHeaderProps = {
  activeHref: string;
  ctaHref: string;
  ctaLabel?: string;
  homeHref?: string;
  items: NavItem[];
  signInHref: string;
};

export function SiteHeader({
  activeHref,
  homeHref = "/",
  items,
}: SiteHeaderProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const session = useSyncExternalStore(
    subscribeToStorage,
    getClientSessionSnapshot,
    () => null,
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line)] bg-white/82 backdrop-blur-xl">
      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <BrandMark href={homeHref} />
        <nav className="typo-meta hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-[color:var(--ink-muted)] md:flex">
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
              {/* Profile Avatar Trigger */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] transition-colors hover:border-[color:var(--brand-orange)] focus:outline-none"
              >
                <Image
                  src={
                    session.type === "talent"
                      ? "/images/avatar_maria.png"
                      : "/images/avatar_john.png"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

              {/* Dropdown Menu (wrapper with top padding keeps cursor on the element to prevent hover closing) */}
              <div className="absolute right-0 top-full hidden pt-2 group-hover:block w-48 z-50">
                <div className="overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">
                      {session.type === "talent"
                        ? "Maria Santos"
                        : "Client User"}
                    </p>
                    <p className="truncate text-xs font-medium text-[color:var(--ink-muted)]">
                      @{session.username}
                    </p>
                  </div>
                  <div className="h-px bg-[color:var(--line-strong)]" />
                  <div className="p-1.5">
                    <Link
                      href={
                        session.type === "talent"
                          ? `/talent/${session.username}`
                          : "/dashboard/client"
                      }
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
                      onClick={() => {
                        localStorage.removeItem("braket_session");
                        window.location.href = "/";
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
        </div>
      </div>
    </header>
  );
}

"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getDashboardProfilePath } from "@/lib/auth/session";
import { semantic } from "@/lib/theme/semantic";
import type { UserRole } from "@/lib/types";

type SiteHeaderProfileMenuProps = {
  isTalent?: boolean;
  role: UserRole;
};

export function SiteHeaderProfileMenu({
  isTalent,
  role,
}: SiteHeaderProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isTalent) {
    return (
      <Link
        href={getDashboardProfilePath(role)}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
      >
        My Profile
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground focus:bg-[color:var(--surface-alt)] focus:text-foreground focus:outline-none"
      >
        <ChevronLeftIcon aria-hidden="true" className="h-3.5 w-3.5" />
        My Profile
      </button>
      {isOpen ? (
        <div className="absolute right-full top-0 min-w-40 pr-2">
          <div className="rounded-xl border border-[color:var(--line-strong)] bg-white p-1.5 shadow-[var(--shadow-menu)]">
            <Link
              href="/dashboard/client/profile"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Client Profile
            </Link>
            <Link
              href="/dashboard/talent/profile"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)] hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Talent Profile
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type SiteHeaderMobileProfileLinksProps = SiteHeaderProfileMenuProps & {
  onNavigate: () => void;
};

export function SiteHeaderMobileProfileLinks({
  isTalent,
  onNavigate,
  role,
}: SiteHeaderMobileProfileLinksProps) {
  if (!isTalent) {
    return (
      <Link
        href={getDashboardProfilePath(role)}
        className={semantic.button.outlineNeutral}
        onClick={onNavigate}
      >
        My Profile
      </Link>
    );
  }

  return (
    <div className="grid gap-2">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--ink-muted)]">
        My Profile
      </p>
      <Link
        href="/dashboard/client/profile"
        className={semantic.button.outlineNeutral}
        onClick={onNavigate}
      >
        Client Profile
      </Link>
      <Link
        href="/dashboard/talent/profile"
        className={semantic.button.outlineNeutral}
        onClick={onNavigate}
      >
        Talent Profile
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";

type BrandMarkProps = {
  href: string;
  subtitle?: string;
  variant?: "default" | "light";
  className?: string;
  compactOnSidebarCollapse?: boolean;
};

export function BrandMark({
  href,
  subtitle,
  variant = "default",
  className = "",
  compactOnSidebarCollapse = false,
}: BrandMarkProps) {
  const textClassName = variant === "light" ? "text-white" : "text-foreground";
  const subtitleClassName =
    variant === "light"
      ? "text-white/70"
      : "text-[color:var(--ink-muted)]";
  const collapsedTextClassName = compactOnSidebarCollapse
    ? "group-data-[collapsible=icon]:hidden"
    : "";
  const collapsedRootClassName = compactOnSidebarCollapse
    ? "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:translate-x-0.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
    : "";
  const collapsedBadgeClassName = compactOnSidebarCollapse
    ? "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg"
    : "";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 ${collapsedRootClassName} ${className}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={`typo-brand-badge flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-strong)] text-white ${collapsedBadgeClassName}`}
      >
        B
      </div>
      <div
        className={`grid flex-1 text-left leading-tight ${collapsedTextClassName}`}
      >
        <span className={`typo-brand ${textClassName}`}>BRaket</span>
        {subtitle ? (
          <span className={`truncate text-xs ${subtitleClassName}`}>
            {subtitle}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type PageShellProps = {
  activeHref: string;
  children: ReactNode;
  className?: string;
  ctaHref: string;
  ctaLabel?: string;
  homeHref?: string;
  items: Array<{ href: string; label: string }>;
  signInHref: string;
};

export function PageShell({
  activeHref,
  children,
  className,
  ctaHref,
  ctaLabel,
  homeHref,
  items,
  signInHref,
}: PageShellProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className ?? ""}`}>
      <SiteHeader
        activeHref={activeHref}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        homeHref={homeHref}
        items={items}
        signInHref={signInHref}
      />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

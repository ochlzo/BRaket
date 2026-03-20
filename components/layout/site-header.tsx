import { BrandMark } from "@/components/branding/brand-mark";
import type { NavItem } from "@/content/navigation";
import { semantic } from "@/theme/semantic";

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
  ctaHref,
  ctaLabel = "Get Started",
  homeHref = "/",
  items,
  signInHref,
}: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line)] bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <BrandMark href={homeHref} />
        <nav className="hidden items-center gap-8 text-sm text-[color:var(--ink-muted)] md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              className={item.href === activeHref ? "font-semibold text-foreground" : undefined}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a className={`hidden md:inline-flex ${semantic.button.outlineNeutral}`} href={signInHref}>
            Sign In
          </a>
          <a className={semantic.button.brandOrange} href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

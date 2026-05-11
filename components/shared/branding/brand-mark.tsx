type BrandMarkProps = {
  href: string;
  subtitle?: string;
  variant?: "default" | "light";
};

export function BrandMark({
  href,
  subtitle,
  variant = "default",
}: BrandMarkProps) {
  const textClassName = variant === "light" ? "text-white" : "text-foreground";
  const subtitleClassName =
    variant === "light"
      ? "text-white/70"
      : "text-[color:var(--ink-muted)]";

  return (
    <a href={href} className="flex items-center gap-3">
      <div className="typo-brand-badge flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-strong)] text-white">
        B
      </div>
      <div className="grid flex-1 text-left leading-tight">
        <span className={`typo-brand ${textClassName}`}>BRaket</span>
        {subtitle ? (
          <span className={`truncate text-xs ${subtitleClassName}`}>
            {subtitle}
          </span>
        ) : null}
      </div>
    </a>
  );
}

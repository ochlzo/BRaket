type BrandMarkProps = {
  href: string;
  variant?: "default" | "light";
};

export function BrandMark({ href, variant = "default" }: BrandMarkProps) {
  const textClassName = variant === "light" ? "text-white" : "text-foreground";

  return (
    <a href={href} className="flex items-center gap-3">
      <div className="typo-brand-badge flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-strong)] text-white">
        B
      </div>
      <span className={`typo-brand ${textClassName}`}>BRaket</span>
    </a>
  );
}

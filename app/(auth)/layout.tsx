import { BrandMark } from "@/components/shared/branding/brand-mark";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BRaket – Sign In or Create Account",
  description:
    "Access the BRaket platform – discover talent and commission opportunities for Bicol University students.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen">
      {/* ── Left decorative panel ── */}
      <div className="relative hidden w-[52%] overflow-hidden bg-gradient-to-br from-[color:var(--brand-orange)] via-[#FF9252] to-[color:var(--brand-blue)] lg:flex lg:flex-col lg:justify-between">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[color:var(--brand-blue)]/20 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 pt-10">
          <BrandMark href="/" variant="light" />
        </div>

        <div className="relative z-10 space-y-8 px-12 pb-20">
          <div className="space-y-6">
            <h2 className="max-w-md text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] text-white xl:text-5xl">
              Discover talent.{" "}
              <span className="text-white/80">Unlock potential.</span>
            </h2>
            <p className="max-w-md text-base leading-7 text-white/70">
              Join hundreds of Bicol University students already building
              income, experience, and stronger portfolios on BRaket.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "from-white/40 to-white/20",
                "from-[#FF9252]/80 to-[#FF6B35]/80",
                "from-[color:var(--brand-blue)]/80 to-[#29B6F6]/80",
                "from-white/30 to-white/10",
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`h-10 w-10 rounded-full border-2 border-white/30 bg-gradient-to-br ${gradient}`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white/70">
              <span className="font-bold text-white">500+ students</span>{" "}
              already earning
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3">
            {["Verified Talents", "Secure Payments", "Real Portfolios"].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {badge}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <BrandMark href="/" />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center text-xs text-[color:var(--ink-soft)]">
          © {new Date().getFullYear()} BRaket. All rights reserved.
        </div>
      </div>
    </div>
  );
}

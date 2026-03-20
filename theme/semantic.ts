export const semantic = {
  text: {
    heading: "text-foreground",
    muted: "text-[color:var(--ink-muted)]",
    body: "text-[color:var(--ink-body)]",
    subtle: "text-[color:var(--ink-soft)]",
    inverse: "text-white",
  },
  border: {
    subtle: "border-[color:var(--line)]",
    strong: "border-[color:var(--line-strong)]",
  },
  button: {
    brandOrange:
      "inline-flex items-center justify-center rounded-full bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-orange-strong)]",
    brandOrangeLg:
      "inline-flex items-center justify-center rounded-full bg-[color:var(--brand-orange)] px-7 py-4 text-base font-semibold text-white transition hover:bg-[color:var(--brand-orange-strong)]",
    brandBlue:
      "inline-flex items-center justify-center rounded-full bg-[color:var(--brand-blue)] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(79,195,247,0.28)] transition hover:bg-[color:var(--brand-blue-strong)]",
    brandBlueMd:
      "inline-flex items-center justify-center rounded-full bg-[color:var(--brand-blue)] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[color:var(--brand-blue-strong)]",
    brandIndigoLg:
      "inline-flex items-center justify-center rounded-full bg-[color:var(--brand-indigo)] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[color:var(--brand-indigo-strong)]",
    outlineNeutral:
      "inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-black/5",
    outlineNeutralStrong:
      "inline-flex items-center justify-center rounded-full border-2 border-[#d9dde5] px-7 py-4 text-base font-semibold text-foreground transition hover:border-[#bcc6d6] hover:bg-white/70",
    outlineDark:
      "inline-flex items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-white",
    outlineWhite:
      "inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10",
    whiteOrange:
      "inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-bold text-[color:var(--brand-orange)] transition hover:bg-[#fff5ef]",
    whiteIndigo:
      "inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-[color:var(--brand-indigo)] transition hover:bg-[#F7F7FB]",
  },
  panel: {
    elevated: "rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(59,52,44,0.08)]",
    card: "rounded-[1.75rem] border border-[color:var(--line-strong)] bg-white",
  },
} as const;

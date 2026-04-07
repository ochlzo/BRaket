import { paletteVars } from "@/lib/theme/palette";

export const semantic = {
  text: {
    heading: "text-foreground",
    muted: `text-[color:${paletteVars.neutral.muted}]`,
    body: `text-[color:${paletteVars.neutral.body}]`,
    subtle: `text-[color:${paletteVars.neutral.mutedSoft}]`,
    inverse: "text-white",
  },
  border: {
    subtle: `border-[color:${paletteVars.neutral.line}]`,
    strong: `border-[color:${paletteVars.neutral.lineStrong}]`,
  },
  button: {
    brandOrange:
      `inline-flex items-center justify-center rounded-full bg-[color:${paletteVars.brand.orange}] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:${paletteVars.brand.orangeStrong}]`,
    brandOrangeLg:
      `inline-flex items-center justify-center rounded-full bg-[color:${paletteVars.brand.orange}] px-7 py-4 text-base font-semibold text-white transition hover:bg-[color:${paletteVars.brand.orangeStrong}]`,
    brandBlue:
      `inline-flex items-center justify-center rounded-full bg-[color:${paletteVars.brand.blue}] px-7 py-4 text-base font-semibold text-white shadow-[var(--shadow-brand-blue-md)] transition hover:bg-[color:${paletteVars.brand.blueStrong}]`,
    brandBlueMd:
      `inline-flex items-center justify-center rounded-full bg-[color:${paletteVars.brand.blue}] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[color:${paletteVars.brand.blueStrong}]`,
    brandIndigoLg:
      `inline-flex items-center justify-center rounded-full bg-[color:${paletteVars.brand.indigo}] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[color:${paletteVars.brand.indigoStrong}]`,
    outlineNeutral:
      `inline-flex items-center justify-center rounded-full border border-[color:${paletteVars.neutral.line}] px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-black/5`,
    outlineNeutralStrong:
      `inline-flex items-center justify-center rounded-full border-2 border-[color:${paletteVars.neutral.lineStrong}] px-7 py-4 text-base font-semibold text-foreground transition hover:border-[color:${paletteVars.neutral.line}] hover:bg-white/70`,
    outlineDark:
      "inline-flex items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-white",
    outlineWhite:
      "inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10",
    whiteOrange:
      `inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-bold text-[color:${paletteVars.brand.orange}] transition hover:bg-[color:${paletteVars.neutral.surfaceSoft}]`,
    whiteIndigo:
      `inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-[color:${paletteVars.brand.indigo}] transition hover:bg-[color:${paletteVars.neutral.surfaceAlt}]`,
  },
  panel: {
    elevated: "rounded-[2rem] bg-white shadow-[var(--shadow-panel-elevated)]",
    card: `rounded-[1.75rem] border border-[color:${paletteVars.neutral.lineStrong}] bg-white`,
  },
} as const;


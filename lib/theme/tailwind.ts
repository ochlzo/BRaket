import { paletteVars } from "@/lib/theme/palette";

export const toneStyles = {
  sky: {
    card: `bg-[color:${paletteVars.tones.sky.soft}]`,
    pale: `bg-[color:${paletteVars.tones.sky.pale}]`,
    icon: `bg-white text-[color:${paletteVars.tones.sky.base}]`,
    text: `text-[color:${paletteVars.tones.sky.deep}]`,
    dot: `bg-[color:${paletteVars.tones.sky.base}]`,
  },
  orange: {
    card: `bg-[color:${paletteVars.tones.orange.soft}]`,
    pale: `bg-[color:${paletteVars.tones.orange.pale}]`,
    icon: `bg-white text-[color:${paletteVars.tones.orange.base}]`,
    text: `text-[color:${paletteVars.tones.orange.base}]`,
    dot: `bg-[color:${paletteVars.tones.orange.base}]`,
  },
  teal: {
    card: `bg-[color:${paletteVars.tones.teal.soft}]`,
    pale: `bg-[color:${paletteVars.tones.sky.pale}]`,
    icon: `bg-white text-[color:${paletteVars.tones.teal.base}]`,
    text: `text-[color:${paletteVars.tones.teal.deep}]`,
    dot: `bg-[color:${paletteVars.tones.teal.base}]`,
  },
  indigo: {
    card: `bg-[color:${paletteVars.tones.indigo.soft}]`,
    pale: `bg-[color:${paletteVars.tones.indigo.soft}]`,
    icon: `bg-white text-[color:${paletteVars.tones.indigo.base}]`,
    text: `text-[color:${paletteVars.tones.indigo.base}]`,
    dot: `bg-[color:${paletteVars.tones.indigo.base}]`,
  },
  green: {
    card: `bg-[color:${paletteVars.tones.green.soft}]`,
    pale: `bg-[color:${paletteVars.tones.green.soft}]`,
    icon: `bg-white text-[color:${paletteVars.tones.green.base}]`,
    text: `text-[color:${paletteVars.tones.green.base}]`,
    dot: `bg-[color:${paletteVars.tones.green.base}]`,
  },
  purple: {
    card: `bg-[color:${paletteVars.tones.purple.soft}]`,
    pale: `bg-[color:${paletteVars.tones.purple.soft}]`,
    icon: `bg-white text-[color:${paletteVars.tones.purple.base}]`,
    text: `text-[color:${paletteVars.tones.purple.base}]`,
    dot: `bg-[color:${paletteVars.tones.purple.base}]`,
  },
  amber: {
    card: `bg-[color:${paletteVars.tones.amber.soft}]`,
    pale: `bg-[color:${paletteVars.tones.amber.soft}]`,
    icon: `bg-[color:${paletteVars.tones.amber.soft}] text-[color:${paletteVars.tones.amber.base}]`,
    text: `text-[color:${paletteVars.tones.amber.base}]`,
    dot: `bg-[color:${paletteVars.tones.amber.base}]`,
  },
  red: {
    card: `bg-[color:${paletteVars.tones.red.soft}]`,
    pale: `bg-[color:${paletteVars.tones.red.soft}]`,
    icon: `bg-white text-[color:${paletteVars.tones.red.base}]`,
    text: `text-[color:${paletteVars.tones.red.base}]`,
    dot: `bg-[color:${paletteVars.tones.red.base}]`,
  },
  pink: {
    card: `bg-[color:${paletteVars.tones.pink.soft}]`,
    pale: `bg-[color:${paletteVars.tones.pink.soft}]`,
    icon: `bg-[color:${paletteVars.tones.pink.soft}] text-[color:${paletteVars.tones.pink.base}]`,
    text: `text-[color:${paletteVars.tones.pink.base}]`,
    dot: `bg-[color:${paletteVars.tones.pink.base}]`,
  },
} as const;

export type ToneName = keyof typeof toneStyles;

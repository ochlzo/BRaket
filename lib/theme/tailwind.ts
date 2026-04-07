export const toneStyles = {
  sky: {
    card: "bg-[color:var(--tone-sky-soft)]",
    pale: "bg-[color:var(--tone-sky-pale)]",
    icon: "bg-white text-[color:var(--tone-sky-base)]",
    text: "text-[color:var(--tone-sky-deep)]",
    dot: "bg-[color:var(--tone-sky-base)]",
  },
  orange: {
    card: "bg-[color:var(--tone-orange-soft)]",
    pale: "bg-[color:var(--tone-orange-pale)]",
    icon: "bg-white text-[color:var(--tone-orange-base)]",
    text: "text-[color:var(--tone-orange-base)]",
    dot: "bg-[color:var(--tone-orange-base)]",
  },
  teal: {
    card: "bg-[color:var(--tone-teal-soft)]",
    pale: "bg-[color:var(--tone-sky-pale)]",
    icon: "bg-white text-[color:var(--tone-teal-base)]",
    text: "text-[color:var(--tone-teal-deep)]",
    dot: "bg-[color:var(--tone-teal-base)]",
  },
  indigo: {
    card: "bg-[color:var(--tone-indigo-soft)]",
    pale: "bg-[color:var(--tone-indigo-soft)]",
    icon: "bg-white text-[color:var(--tone-indigo-base)]",
    text: "text-[color:var(--tone-indigo-base)]",
    dot: "bg-[color:var(--tone-indigo-base)]",
  },
  green: {
    card: "bg-[color:var(--tone-green-soft)]",
    pale: "bg-[color:var(--tone-green-soft)]",
    icon: "bg-white text-[color:var(--tone-green-base)]",
    text: "text-[color:var(--tone-green-base)]",
    dot: "bg-[color:var(--tone-green-base)]",
  },
  purple: {
    card: "bg-[color:var(--tone-purple-soft)]",
    pale: "bg-[color:var(--tone-purple-soft)]",
    icon: "bg-white text-[color:var(--tone-purple-base)]",
    text: "text-[color:var(--tone-purple-base)]",
    dot: "bg-[color:var(--tone-purple-base)]",
  },
  amber: {
    card: "bg-[color:var(--tone-amber-soft)]",
    pale: "bg-[color:var(--tone-amber-soft)]",
    icon: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-base)]",
    text: "text-[color:var(--tone-amber-base)]",
    dot: "bg-[color:var(--tone-amber-base)]",
  },
  red: {
    card: "bg-[color:var(--tone-red-soft)]",
    pale: "bg-[color:var(--tone-red-soft)]",
    icon: "bg-white text-[color:var(--tone-red-base)]",
    text: "text-[color:var(--tone-red-base)]",
    dot: "bg-[color:var(--tone-red-base)]",
  },
  pink: {
    card: "bg-[color:var(--tone-pink-soft)]",
    pale: "bg-[color:var(--tone-pink-soft)]",
    icon: "bg-[color:var(--tone-pink-soft)] text-[color:var(--tone-pink-base)]",
    text: "text-[color:var(--tone-pink-base)]",
    dot: "bg-[color:var(--tone-pink-base)]",
  },
} as const;

export type ToneName = keyof typeof toneStyles;

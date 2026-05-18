export type BoostProfileStyle = {
  avatar: string;
  badge: string;
};

const baseBoostProfileStyle: BoostProfileStyle = {
  avatar: "border-4 border-white",
  badge:
    "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
};

const boostProfileStyles: Record<string, BoostProfileStyle> = {
  "premium-boost": {
    avatar: "border-4 border-[color:var(--tone-green-base)]",
    badge:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  },
  "pro-boost": {
    avatar: "border-4 border-[color:var(--tone-indigo-base)]",
    badge:
      "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  },
  "starter-boost": {
    avatar: "border-4 border-[color:var(--tone-orange-base)]",
    badge:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
  },
};

export function getBoostProfileStyle(slug: string | null | undefined) {
  return slug
    ? boostProfileStyles[slug] ?? baseBoostProfileStyle
    : baseBoostProfileStyle;
}

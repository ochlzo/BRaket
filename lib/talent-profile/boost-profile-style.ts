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
    avatar: "overflow-hidden border-0 ring-4 ring-[color:var(--tone-green-base)] after:border-0",
    badge:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  },
  "pro-boost": {
    avatar: "overflow-hidden border-0 ring-4 ring-[color:var(--tone-indigo-base)] after:border-0",
    badge:
      "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  },
  "starter-boost": {
    avatar: "overflow-hidden border-0 ring-4 ring-[color:var(--tone-orange-base)] after:border-0",
    badge:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
  },
};

export function getBoostProfileStyle(slug: string | null | undefined) {
  return slug
    ? boostProfileStyles[slug] ?? baseBoostProfileStyle
    : baseBoostProfileStyle;
}

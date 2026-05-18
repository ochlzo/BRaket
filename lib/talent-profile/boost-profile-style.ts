export type BoostProfileStyle = {
  badge: string;
  frame: string;
};

const baseBoostProfileStyle: BoostProfileStyle = {
  badge:
    "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
  frame: "",
};

const boostProfileStyles: Record<string, BoostProfileStyle> = {
  "premium-boost": {
    badge:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
    frame: "border-2 border-[color:var(--tone-green-base)]",
  },
  "pro-boost": {
    badge:
      "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
    frame: "border-2 border-[color:var(--tone-indigo-base)]",
  },
  "starter-boost": {
    badge:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
    frame: "border-2 border-[color:var(--tone-orange-base)]",
  },
};

export function getBoostProfileStyle(slug: string | null | undefined) {
  return slug
    ? boostProfileStyles[slug] ?? baseBoostProfileStyle
    : baseBoostProfileStyle;
}

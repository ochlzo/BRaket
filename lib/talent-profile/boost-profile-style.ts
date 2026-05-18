export type BoostProfileStyle = {
  avatar: string;
  badge: string;
  frame: string;
};

const baseBoostProfileStyle: BoostProfileStyle = {
  avatar: "",
  badge:
    "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
  frame: "",
};

const boostProfileStyles: Record<string, BoostProfileStyle> = {
  "premium-boost": {
    avatar: "border-[color:var(--tone-green-base)]",
    badge:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
    frame:
      "border-2 border-[color:var(--tone-green-base)] ring-2 ring-[color:var(--tone-green-base)]/25",
  },
  "pro-boost": {
    avatar: "border-[color:var(--tone-indigo-base)]",
    badge:
      "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
    frame:
      "border-2 border-[color:var(--tone-indigo-base)] ring-2 ring-[color:var(--tone-indigo-base)]/25",
  },
  "starter-boost": {
    avatar: "border-[color:var(--tone-orange-base)]",
    badge:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
    frame:
      "border-2 border-[color:var(--tone-orange-base)] ring-2 ring-[color:var(--tone-orange-base)]/25",
  },
};

export function getBoostProfileStyle(slug: string | null | undefined) {
  return slug ? boostProfileStyles[slug] ?? baseBoostProfileStyle : baseBoostProfileStyle;
}

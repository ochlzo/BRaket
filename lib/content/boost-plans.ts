export type BoostPlan = {
  amount: number;
  badgeLabel: string;
  boostPlanId: string;
  description: string;
  durationDays: number;
  features: string[];
  name: string;
  price: number;
  slug: string;
  visibilityRank: number;
};

export const boostPlans: BoostPlan[] = [
  {
    amount: 9900,
    badgeLabel: "Starter Boost",
    boostPlanId: "4d334f1e-2dc7-4a46-8d64-8b1ec4110001",
    description: "Boost your talent profile for a focused one-week run.",
    durationDays: 7,
    features: [
      "Profile boost label",
      "7-day visibility boost",
      "Entry-level profile promotion",
    ],
    name: "Starter Boost",
    price: 99,
    slug: "starter-boost",
    visibilityRank: 1,
  },
  {
    amount: 19900,
    badgeLabel: "Pro Boost",
    boostPlanId: "4d334f1e-2dc7-4a46-8d64-8b1ec4110002",
    description: "Keep your talent profile visible longer with a mid-tier boost.",
    durationDays: 14,
    features: [
      "Profile boost label",
      "14-day visibility boost",
      "Priority browse placement",
    ],
    name: "Pro Boost",
    price: 199,
    slug: "pro-boost",
    visibilityRank: 2,
  },
  {
    amount: 34900,
    badgeLabel: "Premium Boost",
    boostPlanId: "4d334f1e-2dc7-4a46-8d64-8b1ec4110003",
    description: "Run a full monthly boost with the highest visibility tier.",
    durationDays: 30,
    features: [
      "Profile boost label",
      "30-day visibility boost",
      "Full-length monthly promotion",
    ],
    name: "Premium Boost",
    price: 349,
    slug: "premium-boost",
    visibilityRank: 3,
  },
];

export function getBoostPlan(slug: string) {
  return boostPlans.find((plan) => plan.slug === slug) ?? null;
}

export function getBoostPlanByBoostPlanId(boostPlanId: string | null) {
  return (
    boostPlans.find((plan) => plan.boostPlanId === boostPlanId) ?? null
  );
}

export function formatBoostPlanPrice(plan: BoostPlan) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(plan.price);
}

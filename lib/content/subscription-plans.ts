export type SubscriptionPlan = {
  amount: number;
  description: string;
  durationDays: number;
  features: string[];
  name: string;
  price: number;
  slug: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    amount: 9900,
    description: "Feature one service listing for a focused one-week test run.",
    durationDays: 7,
    features: [
      "One featured service listing",
      "7-day visibility boost",
      "Low-cost PayMongo checkout test",
    ],
    name: "Starter Boost",
    price: 99,
    slug: "starter-boost",
  },
  {
    amount: 19900,
    description: "Keep a service visible longer while testing a mid-tier payment.",
    durationDays: 14,
    features: [
      "One featured service listing",
      "14-day visibility boost",
      "Recommended demo checkout amount",
    ],
    name: "Pro Boost",
    price: 199,
    slug: "pro-boost",
  },
  {
    amount: 34900,
    description: "Run the full monthly boost flow with the highest demo plan.",
    durationDays: 30,
    features: [
      "One featured service listing",
      "30-day visibility boost",
      "Full-length subscription demo",
    ],
    name: "Premium Boost",
    price: 349,
    slug: "premium-boost",
  },
];

export function getSubscriptionPlan(slug: string) {
  return subscriptionPlans.find((plan) => plan.slug === slug) ?? null;
}

export function formatPlanPrice(plan: SubscriptionPlan) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(plan.price);
}

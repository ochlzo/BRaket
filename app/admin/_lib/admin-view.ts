export type AdminView =
  | "dashboard"
  | "talent-approval"
  | "clients"
  | "talents"
  | "service-reports"
  | "user-reports"
  | "review-reports"
  | "talent-reports"
  | "client-reports";

export const adminViewCopy: Record<
  AdminView,
  { body: string; eyebrow: string; title: string }
> = {
  "client-reports": {
    body: "Review reports against client profiles and client account behavior.",
    eyebrow: "Client reports",
    title: "Client Report Queue",
  },
  dashboard: {
    body: "A quick read on users, bookings, services, approvals, and reports that need attention.",
    eyebrow: "Admin dashboard",
    title: "Operations Overview",
  },
  clients: {
    body: "Create, review, edit, and remove signed-in client accounts.",
    eyebrow: "Client accounts",
    title: "Client Management",
  },
  "review-reports": {
    body: "Review reports submitted against ratings and written feedback.",
    eyebrow: "Review reports",
    title: "Review Report Queue",
  },
  "service-reports": {
    body: "Review reports submitted against talent services and offers.",
    eyebrow: "Service reports",
    title: "Service Report Queue",
  },
  "talent-approval": {
    body: "Review BU student emails and uploaded IDs before talent accounts become verified.",
    eyebrow: "Talent verification",
    title: "Talent Approval Queue",
  },
  talents: {
    body: "Create, review, edit, verify, and remove signed-in talent accounts.",
    eyebrow: "Talent accounts",
    title: "Talent Management",
  },
  "talent-reports": {
    body: "Review reports against talent profiles and talent account behavior.",
    eyebrow: "Talent reports",
    title: "Talent Report Queue",
  },
  "user-reports": {
    body: "Review reports submitted against user profiles.",
    eyebrow: "User reports",
    title: "User Report Queue",
  },
};

export function resolveAdminView(value?: string): AdminView {
  return value && value in adminViewCopy
    ? (value as AdminView)
    : "dashboard";
}

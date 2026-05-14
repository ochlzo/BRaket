type DashboardRole = "client" | "talent";

type DashboardAccessInput = {
  expectedRole: DashboardRole;
  isTalent: boolean;
  role: DashboardRole;
};

export function canAccessDashboardRole({
  expectedRole,
  isTalent,
}: DashboardAccessInput) {
  if (expectedRole === "talent") {
    return isTalent;
  }

  return true;
}

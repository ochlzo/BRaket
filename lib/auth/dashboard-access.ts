type DashboardRole = "client" | "talent";

type DashboardAccessInput = {
  expectedRole: DashboardRole;
  hasTalentProfile?: boolean;
  isTalent: boolean;
  role: DashboardRole;
};

export function canAccessDashboardRole({
  expectedRole,
  hasTalentProfile = false,
  isTalent,
}: DashboardAccessInput) {
  if (expectedRole === "talent") {
    return isTalent || hasTalentProfile;
  }

  return true;
}

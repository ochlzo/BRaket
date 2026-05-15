import type { ComponentProps } from "react";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";

type TalentDashboardLayoutProps = Omit<
  ComponentProps<typeof DashboardLayout>,
  "role"
>;

export function TalentDashboardLayout(props: TalentDashboardLayoutProps) {
  return <DashboardLayout {...props} role="talent" />;
}

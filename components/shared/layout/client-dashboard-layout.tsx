import type { ComponentProps } from "react";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";

type ClientDashboardLayoutProps = Omit<
  ComponentProps<typeof DashboardLayout>,
  "role"
>;

export function ClientDashboardLayout(props: ClientDashboardLayoutProps) {
  return <DashboardLayout {...props} role="client" />;
}

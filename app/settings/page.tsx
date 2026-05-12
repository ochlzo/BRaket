import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { SettingsHub } from "./_components/settings-hub";

export default async function SettingsPage() {
  const user = await requireCurrentAppUser();

  return (
    <DashboardLayout
      role={user.role}
      subtitle="Choose a section to manage account, profile, security, and support settings."
      title="Settings"
    >
      <SettingsHub />
    </DashboardLayout>
  );
}

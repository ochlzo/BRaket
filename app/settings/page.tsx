import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { parseSettingsSource } from "@/lib/dashboard/settings-source";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { SettingsHub } from "./_components/settings-hub";

type SettingsPageProps = {
  searchParams: Promise<{
    source?: string | string[];
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [user, params] = await Promise.all([
    requireCurrentAppUser(),
    searchParams,
  ]);
  const sourceRole = parseSettingsSource(params.source, user.role);

  return (
    <DashboardLayout
      role={sourceRole}
      subtitle="Choose a section to manage account, profile, security, and support settings."
      title="Settings"
    >
      <SettingsHub source={sourceRole} />
    </DashboardLayout>
  );
}

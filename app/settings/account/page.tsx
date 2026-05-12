import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";
import { getAccountSettingsPageData } from "@/server/account-settings/get-account-settings-page-data";

import { AccountSettingsForm } from "./_components/account-settings-form";

export default async function AccountSettingsPage() {
  const user = await requireCurrentAppUser();
  const initialValues = await getAccountSettingsPageData(user.id);

  if (!initialValues) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      role={user.role}
      subtitle="Edit the account details linked to your login."
      title="Account"
    >
      <AccountSettingsForm initialValues={initialValues} />
    </DashboardLayout>
  );
}

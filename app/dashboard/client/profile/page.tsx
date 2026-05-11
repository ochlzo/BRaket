import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { ClientProfilePageContent } from "./_components/client-profile-page-content";
import { getClientProfilePageData } from "@/server/client-profile/get-client-profile";

export default async function ClientProfilePage() {
  const currentUser = await requireCurrentAppUser("client");
  const profile = await getClientProfilePageData(currentUser);

  return (
    <DashboardLayout
      role="client"
      subtitle="View and manage the live client profile tied to your BRaket account."
      title="Client Profile"
    >
      <ClientProfilePageContent profile={profile} />
    </DashboardLayout>
  );
}

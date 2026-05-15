import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { CreateServiceForm } from "./_components/create-service-form";

export default async function CreateServicePage() {
  await requireCurrentAppUser("talent");

  return (
    <TalentDashboardLayout
      subtitle="Add a new service listing to attract clients"
      title="Create New Service"
    >
      <CreateServiceForm />
    </TalentDashboardLayout>
  );
}

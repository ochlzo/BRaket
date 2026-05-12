import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { CreateServiceForm } from "./_components/create-service-form";

export default async function CreateServicePage() {
  await requireCurrentAppUser("talent");

  return (
    <DashboardLayout
      role="talent"
      subtitle="Add a new service listing to attract clients"
      title="Create New Service"
    >
      <CreateServiceForm />
    </DashboardLayout>
  );
}

import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import { getCategoryOptions } from "@/app/onboarding/talent/_lib/get-category-options";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { CreateServiceForm } from "./_components/create-service-form";

export default async function CreateServicePage() {
  await requireCurrentAppUser("talent");
  const availableCategories = await getCategoryOptions();

  return (
    <TalentDashboardLayout
      subtitle="Add a new service listing to attract clients"
      title="Create New Service"
    >
      <CreateServiceForm availableCategories={availableCategories} />
    </TalentDashboardLayout>
  );
}

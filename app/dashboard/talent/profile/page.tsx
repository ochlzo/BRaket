import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import { TalentProfilePageContent } from "@/app/dashboard/talent/profile/_components/talent-profile-page-content";
import { getTalentProfilePageData } from "@/server/talent-profile/get-talent-profile";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function TalentProfilePage() {
  const user = await requireCurrentAppUser("talent");
  const profile = await getTalentProfilePageData(user);

  return (
    <TalentDashboardLayout
      subtitle="View the real profile information tied to your signed-in talent account."
      title="Talent Profile"
    >
      <TalentProfilePageContent profile={profile} user={user} />
    </TalentDashboardLayout>
  );
}

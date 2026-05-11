import { ProfilePageContent } from "@/app/dashboard/profile/_components/profile-page-content";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function TalentProfilePage() {
  const user = await requireCurrentAppUser("talent");

  return (
    <ProfilePageContent
      subtitle="View the real profile information tied to your signed-in talent account."
      title="Talent Profile"
      user={user}
    />
  );
}

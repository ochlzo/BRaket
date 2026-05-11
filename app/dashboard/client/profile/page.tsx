import { ProfilePageContent } from "@/app/dashboard/profile/_components/profile-page-content";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function ClientProfilePage() {
  const user = await requireCurrentAppUser("client");

  return (
    <ProfilePageContent
      subtitle="View the real profile information tied to your signed-in client account."
      title="Client Profile"
      user={user}
    />
  );
}

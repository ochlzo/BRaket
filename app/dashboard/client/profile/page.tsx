import { ClientDashboardLayout } from "@/components/shared/layout/client-dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

import { ClientProfilePageContent } from "./_components/client-profile-page-content";
import { getBookingsForUser } from "@/server/bookings/data";
import { getClientProfilePageData } from "@/server/client-profile/get-client-profile";

export default async function ClientProfilePage() {
  const currentUser = await requireCurrentAppUser("client");
  const [bookings, profile] = await Promise.all([
    getBookingsForUser(currentUser, "client"),
    getClientProfilePageData(currentUser),
  ]);

  return (
    <ClientDashboardLayout
      subtitle="View and manage the live client profile tied to your BRaket account."
      title="Client Profile"
    >
      <ClientProfilePageContent
        bookings={bookings}
        profile={profile}
        user={currentUser}
      />
    </ClientDashboardLayout>
  );
}

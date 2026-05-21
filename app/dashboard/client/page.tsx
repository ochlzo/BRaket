import { ClientDashboardLayout } from "@/components/shared/layout/client-dashboard-layout";
import { ClientAnalyticsDashboard } from "@/app/dashboard/client/_components/client-analytics-dashboard";
import { getBookingsForUser } from "@/server/bookings/data";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function ClientDashboardPage() {
  const user = await requireCurrentAppUser("client");
  const bookings = await getBookingsForUser(user, "client");
  const titleName = user.firstName || user.displayName || user.username;

  return (
    <ClientDashboardLayout
      subtitle="Your client dashboard will show bookings, requests, and updates as they come in."
      title={`Welcome, ${titleName}`}
    >
      <ClientAnalyticsDashboard bookings={bookings} />
    </ClientDashboardLayout>
  );
}

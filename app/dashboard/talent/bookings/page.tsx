import { BookingStatsGrid } from "@/app/dashboard/client/bookings/_components/booking-stats-grid";
import { BookingList } from "@/components/shared/bookings/booking-list";
import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import {
  countBookingsByStatus,
  getBookingsForUser,
} from "@/server/bookings/data";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function TalentBookingsPage() {
  const currentUser = await requireCurrentAppUser("talent");
  const bookings = await getBookingsForUser(currentUser, "talent");
  const counts = countBookingsByStatus(bookings);

  return (
    <TalentDashboardLayout
      subtitle="Manage your live commission requests here as they arrive."
      title="My Bookings"
    >
      <div className="flex flex-col gap-4">
        <BookingStatsGrid
          activeBookings={counts.active}
          bookingsCount={counts.total}
          completedBookings={counts.completed}
        />
        <BookingList
          bookings={bookings}
          emptyActionHref="/dashboard/talent/services/new"
          emptyActionLabel="Create a Service"
          emptyDescription="Real commission requests will appear here after clients begin booking your services."
          viewer="talent"
        />
      </div>
    </TalentDashboardLayout>
  );
}

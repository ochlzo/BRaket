import { BookingStatsGrid } from "@/app/dashboard/client/bookings/_components/booking-stats-grid";
import { BookingList } from "@/components/shared/bookings/booking-list";
import { ClientDashboardLayout } from "@/components/shared/layout/client-dashboard-layout";
import {
  countBookingsByStatus,
  getBookingsForUser,
} from "@/server/bookings/data";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function ClientBookingsPage() {
  const currentUser = await requireCurrentAppUser("client");
  const bookings = await getBookingsForUser(currentUser);
  const counts = countBookingsByStatus(bookings);

  return (
    <ClientDashboardLayout
      subtitle="Track your real project requests and bookings here."
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
          emptyActionHref="/browse"
          emptyActionLabel="Browse Talent"
          emptyDescription="Once you submit a real project request, it will appear here."
          viewer="client"
        />
      </div>
    </ClientDashboardLayout>
  );
}

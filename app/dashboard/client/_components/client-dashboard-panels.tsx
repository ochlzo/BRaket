import type { BookingStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import type { BookingListItem } from "@/lib/bookings/types";

const statusLabels: Record<BookingStatus, string> = {
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
  WORK_SUBMITTED: "Work submitted",
};

const statusBadgeStyles: Record<BookingStatus, string> = {
  ACCEPTED:
    "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  CANCELLED:
    "bg-[color:var(--surface-alt)] text-[color:var(--ink-muted)]",
  COMPLETED:
    "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  DECLINED: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  IN_PROGRESS:
    "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  PENDING:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-orange-deep)]",
  WORK_SUBMITTED:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
};

const trackedStatuses: BookingStatus[] = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_SUBMITTED",
  "COMPLETED",
  "CANCELLED",
  "DECLINED",
];

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function EmptyActivity() {
  return (
    <div className="rounded-lg border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface)] px-6 py-10 text-center">
      <p className="text-base font-semibold text-foreground">
        No project activity yet
      </p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
        Your dashboard will fill with real requests, bookings, and project
        updates as you start working with talent.
      </p>
    </div>
  );
}

export function RecentBookings({ bookings }: { bookings: BookingListItem[] }) {
  if (bookings.length === 0) {
    return <EmptyActivity />;
  }

  return (
    <div className="divide-y divide-[color:var(--line)]">
      {bookings.slice(0, 5).map((booking) => (
        <div
          className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          key={booking.id}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusBadgeStyles[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
              <span className="text-xs font-medium text-[color:var(--ink-muted)]">
                {dateFormatter.format(new Date(booking.createdAt))}
              </span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-foreground">
              {booking.service.title}
            </p>
            <p className="mt-1 truncate text-xs text-[color:var(--ink-muted)]">
              Talent: {booking.talent.displayName}
            </p>
          </div>
          <div className="text-sm font-bold text-[color:var(--brand-orange)] sm:text-right">
            {booking.budget === null
              ? "Budget TBD"
              : formatCurrency(booking.budget)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatusOverview({ bookings }: { bookings: BookingListItem[] }) {
  const total = Math.max(bookings.length, 1);

  return (
    <div className="space-y-4">
      {trackedStatuses.map((status) => {
        const count = bookings.filter((booking) => booking.status === status)
          .length;
        const width = `${Math.round((count / total) * 100)}%`;

        return (
          <div className="space-y-2" key={status}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">
                {statusLabels[status]}
              </span>
              <span className="text-sm font-bold text-[color:var(--ink-muted)]">
                {count}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-alt)]">
              <div
                className="h-full rounded-full bg-[color:var(--brand-orange)]"
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

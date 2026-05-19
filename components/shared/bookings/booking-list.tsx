import type { BookingStatus } from "@prisma/client";
import Link from "next/link";

import { ReportButton } from "@/components/shared/moderation/report-button";
import { formatBookingBudgetLabel } from "@/lib/bookings/budget-label";
import type { BookingListItem } from "@/lib/bookings/types";
import { updateBookingStatusFormAction } from "@/server/bookings/actions";
import { BookingReviews } from "./booking-reviews";

type BookingListProps = {
  bookings: BookingListItem[];
  emptyActionHref: string;
  emptyActionLabel: string;
  emptyDescription: string;
  viewer: "client" | "talent";
};

const statusStyles: Record<BookingStatus, string> = {
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

const statusLabels: Record<BookingStatus, string> = {
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
  WORK_SUBMITTED: "Work submitted",
};

function StatusButton({
  bookingId,
  label,
  status,
}: {
  bookingId: string;
  label: string;
  status: BookingStatus;
}) {
  return (
    <form action={updateBookingStatusFormAction}>
      <input name="bookingId" type="hidden" value={bookingId} />
      <input name="status" type="hidden" value={status} />
      <button
        className="rounded-xl border border-[color:var(--line-strong)] bg-white px-3 py-2 text-xs font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}

function BookingActions({
  booking,
  viewer,
}: {
  booking: BookingListItem;
  viewer: "client" | "talent";
}) {
  // --- Client actions ---
  if (viewer === "client") {
    if (booking.status === "PENDING") {
      return (
        <StatusButton bookingId={booking.id} label="Cancel" status="CANCELLED" />
      );
    }
    if (booking.status === "ACCEPTED") {
      return (
        <StatusButton
          bookingId={booking.id}
          label="Initiate work"
          status="IN_PROGRESS"
        />
      );
    }
    if (booking.status === "WORK_SUBMITTED") {
      return (
        <StatusButton
          bookingId={booking.id}
          label="Approve & complete"
          status="COMPLETED"
        />
      );
    }
    return null;
  }

  // --- Talent actions ---
  if (booking.status === "PENDING") {
    return (
      <>
        <StatusButton bookingId={booking.id} label="Accept" status="ACCEPTED" />
        <StatusButton bookingId={booking.id} label="Decline" status="DECLINED" />
      </>
    );
  }

  if (booking.status === "IN_PROGRESS") {
    return (
      <StatusButton
        bookingId={booking.id}
        label="Submit work"
        status="WORK_SUBMITTED"
      />
    );
  }

  return null;
}

export function BookingList({
  bookings,
  emptyActionHref,
  emptyActionLabel,
  emptyDescription,
  viewer,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">No bookings found</p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          {emptyDescription}
        </p>
        <Link
          className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
          href={emptyActionHref}
        >
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <article
          className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)] sm:p-6"
          key={booking.id}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}
                  >
                    {statusLabels[booking.status]}
                  </span>
                  <span className="text-xs font-medium text-[color:var(--ink-muted)]">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <ReportButton
                    label="Report"
                    targetId={booking.id}
                    targetLabel={`${booking.service.title} booking`}
                    targetPath={`/dashboard/${viewer}/bookings`}
                    targetType="BOOKING"
                  />
                  <BookingActions booking={booking} viewer={viewer} />
                </div>

                <div className="shrink-0 sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                    Budget
                  </p>
                  <p className="text-base font-extrabold text-[color:var(--brand-orange)]">
                    {formatBookingBudgetLabel(booking.budget)}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-normal text-foreground">
                {booking.service.title}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                {viewer === "client"
                  ? `Talent: ${booking.talent.displayName}`
                  : `Client: ${booking.client.displayName}`}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
                {booking.projectDetails}
              </p>
              {booking.notes ? (
                <p className="mt-3 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-body)]">
                  {booking.notes}
                </p>
              ) : null}
              {booking.declineReason ? (
                <p className="mt-3 rounded-xl bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm text-[color:var(--tone-red-deep)]">
                  Decline reason: {booking.declineReason}
                </p>
              ) : null}
            </div>
            <BookingReviews booking={booking} viewer={viewer} />
          </div>
        </article>
      ))}
    </div>
  );
}

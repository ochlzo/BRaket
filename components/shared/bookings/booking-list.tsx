import type { BookingStatus } from "@prisma/client";
import Link from "next/link";

import type { BookingListItem } from "@/lib/bookings/types";
import { updateBookingStatusFormAction } from "@/server/bookings/actions";

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
};

const statusLabels: Record<BookingStatus, string> = {
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

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
  if (viewer === "client" && booking.status === "PENDING") {
    return (
      <StatusButton bookingId={booking.id} label="Cancel" status="CANCELLED" />
    );
  }

  if (viewer !== "talent") {
    return null;
  }

  if (booking.status === "PENDING") {
    return (
      <>
        <StatusButton bookingId={booking.id} label="Accept" status="ACCEPTED" />
        <StatusButton bookingId={booking.id} label="Decline" status="DECLINED" />
      </>
    );
  }

  if (booking.status === "ACCEPTED") {
    return (
      <StatusButton
        bookingId={booking.id}
        label="Start work"
        status="IN_PROGRESS"
      />
    );
  }

  if (booking.status === "IN_PROGRESS") {
    return (
      <StatusButton
        bookingId={booking.id}
        label="Mark complete"
        status="COMPLETED"
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
          className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]"
          key={booking.id}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}
                >
                  {statusLabels[booking.status]}
                </span>
                <span className="text-xs font-medium text-[color:var(--ink-muted)]">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-extrabold tracking-normal text-foreground">
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

            <div className="shrink-0 space-y-3 lg:w-48 lg:text-right">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Budget
                </p>
                <p className="text-base font-extrabold text-[color:var(--brand-orange)]">
                  {booking.budget
                    ? pesoFormatter.format(booking.budget)
                    : booking.service.priceLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <BookingActions booking={booking} viewer={viewer} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

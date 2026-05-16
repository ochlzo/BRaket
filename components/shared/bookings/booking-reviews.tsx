import type { BookingListItem } from "@/lib/bookings/types";

import { BookingReviewForm } from "./booking-review-form";

function ReviewSummary({
  label,
  review,
}: {
  label: string;
  review: NonNullable<BookingListItem["reviewFromClient"]>;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {label}
        </p>
        <p className="text-sm font-extrabold text-[color:var(--brand-orange)]">
          {"★".repeat(review.rating)}
          <span className="text-[color:var(--line-strong)]">
            {"★".repeat(5 - review.rating)}
          </span>
        </p>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[color:var(--ink-body)]">
        {review.comment}
      </p>
    </div>
  );
}

export function BookingReviews({
  booking,
  viewer,
}: {
  booking: BookingListItem;
  viewer: "client" | "talent";
}) {
  const viewerReview =
    viewer === "client" ? booking.reviewFromClient : booking.reviewFromTalent;
  const targetLabel =
    viewer === "client"
      ? booking.talent.displayName
      : booking.client.displayName;

  return (
    <div className="mt-4 space-y-3">
      {booking.reviewFromClient ? (
        <ReviewSummary
          label={`Client review for ${booking.talent.displayName}`}
          review={booking.reviewFromClient}
        />
      ) : null}
      {booking.reviewFromTalent ? (
        <ReviewSummary
          label={`Talent review for ${booking.client.displayName}`}
          review={booking.reviewFromTalent}
        />
      ) : null}
      {booking.status === "COMPLETED" && !viewerReview ? (
        <BookingReviewForm bookingId={booking.id} targetLabel={targetLabel} />
      ) : null}
    </div>
  );
}

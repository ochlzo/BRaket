"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createBookingReviewAction,
  type ReviewActionState,
} from "@/server/reviews/actions";

type BookingReviewFormProps = {
  bookingId: string;
  targetLabel: string;
};

const INITIAL_STATE: ReviewActionState = {
  message: "",
  ok: false,
};

export function BookingReviewForm({
  bookingId,
  targetLabel,
}: BookingReviewFormProps) {
  const [rating, setRating] = useState("5");
  const [state, formAction, isPending] = useActionState(
    createBookingReviewAction,
    INITIAL_STATE,
  );

  if (state.ok) {
    return (
      <div className="rounded-xl bg-[color:var(--tone-green-soft)] px-4 py-3 text-sm font-semibold text-[color:var(--tone-green-deep)]">
        {state.message}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-4 rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4"
    >
      <input name="bookingId" type="hidden" value={bookingId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">
            Leave a review for {targetLabel}
          </p>
          <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
            This appears on the completed booking record.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)]">
          Rating
          <select
            className="rounded-xl border border-[color:var(--line-strong)] bg-white px-3 py-2 text-sm font-bold text-foreground outline-none"
            name="rating"
            onChange={(event) => setRating(event.target.value)}
            value={rating}
          >
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
      </div>

      <Textarea
        className="mt-3 min-h-24 rounded-xl border-[color:var(--line-strong)] bg-white text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
        minLength={10}
        name="comment"
        placeholder={`Share your experience with ${targetLabel}.`}
        required
      />

      {state.message ? (
        <p
          className="mt-3 rounded-xl bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm font-medium text-[color:var(--tone-red-deep)]"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-3 flex justify-end">
        <Button
          className="rounded-xl bg-[color:var(--brand-orange)] px-4 py-2 text-sm font-semibold !text-white hover:bg-[color:var(--brand-orange-strong)]"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}

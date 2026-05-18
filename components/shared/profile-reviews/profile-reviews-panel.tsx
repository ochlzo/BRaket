"use client";

import { useState } from "react";

import { ReportButton } from "@/components/shared/moderation/report-button";

type ProfileReview = {
  bookingServiceTitle: string;
  comment: string;
  createdAt: string;
  id: string;
  rating: number;
  reviewerName: string;
};

type ProfileReviewsPanelProps = {
  averageRating: number | null;
  emptyLabel: string;
  id: string;
  initialVisibleCount?: number;
  reputationLabel: string;
  revealCount?: number;
  reviews: ProfileReview[];
  title: string;
};

function Stars({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span aria-label={`${safeRating} out of 5 stars`} className="text-sm">
      <span className="text-[color:var(--brand-orange)]">
        {"★".repeat(safeRating)}
      </span>
      <span className="text-[color:var(--line-strong)]">
        {"★".repeat(5 - safeRating)}
      </span>
    </span>
  );
}

export function ProfileReviewsPanel({
  averageRating,
  emptyLabel,
  id,
  initialVisibleCount,
  reputationLabel,
  revealCount = 10,
  reviews,
  title,
}: ProfileReviewsPanelProps) {
  const [visibleCount, setVisibleCount] = useState(
    initialVisibleCount ?? reviews.length,
  );
  const isLimited = typeof initialVisibleCount === "number";
  const visibleReviews = isLimited ? reviews.slice(0, visibleCount) : reviews;
  const hiddenCount = Math.max(reviews.length - visibleReviews.length, 0);

  return (
    <section
      className="rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]"
      id={id}
    >
      <div className="border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="typo-card-title-xl">{title}</h2>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              {reputationLabel}
            </p>
          </div>
          <a
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 py-1.5 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-hover)]"
            href={`#${id}`}
          >
            <Stars rating={Math.round(averageRating ?? 0)} />
            {(averageRating ?? 0).toFixed(1)}
          </a>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        {reviews.length > 0 ? (
          <>
            <div
              className={
                isLimited
                  ? "max-h-[28rem] space-y-3 overflow-y-auto pr-1"
                  : "space-y-3"
              }
            >
              {visibleReviews.map((review) => (
                <article
                  className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3"
                  key={`${review.createdAt}-${review.reviewerName}-${review.bookingServiceTitle}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[color:var(--foreground)]">
                        {review.reviewerName}
                      </p>
                      <p className="mt-0.5 text-xs text-[color:var(--ink-muted)]">
                        {review.bookingServiceTitle} -{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars rating={review.rating} />
                      <ReportButton
                        label="Report review"
                        targetId={review.id}
                        targetLabel={`Review by ${review.reviewerName} for ${review.bookingServiceTitle}`}
                        targetPath={`#${id}`}
                        targetType="REVIEW"
                      />
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--ink-body)]">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>

            {hiddenCount > 0 ? (
              <button
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-hover)]"
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(count + revealCount, reviews.length),
                  )
                }
                type="button"
              >
                See more ({hiddenCount} remaining)
              </button>
            ) : null}
          </>
        ) : (
          <div className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-5 py-8 text-center">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              {emptyLabel}
            </p>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Completed booking reviews will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

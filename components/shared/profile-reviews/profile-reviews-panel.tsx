type ProfileReview = {
  bookingServiceTitle: string;
  comment: string;
  createdAt: string;
  rating: number;
  reviewerName: string;
};

type ProfileReviewsPanelProps = {
  averageRating: number | null;
  emptyLabel: string;
  id: string;
  reputationLabel: string;
  reviews: ProfileReview[];
  title: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-sm">
      <span className="text-[color:var(--brand-orange)]">
        {"★".repeat(rating)}
      </span>
      <span className="text-[color:var(--line-strong)]">
        {"★".repeat(5 - rating)}
      </span>
    </span>
  );
}

export function ProfileReviewsPanel({
  averageRating,
  emptyLabel,
  id,
  reputationLabel,
  reviews,
  title,
}: ProfileReviewsPanelProps) {
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

      <div className="space-y-3 px-4 py-4 sm:px-5">
        {reviews.length > 0 ? (
          reviews.map((review) => (
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
                    {review.bookingServiceTitle} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--ink-body)]">
                {review.comment}
              </p>
            </article>
          ))
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

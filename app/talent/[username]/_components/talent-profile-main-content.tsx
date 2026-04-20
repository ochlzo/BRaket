import Image from "next/image";

import { getCategoryLabel } from "@/lib/mock-data";
import type { Review, ServiceListing, TalentProfile } from "@/lib/types";

type TalentProfileMainContentProps = {
  reviews: Review[];
  services: ServiceListing[];
  talent: TalentProfile;
};

const skillLevelStyles = {
  beginner: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  expert: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  intermediate:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
} as const;

export function TalentProfileMainContent({
  reviews,
  services,
  talent,
}: TalentProfileMainContentProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="typo-card-title-2xl mb-4 text-foreground">About</h2>
        <p className="text-base leading-7 text-[color:var(--ink-body)]">
          {talent.bio}
        </p>
      </div>

      <div>
        <h2 className="typo-card-title-2xl mb-4 text-foreground">Skills</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {talent.skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between rounded-2xl border border-[color:var(--line-strong)] bg-white px-5 py-3.5"
            >
              <span className="text-sm font-semibold text-foreground">
                {skill.name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${skillLevelStyles[skill.level]}`}
              >
                {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="typo-card-title-2xl mb-4 text-foreground">Services</h2>
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-8 py-12 text-center">
            <p className="text-sm text-[color:var(--ink-muted)]">
              No published services yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col gap-6 rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:shadow-lg sm:flex-row"
              >
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--tone-indigo-deep)]">
                    {getCategoryLabel(service.category)}
                  </span>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-col justify-between gap-4 border-[color:var(--line)] pt-4 sm:mt-0 sm:items-end sm:border-0 sm:pt-0">
                  <span className="shrink-0 text-xl font-extrabold text-[color:var(--brand-orange)]">
                    ₱{service.price.toLocaleString()}
                  </span>
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-blue)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                    href={`/book/${service.id}`}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="typo-card-title-2xl text-foreground">
            Client Reviews
          </h2>
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <span className="text-[color:var(--brand-orange)]">★</span>
            {talent.rating.toFixed(1)}
            <span className="font-medium text-[color:var(--ink-muted)]">
              ({talent.reviewCount} total)
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-8 py-12 text-center">
            <p className="text-sm text-[color:var(--ink-muted)]">
              No reviews yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[color:var(--surface-alt)]">
                      <Image
                        alt={review.client.firstName}
                        className="h-full w-full object-cover"
                        height={40}
                        src={review.client.avatarUrl}
                        width={40}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {review.client.firstName} {review.client.lastName}
                      </p>
                      <p className="text-xs text-[color:var(--ink-muted)]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-[color:var(--brand-orange)]"
                            : "text-[color:var(--line-strong)]"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment ? (
                  <p className="text-sm leading-relaxed text-[color:var(--ink-body)]">
                    {review.comment}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

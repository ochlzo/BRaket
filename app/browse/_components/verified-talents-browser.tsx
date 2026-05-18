"use client";

import Link from "next/link";
import { Search, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useState } from "react";

import { UserAvatar } from "@/components/shared/user-avatar";
import type { TalentAvailabilityStatus } from "@/lib/talent-profile/availability";
import { getBoostProfileStyle } from "@/lib/talent-profile/boost-profile-style";
import type { VerifiedTalentCard } from "@/server/talent-profile/browse-talents";

type VerifiedTalentsBrowserProps = {
  talents: VerifiedTalentCard[];
};

function availabilityBadgeStyles(status: TalentAvailabilityStatus) {
  if (status === "BUSY") {
    return {
      dot: "bg-[color:var(--tone-orange-base)]",
      pill: "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
    };
  }

  if (status === "UNAVAILABLE") {
    return {
      dot: "bg-[color:var(--tone-red-base)]",
      pill: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-base)]",
    };
  }

  return {
    dot: "bg-[color:var(--tone-green-base)]",
    pill: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  };
}

export function VerifiedTalentsBrowser({
  talents,
}: VerifiedTalentsBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const search = searchTerm.trim().toLowerCase();
  const filteredTalents = talents.filter((talent) => {
    if (!search) {
      return true;
    }

    return [
      talent.displayName,
      talent.headline,
      talent.bio,
      talent.college,
      talent.course,
      talent.skills.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  return (
    <>
      <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="typo-page-title mb-4 text-foreground">
              Find Verified{" "}
              <span className="text-[color:var(--brand-orange)]">Talents</span>
            </h1>
            <p className="typo-body-xl mx-auto max-w-2xl text-[color:var(--ink-soft)]">
              Browse verified BU student talent profiles and open their pages
              to review portfolios, services, and client feedback.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--ink-muted)]" />
              <input
                className="w-full rounded-full border-2 border-[color:var(--line-strong)] bg-white py-3.5 pl-12 pr-4 text-base text-foreground outline-none transition placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-blue)]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by talent, skill, course, or college..."
                type="text"
                value={searchTerm}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="typo-meta mb-6 text-[color:var(--ink-soft)]">
            Showing{" "}
            <span className="typo-label-sm text-foreground">
              {filteredTalents.length}
            </span>{" "}
            verified talents
          </p>

          {filteredTalents.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredTalents.map((talent) => {
                const availabilityStyles = availabilityBadgeStyles(
                  talent.availabilityStatus,
                );
                const boostStyle = getBoostProfileStyle(
                  talent.activeBoost?.slug,
                );

                return (
                  <Link
                    className="block rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-panel-soft)] sm:p-6"
                    href={talent.profileHref}
                    key={talent.userId}
                  >
                    <div className="flex items-start gap-4">
                      <UserAvatar
                        alt={talent.displayName}
                        className={`h-16 w-16 rounded-2xl ${boostStyle.avatar}`}
                        fallbackClassName="rounded-2xl bg-[color:var(--tone-orange-soft)] text-lg font-black text-[color:var(--tone-orange-deep)]"
                        imageClassName="rounded-2xl object-cover"
                        initials={talent.initials}
                        src={talent.avatarUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-extrabold tracking-normal text-foreground">
                            {talent.displayName}
                          </h2>
                          <ShieldCheck className="size-4 shrink-0 text-[color:var(--tone-green-deep)]" />
                          {talent.activeBoost ? (
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${boostStyle.badge}`}
                            >
                              <Sparkles
                                aria-hidden="true"
                                className="size-3.5"
                              />
                              {talent.activeBoost.badgeLabel}
                            </span>
                          ) : null}
                          <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${availabilityStyles.pill}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${availabilityStyles.dot}`}
                            />
                            {talent.availabilityLabel}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                          {talent.headline || "Verified BU student talent"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[color:var(--ink-body)]">
                      {talent.bio || "This talent has not added a bio yet."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {talent.skills.length > 0 ? (
                        talent.skills.map((skill) => (
                          <span
                            className="rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-xs font-bold text-[color:var(--tone-indigo-deep)]"
                            key={skill}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-bold text-[color:var(--ink-muted)]">
                          Skills pending
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color:var(--line-strong)] pt-4 text-xs text-[color:var(--ink-muted)] sm:flex-nowrap sm:text-sm">
                      <span className="min-w-0 max-w-full rounded-full bg-[color:var(--surface-alt)] px-2.5 py-1.5 font-semibold sm:px-3">
                        <span className="block truncate">{talent.course}</span>
                      </span>
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-[color:var(--surface-alt)] px-2.5 py-1.5 font-semibold sm:px-3">
                        {talent.servicesCount} services
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--surface-alt)] px-2.5 py-1.5 font-semibold sm:gap-1.5 sm:px-3">
                        <Star className="size-3.5 text-[color:var(--brand-orange)] sm:size-4" />
                        <span>
                          {talent.rating === null
                            ? "0.0"
                            : talent.rating.toFixed(1)}
                        </span>
                        <span>
                          ({talent.reviewCount}{" "}
                          {talent.reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                No verified talents found
              </p>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                Try another search term or check back after more approvals.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

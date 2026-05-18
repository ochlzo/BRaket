import { GraduationCap, Sparkles } from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { ReportButton } from "@/components/shared/moderation/report-button";
import {
  BriefcaseIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/shared/icons/marketing-icons";
import type { TalentProfilePageData } from "@/lib/talent-profile/types";

type PublicTalentProfileHeroProps = {
  profile: TalentProfilePageData;
};

function coverBackgroundStyle(value: string) {
  if (/gradient\(/i.test(value)) {
    return { background: value };
  }

  return {
    backgroundImage: `url(${value})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function courseAcronym(value: string) {
  const words = value
    .replace(/\([^)]*\)/g, "")
    .split(/[\s-/]+/)
    .filter((word) => word && !/^(and|in|of|the|for)$/i.test(word));

  return words.map((word) => word[0]?.toUpperCase()).join("") || value;
}

function ordinalYear(value: number | null) {
  if (!value) return "Year pending";

  const mod100 = value % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : value % 10 === 1
        ? "st"
        : value % 10 === 2
          ? "nd"
          : value % 10 === 3
            ? "rd"
            : "th";

  return `${value}${suffix} year`;
}

export function PublicTalentProfileHero({
  profile,
}: PublicTalentProfileHeroProps) {
  const academicLabel = `${ordinalYear(profile.yearLevel)} ${courseAcronym(
    profile.course,
  )}`;

  return (
    <section className="overflow-hidden bg-[color:var(--surface)] sm:rounded-[1.4rem] sm:border sm:border-[color:var(--line-strong)] sm:shadow-[var(--shadow-panel-elevated)]">
      <div
        className="relative min-h-40 overflow-hidden sm:min-h-52"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.04),rgba(18,24,35,.28))]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative shrink-0 self-start">
            <UserAvatar
              alt={profile.displayName}
              className="h-24 w-24 rounded-3xl border-4 border-white bg-[color:var(--surface-alt)] shadow-lg after:rounded-3xl sm:h-40 sm:w-40"
              fallbackClassName="rounded-3xl text-2xl font-black text-[color:var(--ink-muted)] sm:text-4xl"
              imageClassName="rounded-3xl"
              initials={`${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`}
              src={profile.avatarUrl}
            />
            {profile.isVerified ? (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--tone-green-base)] px-3 py-1 text-xs font-bold text-white shadow-md">
                Verified
              </div>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 space-y-3 sm:pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 break-words text-sm font-medium text-[color:var(--ink-muted)] sm:text-lg">
                  {profile.headline || "Talent profile"}
                </p>
                {profile.activeBoost ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--tone-orange-soft)] px-3 py-1.5 text-xs font-bold text-[color:var(--tone-orange-deep)]">
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    {profile.activeBoost.badgeLabel}
                  </div>
                ) : null}
              </div>
              <ReportButton
                label="Report profile"
                targetId={profile.userId}
                targetLabel={`${profile.displayName} talent profile`}
                targetPath={`/talent/${profile.username}`}
                targetType="PROFILE"
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--ink-muted)]">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  profile.isAvailable
                    ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                    : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-base)]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    profile.isAvailable
                      ? "bg-[color:var(--tone-green-base)]"
                      : "bg-[color:var(--tone-red-base)]"
                  }`}
                />
                {profile.availabilityLabel}
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <MapPinIcon className="h-4 w-4" />
                <span>{profile.college || "College pending"}</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <GraduationCap className="h-4 w-4" />
                <span>{academicLabel}</span>
              </span>
              <a
                className="flex items-center gap-1.5 whitespace-nowrap underline-offset-4 hover:underline"
                href="#talent-reviews"
              >
                <span className="text-[color:var(--brand-orange)]">
                  <StarIcon className="h-4 w-4 fill-current" />
                </span>
                <span className="font-semibold text-foreground">
                  {(profile.talentAvgRating ?? 0).toFixed(1)}
                </span>
                ({profile.talentReviewCount} reviews)
              </a>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{profile.totalProjectsCompleted} projects completed</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

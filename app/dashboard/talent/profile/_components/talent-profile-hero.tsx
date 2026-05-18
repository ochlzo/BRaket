"use client";

import { useRouter } from "next/navigation";
import { GraduationCap, MoreHorizontal, Sparkles } from "lucide-react";

import { ProfileImageEditor } from "@/components/shared/profile-images/profile-image-editor";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  BriefcaseIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/shared/icons/marketing-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBoostProfileStyle } from "@/lib/talent-profile/boost-profile-style";
import type { TalentProfilePageData } from "@/lib/talent-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";

import { TalentAvailabilityControl } from "./talent-availability-control";

type TalentProfileHeroProps = {
  profile: TalentProfilePageData;
  user: CurrentAppUser;
};

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

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

function profileLocation(profile: TalentProfilePageData) {
  return compactText(profile.college) || "College pending";
}

function courseAcronym(value: string) {
  const course = compactText(value);

  if (!course) {
    return "Course pending";
  }

  const words = course
    .replace(/\([^)]*\)/g, "")
    .split(/[\s-/]+/)
    .filter((word) => !/^(and|in|of|the|for)$/i.test(word));

  return words.map((word) => word[0]?.toUpperCase()).join("") || course;
}

function ordinalYear(value: number | null) {
  if (!value) {
    return "Year pending";
  }

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

function ratingLabel(value: number | null) {
  return (value ?? 0).toFixed(1);
}

function reviewLabel(count: number) {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}

function projectsCompletedLabel(count: number) {
  return `${count} ${count === 1 ? "project" : "projects"} completed`;
}

export function TalentProfileHero({ profile, user }: TalentProfileHeroProps) {
  const router = useRouter();
  const headline = profile.headline || "Talent profile";
  const location = profileLocation(profile);
  const academicLabel = `${ordinalYear(profile.yearLevel)} ${courseAcronym(profile.course)}`;
  const boostStyle = getBoostProfileStyle(profile.activeBoost?.slug);

  function renderProfileMenu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              aria-label="Profile menu"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[color:var(--ink-muted)] transition-colors hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--foreground)]"
              type="button"
            />
          }
        >
          <MoreHorizontal className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuItem onClick={() => router.push("/settings/account")}>
            Edit personal details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/onboarding/talent?step=1")}
          >
            Edit talent profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <section
      className="overflow-hidden rounded-none border-0 bg-[color:var(--surface)] shadow-none sm:rounded-[1.4rem] sm:border sm:border-[color:var(--line-strong)] sm:shadow-[var(--shadow-panel-elevated)]"
    >
      <div
        className="relative min-h-40 overflow-hidden sm:min-h-52"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.04),rgba(18,24,35,.28))]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex items-start justify-between gap-3 sm:block">
            <div className="relative shrink-0 self-start">
              <div className="h-24 w-24 sm:h-40 sm:w-40">
                <ProfileImageEditor
                  initials={user.initials}
                  avatarUrl={profile.avatarUrl || user.avatarUrl}
                  backgroundImageUrl={profile.backgroundImageUrl}
                  displayName={profile.displayName}
                  trigger={
                    <UserAvatar
                      alt={user.displayName}
                      className={`h-24 w-24 rounded-3xl bg-[color:var(--surface-alt)] shadow-lg after:rounded-3xl sm:h-40 sm:w-40 ${boostStyle.avatar}`}
                      fallbackClassName="rounded-3xl text-2xl font-black text-[color:var(--ink-muted)] sm:text-4xl"
                      imageClassName="rounded-3xl"
                      initials={user.initials}
                      src={profile.avatarUrl || user.avatarUrl}
                    />
                  }
                  triggerClassName="block rounded-3xl transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-orange)]/40"
                />
              </div>
              {profile.isVerified ? (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--tone-green-base)] px-3 py-1 text-xs font-bold text-white shadow-md">
                  Verified
                </div>
              ) : null}
            </div>

            <div className="sm:hidden">{renderProfileMenu()}</div>
          </div>

          <div className="min-w-0 flex-1 space-y-3 sm:pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="break-words text-2xl font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 break-words text-sm font-medium text-[color:var(--ink-muted)] sm:text-lg">
                  {headline}
                </p>
                {profile.activeBoost ? (
                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${boostStyle.badge}`}
                  >
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    {profile.activeBoost.badgeLabel}
                  </div>
                ) : null}
              </div>

              <div className="hidden sm:block">{renderProfileMenu()}</div>
            </div>

            <TalentAvailabilityControl
              initialStatus={profile.availabilityStatus}
            />

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--ink-muted)]">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <MapPinIcon className="h-4 w-4" />
                <span>{location}</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <GraduationCap className="h-4 w-4" />
                <span>{academicLabel}</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[color:var(--brand-orange)]">
                  <StarIcon className="h-4 w-4 fill-current" />
                </span>
                <span className="font-semibold text-foreground">
                  {ratingLabel(profile.talentAvgRating)}
                </span>
                ({reviewLabel(profile.talentReviewCount)})
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <BriefcaseIcon className="h-4 w-4" />
                <span>
                  {projectsCompletedLabel(profile.totalProjectsCompleted)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

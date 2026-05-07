import type { TalentProfile } from "@/lib/types";

import { StarIcon } from "@/app/dashboard/profile/_components/profile-icons";

type ProfileTalentDetailsProps = {
  talentProfile: TalentProfile;
};

const skillLevelStyles = {
  beginner: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  expert: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  intermediate:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
} as const;

export function ProfileTalentDetails({
  talentProfile,
}: ProfileTalentDetailsProps) {
  const hasRates = talentProfile.minRate > 0 && talentProfile.maxRate > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-foreground">
          Skills & Expertise
        </h3>
        {talentProfile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {talentProfile.skills.map((skill) => (
              <span
                key={skill.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${skillLevelStyles[skill.level]}`}
              >
                {skill.name}
                <span className="opacity-60">-</span>
                <span className="capitalize opacity-80">{skill.level}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--ink-muted)]">
            No skills have been added to this talent profile yet.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-foreground">
          Rates & Rating
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
            <span className="text-sm font-medium text-[color:var(--ink-muted)]">
              Hourly Rate
            </span>
            <span className="text-sm font-bold text-foreground">
              {hasRates
                ? `PHP ${talentProfile.minRate} - PHP ${talentProfile.maxRate}`
                : "Not set yet"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
            <span className="text-sm font-medium text-[color:var(--ink-muted)]">
              Rating
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <StarIcon />
              <span className="text-[color:var(--tone-orange-base)]">
                {talentProfile.rating > 0 ? talentProfile.rating : "No rating"}
              </span>
              <span className="font-normal text-[color:var(--ink-soft)]">
                ({talentProfile.reviewCount} reviews)
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
            <span className="text-sm font-medium text-[color:var(--ink-muted)]">
              Availability
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                talentProfile.available
                  ? "text-[color:var(--tone-green-deep)]"
                  : "text-[color:var(--tone-red-base)]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  talentProfile.available
                    ? "bg-[color:var(--tone-green-base)]"
                    : "bg-[color:var(--tone-red-base)]"
                }`}
              />
              {talentProfile.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

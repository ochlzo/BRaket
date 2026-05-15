import type { TalentProfilePageData } from "@/lib/talent-profile/types";

type TalentQuickStatsProps = {
  profile: TalentProfilePageData;
};

function ratingLabel(value: number | null) {
  return `${(value ?? 0).toFixed(1)} / 5.0`;
}

export function TalentQuickStats({ profile }: TalentQuickStatsProps) {
  const stats = [
    {
      label: "Projects Completed",
      value: profile.totalProjectsCompleted.toString(),
    },
    {
      label: "Services Offered",
      value: profile.services.length.toString(),
    },
    {
      label: "Total Reviews",
      value: profile.talentReviewCount.toString(),
    },
    {
      label: "Rating",
      value: ratingLabel(profile.talentAvgRating),
    },
  ];

  return (
    <aside className="rounded-[1.2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-panel-soft)]">
      <h2 className="text-xl font-extrabold tracking-normal text-[color:var(--foreground)]">
        Quick Stats
      </h2>
      <dl className="mt-5 space-y-4">
        {stats.map((stat) => (
          <div className="flex items-center justify-between gap-4" key={stat.label}>
            <dt className="text-sm font-medium text-[color:var(--ink-muted)]">
              {stat.label}
            </dt>
            <dd className="text-sm font-extrabold text-[color:var(--foreground)]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

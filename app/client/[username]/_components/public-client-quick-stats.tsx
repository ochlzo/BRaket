import type { ReactNode } from "react";
import { Award, Briefcase, ImageIcon, Star } from "lucide-react";

import type { ClientProfilePageData } from "@/lib/client-profile/types";

type PublicClientQuickStatsProps = {
  profile: ClientProfilePageData;
};

function StatRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const valueNode = href ? (
    <a className="underline-offset-4 hover:underline" href={href}>
      {value}
    </a>
  ) : (
    value
  );

  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface-alt)] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--brand-orange)]">
          {icon}
        </div>
        <p className="text-sm font-semibold text-[color:var(--ink-muted)]">
          {label}
        </p>
      </div>
      <p className="shrink-0 text-lg font-extrabold text-[color:var(--foreground)]">
        {valueNode}
      </p>
    </div>
  );
}

export function PublicClientQuickStats({
  profile,
}: PublicClientQuickStatsProps) {
  const rating = profile.averageRating ?? 0;

  return (
    <section className="rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]">
      <div className="border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">Quick Stats</h2>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <StatRow
          href="#client-reviews"
          icon={<Star className="size-5" />}
          label="Average rating"
          value={profile.reviewCount > 0 ? rating.toFixed(1) : "0.0"}
        />
        <StatRow
          icon={<Award className="size-5" />}
          label="Reputation score"
          value={profile.reputationScore.toFixed(0)}
        />
        <StatRow
          icon={<Briefcase className="size-5" />}
          label="Completed projects"
          value={String(profile.completedCommissionsCount ?? 0)}
        />
        <StatRow
          icon={<ImageIcon className="size-5" />}
          label="Portfolio posts"
          value={String(profile.portfolio.length)}
        />
      </div>
    </section>
  );
}

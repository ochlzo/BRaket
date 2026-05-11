import type { ReactNode } from "react";
import { Award, MessageSquareText, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ClientProfilePageData } from "@/lib/client-profile/types";

type ClientProfileStatsProps = {
  profile: ClientProfilePageData;
};

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  note: string;
  value: string;
}) {
  return (
    <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-panel-soft)]">
      <CardContent className="flex items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">
            {value}
          </p>
          <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
            {label}
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--ink-soft)]">{note}</p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[color:var(--surface-alt)] text-[color:var(--brand-orange)]">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientProfileStats({ profile }: ClientProfileStatsProps) {
  const rating = profile.averageRating ?? 0;

  return (
    <section
      aria-label="Client summary statistics"
      className="grid gap-4 md:grid-cols-3"
    >
      <StatCard
        icon={<Sparkles className="size-5" />}
        label="Average rating"
        note={`${profile.reviewCount} review${profile.reviewCount === 1 ? "" : "s"} from talents`}
        value={profile.reviewCount > 0 ? rating.toFixed(1) : "No rating"}
      />
      <StatCard
        icon={<Award className="size-5" />}
        label="Reputation score"
        note="Measured from completed work and profile activity"
        value={profile.reputationScore?.toFixed(0) ?? "0"}
      />
      <StatCard
        icon={<MessageSquareText className="size-5" />}
        label="Completed commissions"
        note="Projects marked complete on this account"
        value={String(profile.completedCommissionsCount ?? 0)}
      />
    </section>
  );
}

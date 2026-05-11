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
    <Card className="gap-0 rounded-none border-0 bg-transparent py-0 shadow-none ring-0 sm:gap-4 sm:rounded-xl sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:py-4 sm:shadow-[var(--shadow-panel-soft)] sm:ring-1 sm:ring-foreground/10">
      <CardContent className="grid min-w-0 place-items-center gap-0 px-2 py-3 text-center sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-4 sm:text-left">
        <div className="min-w-0">
          <p className="text-lg font-extrabold tracking-[-0.05em] text-[color:var(--foreground)] sm:text-3xl">
            {value}
          </p>
          <p className="mt-0.5 text-[10px] font-medium leading-tight text-[color:var(--ink-muted)] sm:mt-1 sm:text-sm">
            {label}
          </p>
          <p className="mt-0.5 hidden text-xs text-[color:var(--ink-soft)] sm:block">
            {note}
          </p>
        </div>
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-alt)] text-[color:var(--brand-orange)] sm:flex sm:size-12">
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
      className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-3"
    >
      <StatCard
        icon={<Sparkles className="size-5" />}
        label="Average rating"
        note={`${profile.reviewCount} review${profile.reviewCount === 1 ? "" : "s"} from talents`}
        value={profile.reviewCount > 0 ? rating.toFixed(1) : "0.0"}
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

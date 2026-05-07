import type { TalentProfile } from "@/lib/types";

type TalentProfileSidebarProps = {
  primaryServiceId?: string;
  talent: TalentProfile;
};

const availabilityStyles = {
  available: {
    dot: "bg-[color:var(--tone-green-base)]",
    label: "Open for commissions",
    pill: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  },
  unavailable: {
    dot: "bg-[color:var(--tone-red-base)]",
    label: "Currently unavailable",
    pill: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  },
} as const;

export function TalentProfileSidebar({
  primaryServiceId,
  talent,
}: TalentProfileSidebarProps) {
  const availability = talent.available
    ? availabilityStyles.available
    : availabilityStyles.unavailable;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
        <h3 className="typo-card-title-lg mb-5 text-foreground">Quick Stats</h3>
        <div className="space-y-4">
          {[
            { label: "Projects Completed", value: talent.completedProjects },
            { label: "Services Offered", value: talent.servicesCount },
            { label: "Total Reviews", value: talent.reviewCount },
            { label: "Rating", value: `${talent.rating.toFixed(1)} / 5.0` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-[color:var(--ink-muted)]">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-foreground">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
        <h3 className="typo-card-title-lg mb-3 text-foreground">
          Availability
        </h3>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${availability.pill}`}
        >
          <span className={`h-2 w-2 rounded-full ${availability.dot}`} />
          {availability.label}
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br from-[color:var(--tone-orange-soft)] to-white p-6">
        <h3 className="typo-card-title-lg mb-2 text-foreground">
          Hourly Rate
        </h3>
        <p className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--brand-orange)]">
          ₱{talent.minRate} – ₱{talent.maxRate}
        </p>
        <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
          Final rate depends on project scope
        </p>
      </div>

      <a
        className="block w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] px-6 py-4 text-center text-sm font-bold text-white shadow-[var(--shadow-brand-orange-sm)] transition-all hover:brightness-105 hover:shadow-[var(--shadow-brand-orange-lg-soft)] active:scale-[0.98]"
        href={`/book/${primaryServiceId ?? ""}`}
      >
        Book {talent.firstName}&apos;s Services
      </a>
    </div>
  );
}

import { clients, services, talents } from "@/lib/mock-data";

type AdminOverviewProps = {
  activeServices: number;
  pendingApprovals: number;
  totalUsers: number;
};

export function AdminOverview({
  activeServices,
  pendingApprovals,
  totalUsers,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            bg: "from-[color:var(--tone-sky-soft)] to-white",
            emoji: "👥",
            label: "Total Users",
            value: totalUsers,
          },
          {
            bg: "from-[color:var(--tone-amber-soft)] to-white",
            emoji: "⏳",
            label: "Pending Approvals",
            value: pendingApprovals,
          },
          {
            bg: "from-[color:var(--tone-green-soft)] to-white",
            emoji: "🛠️",
            label: "Active Services",
            value: activeServices,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <div>
              <p className="text-3xl font-extrabold leading-none tracking-[-0.03em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">
                {stat.label}
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/60 opacity-90 shadow-sm">
              <span className="text-3xl">{stat.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
          <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
            User Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Student Providers
              </span>
              <span className="text-sm font-bold text-foreground">
                {talents.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Clients
              </span>
              <span className="text-sm font-bold text-foreground">
                {clients.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Verified Providers
              </span>
              <span className="text-sm font-bold text-[color:var(--tone-green-deep)]">
                {talents.filter((talent) => talent.verified).length}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
          <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
            Platform Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Active Services
              </span>
              <span className="text-sm font-bold text-foreground">
                {activeServices}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Draft Services
              </span>
              <span className="text-sm font-bold text-foreground">
                {services.filter((service) => service.status === "draft").length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
              <span className="text-sm text-[color:var(--ink-muted)]">
                Total Listings
              </span>
              <span className="text-sm font-bold text-foreground">
                {services.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

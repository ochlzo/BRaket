import Link from "next/link";

import { ProfileQuickActions } from "@/app/dashboard/profile/_components/profile-quick-actions";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

const talentStats = [
  {
    bg: "from-[color:var(--tone-orange-soft)] to-white",
    label: "Active Bookings",
    value: 0,
  },
  {
    bg: "from-[color:var(--tone-amber-soft)] to-white",
    label: "Pending Requests",
    value: 0,
  },
  {
    bg: "from-[color:var(--tone-sky-soft)] to-white",
    label: "Published Services",
    value: 0,
  },
  {
    bg: "from-[color:var(--tone-green-soft)] to-white",
    label: "Completed Projects",
    value: 0,
  },
];

export default async function TalentDashboardPage() {
  const user = await requireCurrentAppUser("talent");
  const titleName = user.firstName || user.displayName || user.username;

  return (
    <DashboardLayout
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          New Service
        </Link>
      }
      role="talent"
      subtitle="This account now starts clean. New service requests and commissions will appear here once you publish real work."
      title={`Welcome back, ${titleName}`}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:w-[70%]">
        {talentStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <p className="text-2xl font-extrabold leading-none tracking-[-0.03em] text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium leading-none text-[color:var(--ink-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <ProfileQuickActions isClient={false} />
      </div>

      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-12 text-center">
        <p className="text-lg font-semibold text-foreground">
          No live commission activity yet
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          Demo requests are gone for new accounts. Finish your profile, publish
          a service, and your real commission activity will show up here.
        </p>
      </div>
    </DashboardLayout>
  );
}

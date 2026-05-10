import Link from "next/link";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

const clientStats = [
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
    label: "Total Bookings",
    value: 0,
  },
];

export default async function ClientDashboardPage() {
  const user = await requireCurrentAppUser("client");
  const titleName = user.firstName || user.displayName || user.username;

  return (
    <DashboardLayout
      role="client"
      subtitle="Your live account is ready. Project activity will appear here as you start using BRaket."
      title={`Welcome back, ${titleName}`}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:w-[70%]">
        {clientStats.map((stat) => (
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

      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-12 text-center">
        <p className="text-lg font-semibold text-foreground">
          No project activity yet
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          We removed the demo bookings from new accounts. Your dashboard will
          fill with real requests, bookings, and project updates as you start
          working with talent.
        </p>
      </div>
    </DashboardLayout>
  );
}

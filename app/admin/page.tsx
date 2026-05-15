import { ShieldCheck, UsersRound, Wrench } from "lucide-react";

import { AdminVerificationConsole } from "@/app/admin/_components/admin-verification-console";
import { BrandMark } from "@/components/shared/branding/brand-mark";
import { getAdminVerificationDashboardData } from "@/server/talent-verification/admin-data";
import { requireAdminUser } from "@/server/admin/access";

export default async function AdminPage() {
  const admin = await requireAdminUser();
  const data = await getAdminVerificationDashboardData();
  const stats = [
    {
      icon: UsersRound,
      label: "Users",
      value: data.totalUsers,
    },
    {
      icon: ShieldCheck,
      label: "Verified talents",
      value: data.verifiedTalents,
    },
    {
      icon: Wrench,
      label: "Services",
      value: data.activeServices,
    },
  ];

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] text-foreground">
      <header className="border-b border-[color:var(--line-strong)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <BrandMark href="/admin" subtitle="Admin" />
          <div className="rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-2 text-xs font-semibold text-[color:var(--ink-muted)]">
            Signed in as {admin.email}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-orange)]">
              Talent verification
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Admin Review Queue
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
              Review BU student emails and uploaded IDs before talent accounts
              become verified.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3"
                key={stat.label}
              >
                <div className="flex items-center gap-2 text-[color:var(--ink-muted)]">
                  <stat.icon className="size-4" />
                  <span className="text-xs font-semibold">{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <AdminVerificationConsole requests={data.pendingRequests} />
      </section>
    </main>
  );
}

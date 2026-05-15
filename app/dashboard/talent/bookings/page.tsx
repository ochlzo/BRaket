import Link from "next/link";

import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function TalentBookingsPage() {
  await requireCurrentAppUser("talent");

  return (
    <TalentDashboardLayout
      subtitle="Manage your live commission requests here as they arrive."
      title="My Bookings"
    >
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">
          No bookings found
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          This new account starts with a clean slate. Real commission requests
          will appear here after clients begin booking your services.
        </p>
        <Link
          href="/dashboard/talent/services/new"
          className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          Create a Service
        </Link>
      </div>
    </TalentDashboardLayout>
  );
}

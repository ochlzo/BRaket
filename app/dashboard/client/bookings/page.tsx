import Link from "next/link";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function ClientBookingsPage() {
  await requireCurrentAppUser("client");

  return (
    <DashboardLayout
      role="client"
      subtitle="Track your real project requests and bookings here."
      title="My Bookings"
    >
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">
          No bookings found
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          This account no longer inherits demo bookings. Once you submit a real
          project request, it will appear here.
        </p>
        <Link
          href="/browse"
          className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          Browse Talent
        </Link>
      </div>
    </DashboardLayout>
  );
}

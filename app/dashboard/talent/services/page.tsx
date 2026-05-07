import Link from "next/link";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function MyServicesPage() {
  await requireCurrentAppUser("talent");

  return (
    <DashboardLayout
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          Create New Service
        </Link>
      }
      role="talent"
      subtitle="Manage the real services attached to your account."
      title="My Services"
    >
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">
          No services yet
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          Demo services are no longer injected into new profiles. Publish your
          first real service and it will show up here.
        </p>
        <Link
          href="/dashboard/talent/services/new"
          className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          Create Your First Service
        </Link>
      </div>
    </DashboardLayout>
  );
}

"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getServicesByTalent, getCategoryLabel, mockCurrentTalentProfile, services as allServices } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  published: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  draft: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  paused: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

export default function MyServicesPage() {
  // Get ALL services for this talent (including drafts)
  const talentServices = allServices.filter(
    (s) => s.talentId === mockCurrentTalentProfile.id
  );

  return (
    <DashboardLayout
      role="talent"
      title="My Services"
      subtitle="Manage and create your service listings"
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          + Create New Service
        </Link>
      }
    >
      {talentServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
          <p className="text-4xl">🛠️</p>
          <p className="mt-4 text-lg font-bold text-foreground">No services yet</p>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            Create your first service to start receiving booking requests
          </p>
          <Link
            href="/dashboard/talent/services/new"
            className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-orange-strong)]"
          >
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {talentServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--tone-indigo-deep)]">
                  {getCategoryLabel(service.category)}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[service.status]}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>

              <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">{service.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {service.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-extrabold text-[color:var(--brand-orange)]">
                  ₱{service.price.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-[color:var(--line-strong)] bg-white px-4 py-2 text-xs font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[color:var(--tone-red-base)]/30 px-4 py-2 text-xs font-bold text-[color:var(--tone-red-base)] transition hover:bg-[color:var(--tone-red-soft)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

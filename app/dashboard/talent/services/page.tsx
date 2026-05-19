import Link from "next/link";

import { TalentServiceMediaShowcase } from "@/app/dashboard/talent/_components/talent-service-media-showcase";
import { TalentServiceDialog } from "@/app/dashboard/talent/profile/_components/talent-service-dialog";
import { getCategoryOptions } from "@/app/onboarding/talent/_lib/get-category-options";
import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import type { TalentServiceListItem } from "@/lib/bookings/types";
import { getServicesForTalent } from "@/server/bookings/data";
import { requireCurrentAppUser } from "@/server/users/current-user";

function serviceCategories(service: TalentServiceListItem) {
  return service.categories.length > 0
    ? service.categories.slice(0, 3)
    : ["Service"];
}

function MyServiceCard({
  availableCategories,
  service,
}: {
  availableCategories: Awaited<ReturnType<typeof getCategoryOptions>>;
  service: TalentServiceListItem;
}) {
  return (
    <article className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {serviceCategories(service).map((category) => (
              <span
                className="max-w-full rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-center text-xs font-bold leading-4 text-[color:var(--tone-indigo-deep)]"
                key={category}
              >
                <span className="block whitespace-normal break-words">
                  {category}
                </span>
              </span>
            ))}
          </div>
          <h2 className="line-clamp-1 text-lg font-extrabold tracking-normal text-foreground">
            {service.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--ink-muted)]">
            {service.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          <TalentServiceDialog
            availableCategories={availableCategories}
            service={service}
          />
          <div className="text-left lg:text-right">
            <p className="text-sm font-extrabold text-[color:var(--brand-orange)]">
              {service.priceLabel}
            </p>
            <p className="mt-1 text-xs font-semibold text-[color:var(--ink-soft)]">
              Published{" "}
              {new Date(service.createdAt).toLocaleDateString("en-PH")}
            </p>
          </div>
        </div>
      </div>

      {service.media.length > 0 ? (
        <div className="mt-4">
          <TalentServiceMediaShowcase
            media={service.media}
            title={service.title}
          />
        </div>
      ) : null}
    </article>
  );
}

export default async function MyServicesPage() {
  const currentUser = await requireCurrentAppUser("talent");
  const [services, availableCategories] = await Promise.all([
    getServicesForTalent(currentUser),
    getCategoryOptions(),
  ]);

  return (
    <TalentDashboardLayout
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          Create New Service
        </Link>
      }
      subtitle="Manage the real services attached to your account."
      title="My Services"
    >
      {services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <MyServiceCard
              availableCategories={availableCategories}
              key={service.id}
              service={service}
            />
          ))}
        </div>
      ) : (
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
      )}
    </TalentDashboardLayout>
  );
}

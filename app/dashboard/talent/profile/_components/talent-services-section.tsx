import type { TalentProfileServiceItem } from "@/lib/talent-profile/types";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import Link from "next/link";

import { ReportButton } from "@/components/shared/moderation/report-button";
import { TalentMediaCollage } from "@/app/dashboard/talent/_components/talent-media-collage";
import { TalentServiceDialog } from "./talent-service-dialog";

type TalentServicesSectionProps = {
  availableCategories?: CategoryOption[];
  showBookLinks?: boolean;
  services: TalentProfileServiceItem[];
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatPrice(service: TalentProfileServiceItem) {
  if (service.minPrice === service.maxPrice) {
    return pesoFormatter.format(service.minPrice);
  }

  return `${pesoFormatter.format(service.minPrice)} - ${pesoFormatter.format(
    service.maxPrice,
  )}`;
}

function serviceCategories(service: TalentProfileServiceItem) {
  return service.categories.length > 0
    ? service.categories.slice(0, 3)
    : ["Service"];
}

function TalentServiceCard({
  availableCategories,
  service,
  showBookLink,
}: {
  availableCategories: CategoryOption[];
  service: TalentProfileServiceItem;
  showBookLink: boolean;
}) {
  return (
    <article className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-surface-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {serviceCategories(service).map((category) => (
            <span
              className="inline-flex min-w-0 max-w-full items-center rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-bold text-[color:var(--tone-orange-deep)]"
              key={category}
            >
              <span className="truncate">{category}</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-extrabold text-[color:var(--foreground)]">
            {formatPrice(service)}
          </span>
          {!showBookLink ? (
            <TalentServiceDialog
              availableCategories={availableCategories}
              service={service}
            />
          ) : null}
          {showBookLink ? (
            <ReportButton
              label="Report service"
              targetId={service.id}
              targetLabel={service.title}
              targetPath={`/book/${service.id}`}
              targetType="SERVICE"
            />
          ) : null}
        </div>
      </div>

      <h3 className="mt-3 text-base font-extrabold tracking-normal text-[color:var(--foreground)]">
        {service.title}
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
        {service.description}
      </p>

      {service.media.length > 0 ? (
        <div className="mt-4">
          <TalentMediaCollage
            dialogTitle="Service images"
            media={service.media}
            title={service.title}
          />
        </div>
      ) : null}

      {showBookLink ? (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Link
            className="inline-flex items-center rounded-full bg-[color:var(--brand-blue)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
            href={`/book/${service.id}`}
          >
            Book Service
          </Link>
        </div>
      ) : null}
    </article>
  );
}

export function TalentServicesSection({
  availableCategories = [],
  services,
  showBookLinks = false,
}: TalentServicesSectionProps) {
  return (
    <section
      className="scroll-mt-24 overflow-hidden rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]"
      id="services"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">Services</h2>
        {!showBookLinks ? (
          <TalentServiceDialog availableCategories={availableCategories} />
        ) : null}
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {services.length > 0 ? (
          services.map((service) => (
            <TalentServiceCard
              availableCategories={availableCategories}
              key={service.id}
              service={service}
              showBookLink={showBookLinks}
            />
          ))
        ) : (
          <div className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-5 py-8 text-center">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              No services published yet
            </p>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Published services will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

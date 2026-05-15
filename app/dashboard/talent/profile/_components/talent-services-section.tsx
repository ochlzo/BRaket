import type { TalentProfileServiceItem } from "@/lib/talent-profile/types";

import { TalentMediaCollage } from "./talent-media-collage";

type TalentServicesSectionProps = {
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

function categoryLabel(service: TalentProfileServiceItem) {
  return service.categories[0] || "Service";
}

function TalentServiceCard({ service }: { service: TalentProfileServiceItem }) {
  return (
    <article className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-surface-soft)]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex max-w-[65%] items-center rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-bold text-[color:var(--tone-orange-deep)]">
          <span className="truncate">{categoryLabel(service)}</span>
        </span>
        <span className="shrink-0 text-sm font-extrabold text-[color:var(--foreground)]">
          {formatPrice(service)}
        </span>
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

      {/* Book Now placement reserved here; hidden on the owner's talent profile. */}
    </article>
  );
}

export function TalentServicesSection({ services }: TalentServicesSectionProps) {
  return (
    <section className="overflow-hidden rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]">
      <div className="border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">Services</h2>
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {services.length > 0 ? (
          services.map((service) => (
            <TalentServiceCard key={service.id} service={service} />
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

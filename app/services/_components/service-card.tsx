import Link from "next/link";
import { ReportButton } from "@/components/shared/moderation/report-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { BookableServiceCard } from "@/lib/bookings/types";

type ServiceCardProps = {
  service: BookableServiceCard;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const categories = service.categories.length > 0 ? service.categories.slice(0, 3) : ["Service"];

  return (
    <article className="flex flex-col rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)] transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex min-h-[4.25rem] items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap content-start gap-1.5">
          {categories.map((category) => (
            <span
              className="flex min-h-7 items-center justify-center rounded-full bg-[color:var(--tone-indigo-soft)] px-2.5 py-1 text-center text-[11px] font-bold leading-tight text-[color:var(--tone-indigo-deep)] whitespace-nowrap"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
        <ReportButton
          label="Report"
          targetId={service.id}
          targetLabel={`${service.title} by ${service.talent.displayName}`}
          targetPath={`/book/${service.id}`}
          targetType="SERVICE"
        />
      </div>
      <h2 className="mt-3 min-h-14 line-clamp-2 text-lg font-extrabold tracking-normal text-foreground">
        {service.title}
      </h2>
      <p className="mt-2 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-[color:var(--ink-muted)]">
        {service.description}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <UserAvatar
          alt={service.talent.displayName}
          className="h-10 w-10"
          initials={service.talent.initials}
          src={service.talent.avatarUrl}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {service.talent.displayName}
          </p>
          <p className="truncate text-xs text-[color:var(--ink-muted)]">
            {service.talent.headline}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <span className="text-base font-extrabold text-[color:var(--brand-orange)]">
          {service.priceLabel}
        </span>
        <Link
          className="rounded-full bg-[color:var(--brand-blue)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
          href={`/book/${service.id}`}
        >
          Book
        </Link>
      </div>
    </article>
  );
}

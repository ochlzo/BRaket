import Image from "next/image";

import {
  BriefcaseIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/shared/icons/marketing-icons";
import type { TalentProfile } from "@/lib/types";

type TalentProfileHeroProps = {
  primaryServiceId?: string;
  talent: TalentProfile;
};

export function TalentProfileHero({
  primaryServiceId,
  talent,
}: TalentProfileHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-0 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,var(--surface)_50%,var(--tone-orange-pale)_100%)]" />

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-white shadow-lg sm:h-40 sm:w-40">
              <Image
                alt={`${talent.firstName} ${talent.lastName}`}
                className="h-full w-full object-cover"
                height={400}
                src={talent.avatarUrl}
                width={400}
              />
            </div>
            {talent.available ? (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--tone-green-base)] px-3 py-1 text-xs font-bold text-white shadow-md">
                Available
              </div>
            ) : null}
          </div>

          <div className="flex-1 space-y-4 pb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
                {talent.firstName} {talent.lastName}
              </h1>
              <p className="mt-1 text-lg font-medium text-[color:var(--ink-muted)]">
                {talent.headline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--ink-muted)]">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4" />
                {talent.location}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[color:var(--brand-orange)]">
                  <StarIcon className="h-4 w-4 fill-current" />
                </span>
                <span className="font-semibold text-foreground">
                  {talent.rating.toFixed(1)}
                </span>
                ({talent.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <BriefcaseIcon className="h-4 w-4" />
                {talent.completedProjects} projects completed
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[color:var(--tone-sky-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--tone-sky-deep)]">
                ₱{talent.minRate} – ₱{talent.maxRate}/hr
              </span>
              <a
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-orange)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                href={`/book/${primaryServiceId ?? ""}`}
              >
                Book Service
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border-2 border-[color:var(--line-strong)] px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                href="/post-project"
              >
                Post a Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

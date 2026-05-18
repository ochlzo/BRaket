import {
  Briefcase,
  CalendarDays,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import { ReportButton } from "@/components/shared/moderation/report-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { ClientProfilePageData } from "@/lib/client-profile/types";

type PublicClientProfileHeroProps = {
  profile: ClientProfilePageData;
};

function coverBackgroundStyle(value: string) {
  if (/gradient\(/i.test(value)) {
    return { background: value };
  }

  return {
    backgroundImage: `url(${value})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function contactItems(profile: ClientProfilePageData) {
  return [
    { icon: Mail, label: profile.email },
    { icon: Phone, label: profile.contactNum },
    { icon: Globe, label: profile.website },
  ].filter((item) => item.label);
}

export function PublicClientProfileHero({
  profile,
}: PublicClientProfileHeroProps) {
  const displayTitle = profile.organizationName || profile.displayName;
  const rating = profile.averageRating ?? 0;
  const contacts = contactItems(profile);

  return (
    <section className="overflow-hidden bg-[color:var(--surface)] sm:rounded-[1.4rem] sm:border sm:border-[color:var(--line-strong)] sm:shadow-[var(--shadow-panel-elevated)]">
      <div
        className="relative min-h-40 overflow-hidden sm:min-h-52"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.04),rgba(18,24,35,.28))]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <UserAvatar
            alt={profile.displayName}
            className="h-24 w-24 shrink-0 rounded-3xl border-4 border-white bg-[color:var(--surface-alt)] shadow-lg after:rounded-3xl sm:h-40 sm:w-40"
            fallbackClassName="rounded-3xl text-2xl font-black text-[color:var(--ink-muted)] sm:text-4xl"
            imageClassName="rounded-3xl"
            initials={`${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`}
            src={profile.avatarUrl}
          />

          <div className="min-w-0 flex-1 space-y-3 sm:pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Client profile
                </p>
                <h1 className="mt-1 break-words text-2xl font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl">
                  {displayTitle}
                </h1>
                <p className="mt-1 break-words text-sm font-medium text-[color:var(--ink-muted)] sm:text-lg">
                  @{profile.username}
                </p>
              </div>
              <ReportButton
                label="Report profile"
                targetId={profile.userId}
                targetLabel={`${displayTitle} client profile`}
                targetPath={`/client/${profile.username}`}
                targetType="PROFILE"
              />
            </div>

            {contacts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contacts.map(({ icon: Icon, label }) => (
                  <span
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-muted)]"
                    key={label}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--ink-muted)]">
              <a
                className="flex items-center gap-1.5 whitespace-nowrap underline-offset-4 hover:underline"
                href="#client-reviews"
              >
                <Star className="h-4 w-4 fill-current text-[color:var(--brand-orange)]" />
                <span className="font-semibold text-foreground">
                  {rating.toFixed(1)}
                </span>
                ({profile.reviewCount} reviews)
              </a>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="h-4 w-4" />
                {profile.reputationScore.toFixed(0)} reputation
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Briefcase className="h-4 w-4" />
                {profile.completedCommissionsCount ?? 0} completed projects
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CalendarDays className="h-4 w-4" />
                Joined{profile.joinedLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

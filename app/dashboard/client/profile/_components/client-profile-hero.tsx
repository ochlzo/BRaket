import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

import { ClientProfileEditor } from "./client-profile-editor";
import type { ClientProfilePageData } from "@/lib/client-profile/types";

type ClientProfileHeroProps = {
  profile: ClientProfilePageData;
};

function coverBackgroundStyle(value: string) {
  if (/gradient\(/i.test(value)) {
    return { background: value };
  }

  return {
    backgroundImage: `linear-gradient(120deg, rgba(255,107,53,.12), rgba(79,195,247,.24)), url(${value})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

export function ClientProfileHero({ profile }: ClientProfileHeroProps) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-panel-elevated)]">
      <div
        className="relative min-h-40 overflow-hidden"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.08),rgba(18,24,35,.4))]" />
      </div>

      <div className="space-y-5 px-5 pb-5 pt-1 pl-1 sm:px-6 sm:pb-6">
        <div className="-mt-9 flex flex-col gap-4 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0 overflow-visible">
              <div className="relative size-20 overflow-hidden rounded-[1.1rem] border-[3px] border-white bg-[color:var(--surface-alt)] shadow-[var(--shadow-panel-soft)] sm:size-24">
                {profile.avatarUrl ? (
                  <Image
                    alt={profile.displayName}
                    className="object-cover"
                    fill
                    priority
                    sizes="96px"
                    src={profile.avatarUrl}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg font-black text-[color:var(--ink-muted)]">
                    {profile.organizationName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <ClientProfileEditor
                iconOnly
                profile={profile}
                triggerClassName="absolute bottom-0 right-0 z-20 h-8 w-8 translate-x-[35%] translate-y-[35%] rounded-full border border-white/70 bg-[color:var(--brand-orange)] text-white shadow-[var(--shadow-brand-orange-md)] hover:bg-[color:var(--brand-orange-strong)]"
                triggerLabel="Edit profile"
              />
            </div>
            <div className="pb-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
                Client profile
              </p>
              <h1 className="typo-card-title-2xl mt-1 text-[color:var(--foreground)]">
                {profile.organizationName}
              </h1>
              <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
                {profile.displayName} - @{profile.username}
              </p>
            </div>
          </div>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-[color:var(--ink-body)] sm:text-base">
          {profile.about || "Add a short description so talents understand the kind of work you post and the projects you want to commission."}
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--tone-sky-soft)] px-3 py-1.5 font-semibold text-[color:var(--tone-sky-deep)]">
            <Mail className="size-4" />
            {profile.email}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 font-semibold text-[color:var(--tone-orange-deep)]">
            <MapPin className="size-4" />
            {profile.businessAddress || "Business address not set"}
          </span>
        </div>
      </div>
    </article>
  );
}

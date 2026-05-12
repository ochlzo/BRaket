import Link from "next/link";

import type { ClientProfile, TalentProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@/app/dashboard/profile/_components/profile-icons";

type ProfileHeroCardProps = {
  isClient: boolean;
  isVerified: boolean;
  joinDate: string;
  profile: ClientProfile | TalentProfile;
  talentProfile: TalentProfile | null;
};

function getFullName(profile: ClientProfile | TalentProfile) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return fullName || profile.username;
}

export function ProfileHeroCard({
  isClient,
  isVerified,
  joinDate,
  profile,
  talentProfile,
}: ProfileHeroCardProps) {
  const fullName = getFullName(profile);
  const bio =
    profile.bio || "Add a short bio so clients understand what you do best.";

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-white">
      <div className="relative h-16 bg-gradient-to-r from-[color:var(--brand-orange)] via-[color:var(--brand-orange-accent)] to-[color:var(--brand-blue)]">
        <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/[0.07]" />
      </div>

      <div className="relative px-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="-mt-8 h-16 w-16 shrink-0 rounded-none border-[3px] border-white bg-white shadow-md after:rounded-none">
              {profile.avatarUrl ? (
                <AvatarImage
                  alt={fullName}
                  className="rounded-none"
                  src={profile.avatarUrl}
                />
              ) : (
                <AvatarFallback className="rounded-none text-sm font-black text-[color:var(--ink-muted)]">
                  {profile.initials || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="mt-1.5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold leading-none tracking-[-0.03em] text-foreground">
                  {fullName}
                </h2>
                {isVerified ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--tone-green-soft)] px-2 py-px text-[10px] font-bold text-[color:var(--tone-green-deep)]">
                    <ShieldCheckIcon className="size-3" />
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-none text-[color:var(--ink-muted)]">
                @{profile.username}
                {!isClient && talentProfile?.headline ? (
                  <span className="ml-1.5 text-[color:var(--ink-soft)]">
                    - {talentProfile.headline}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <Link
            className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
            href="/settings"
          >
            Edit Profile
          </Link>
        </div>

        <p className="text-xs leading-relaxed text-[color:var(--ink-body)]">
          {bio}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[color:var(--ink-muted)]">
          <span className="flex items-center gap-1">
            <EnvelopeIcon /> {profile.email}
          </span>
          {!isClient && talentProfile ? (
            <span className="flex items-center gap-1">
              <MapPinIcon /> {talentProfile.location || "Location not set"}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <CalendarIcon /> {joinDate}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--tone-sky-soft)] px-2 py-px text-[10px] font-bold text-[color:var(--tone-sky-deep)]">
            {isClient ? "Client" : "Talent"}
          </span>
        </div>
      </div>
    </div>
  );
}

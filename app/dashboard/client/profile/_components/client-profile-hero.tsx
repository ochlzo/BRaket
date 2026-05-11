import { ClientProfileEditor } from "./client-profile-editor";
import type { ClientProfilePageData } from "@/lib/client-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type ClientProfileHeroProps = {
  profile: ClientProfilePageData;
  user: CurrentAppUser;
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

function getInitials(value: string, fallback: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || fallback.slice(0, 1).toUpperCase();
}

export function ClientProfileHero({ profile, user }: ClientProfileHeroProps) {
  const avatarFallback = getInitials(user.displayName, user.username);

  return (
    <article className="overflow-hidden rounded-[1.2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-panel-elevated)] sm:rounded-[1.4rem]">
      <div
        className="relative min-h-32 overflow-hidden sm:min-h-40"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.08),rgba(18,24,35,.4))]" />
      </div>

      <div className="space-y-4 px-4 pb-4 pt-1 sm:space-y-5 sm:px-6 sm:pb-6">
        <div className="-mt-7 flex flex-col gap-3 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3 sm:items-end sm:gap-4">
            <div className="relative shrink-0 overflow-visible">
              <Avatar className="size-16 rounded-none border-[3px] border-white bg-[color:var(--surface-alt)] shadow-[var(--shadow-panel-soft)] after:rounded-none sm:size-24">
                {user.avatarUrl ? (
                  <AvatarImage
                    alt={user.displayName}
                    className="rounded-none"
                    src={user.avatarUrl}
                  />
                ) : (
                  <AvatarFallback className="rounded-none text-lg font-black text-[color:var(--ink-muted)]">
                    {avatarFallback}
                  </AvatarFallback>
                )}
              </Avatar>
              <ClientProfileEditor
                iconOnly
                profile={profile}
                triggerClassName="absolute bottom-0 right-0 z-20 h-7 w-7 translate-x-[35%] translate-y-[35%] rounded-full border border-white/70 bg-[color:var(--brand-orange)] text-white shadow-[var(--shadow-brand-orange-md)] hover:bg-[color:var(--brand-orange-strong)] sm:h-8 sm:w-8"
                triggerLabel="Edit profile"
              />
            </div>
            <div className="pb-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
                Client profile
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[color:var(--foreground)] sm:typo-card-title-2xl">
                {user.displayName}
              </h1>
              <p className="mt-1 text-xs font-medium text-[color:var(--ink-muted)] sm:text-sm">
                {user.username} - {user.email}
              </p>
            </div>
          </div>
        </div>

        <p className="max-w-4xl text-sm leading-6 text-[color:var(--ink-body)] sm:text-base sm:leading-7">
          {profile.about ||
            "Add a short description so talents understand the kind of work you post and the projects you want to commission."}
        </p>
      </div>
    </article>
  );
}

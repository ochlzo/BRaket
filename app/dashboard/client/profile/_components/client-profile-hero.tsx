import type { ClientProfilePageData } from "@/lib/client-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, PencilLine } from "lucide-react";

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
    <article className="overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:rounded-[1.4rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-elevated)]">
      <div
        className="relative min-h-32 overflow-hidden sm:min-h-40"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.08),rgba(18,24,35,.4))]" />
      </div>

      <div className="relative space-y-4 px-4 pb-4 pt-1 sm:space-y-5 sm:px-6 sm:pb-6">
        <button
          aria-label="Profile menu"
          className="absolute right-1 top-0 z-20 inline-flex size-8 items-center justify-center rounded-full text-[color:var(--ink-muted)] transition-colors hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--foreground)] sm:right-3 sm:top-2"
          type="button"
        >
          <MoreHorizontal className="size-5" />
        </button>
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
              <button
                aria-label="Edit profile"
                className="absolute bottom-0 right-0 z-20 inline-flex h-7 w-7 translate-x-[35%] translate-y-[35%] items-center justify-center rounded-full border border-white/70 bg-[color:var(--brand-orange)] text-white shadow-[var(--shadow-brand-orange-md)] transition-colors hover:bg-[color:var(--brand-orange-strong)] sm:h-8 sm:w-8"
                title="Edit profile"
                type="button"
              >
                <PencilLine className="size-4" />
              </button>
            </div>
            <div className="pb-1">
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

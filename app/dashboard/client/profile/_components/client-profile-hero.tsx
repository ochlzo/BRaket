"use client";

import { ClientProfileImageEditor } from "./client-profile-image-editor";
import { ClientProfileBioEditor } from "./client-profile-bio-editor";
import type { ClientProfilePageData } from "@/lib/client-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  MoreHorizontal,
  Twitter,
} from "lucide-react";

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

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function socialHandleFromRaw(value: string, label: string) {
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const segments = url.pathname.split("/").filter(Boolean);

      if (label === "LinkedIn" && segments[0] === "in" && segments[1]) {
        return segments[1];
      }

      if (label === "Facebook" && url.pathname.includes("profile.php")) {
        return (
          url.searchParams.get("id") || segments[segments.length - 1] || ""
        );
      }

      return (
        segments[segments.length - 1] || url.hostname.replace(/^www\./, "")
      );
    } catch {
      return value;
    }
  }

  return value.replace(/^@/, "");
}

export function ClientProfileHero({ profile, user }: ClientProfileHeroProps) {
  const router = useRouter();
  const [bioEditorOpen, setBioEditorOpen] = useState(false);
  const [bioEditorSession, setBioEditorSession] = useState(0);
  const socialLinkByLabel = new Map(
    profile.socialLinks.map((item) => [item.label, item.href]),
  );
  const socialItems = [
    {
      href: socialLinkByLabel.get("Facebook"),
      icon: Facebook,
      label: "Facebook",
      value: compactText(profile.facebookUrl),
    },
    {
      href: socialLinkByLabel.get("Instagram"),
      icon: Instagram,
      label: "Instagram",
      value: compactText(profile.instagramUrl),
    },
    {
      href: socialLinkByLabel.get("X"),
      icon: Twitter,
      label: "X",
      value: compactText(profile.xUrl),
    },
    {
      href: socialLinkByLabel.get("GitHub"),
      icon: Github,
      label: "GitHub",
      value: compactText(profile.githubUrl),
    },
    {
      href: socialLinkByLabel.get("LinkedIn"),
      icon: Linkedin,
      label: "LinkedIn",
      value: compactText(profile.linkedinUrl),
    },
  ]
    .filter((item) => item.value)
    .map((item) => ({
      ...item,
      displayName: socialHandleFromRaw(item.value, item.label),
    }))
    .filter((item) => item.displayName.length > 0);

  return (
    <article className="overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:rounded-[1.4rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-elevated)]">
      <div
        className="relative min-h-32 overflow-hidden sm:min-h-40"
        style={coverBackgroundStyle(profile.backgroundImageUrl)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,35,.08),rgba(18,24,35,.4))]" />
      </div>

      <div className="relative space-y-4 px-4 pb-4 pt-1 sm:space-y-5 sm:px-6 sm:pb-6">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                aria-label="Profile menu"
                className="absolute right-1 top-0 z-20 inline-flex size-8 items-center justify-center rounded-full text-[color:var(--ink-muted)] transition-colors hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--foreground)] sm:right-3 sm:top-2"
                type="button"
              />
            }
          >
            <MoreHorizontal className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuItem onClick={() => router.push("/settings/account")}>
              Edit personal details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setBioEditorSession((value) => value + 1);
                setBioEditorOpen(true);
              }}
            >
              Edit bio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ClientProfileBioEditor
          key={bioEditorSession}
          about={profile.about}
          open={bioEditorOpen}
          onOpenChange={setBioEditorOpen}
        />
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
                    {user.initials || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <ClientProfileImageEditor
                initials={user.initials}
                avatarUrl={user.avatarUrl}
                backgroundImageUrl={profile.backgroundImageUrl}
                displayName={user.displayName}
                triggerClassName="absolute bottom-0 right-0 z-20 h-7 w-7 translate-x-[35%] translate-y-[35%] rounded-full border border-white/70 bg-[color:var(--brand-orange)] text-white shadow-[var(--shadow-brand-orange-md)] hover:bg-[color:var(--brand-orange-strong)] sm:h-8 sm:w-8"
              />
            </div>
            <div className="pb-1">
              <h1 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[color:var(--foreground)] sm:typo-card-title-2xl">
                {user.displayName}
              </h1>
              <p className="mt-1 text-xs font-medium text-[color:var(--ink-muted)] sm:text-sm">
                {user.username}
              </p>
            </div>
          </div>
        </div>

        <p className="max-w-4xl text-sm leading-6 text-[color:var(--ink-body)] sm:text-base sm:leading-7">
          {profile.about || "No bio."}
        </p>

        {socialItems.length > 0 ? (
          <div className="flex justify-center overflow-x-auto pb-1 sm:justify-end">
            <div className="flex w-max items-center gap-1.5 whitespace-nowrap sm:ml-auto sm:gap-2">
              {socialItems.map(({ displayName, href, icon: Icon, label }) => (
                <a
                  key={label}
                  aria-label={`${label}: ${displayName}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-alt)] px-2 py-1 text-[10px] font-semibold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--foreground)] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs"
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--ink-muted)] sm:size-6">
                    <Icon className="size-3" />
                  </span>
                  <span className="max-w-24 truncate sm:max-w-32">
                    {displayName}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

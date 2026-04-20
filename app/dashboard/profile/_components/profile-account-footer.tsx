import Link from "next/link";

import type { UserRole } from "@/lib/types";

type ProfileAccountFooterProps = {
  joinDate: string;
  profileId: string;
  role: UserRole;
};

export function ProfileAccountFooter({
  joinDate,
  profileId,
  role,
}: ProfileAccountFooterProps) {
  return (
    <div className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
            Account ID
          </p>
          <p className="font-mono text-xs text-foreground">{profileId}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
            Account Type
          </p>
          <p className="text-xs font-semibold capitalize text-foreground">
            {role}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
            Member Since
          </p>
          <p className="text-xs text-foreground">{joinDate}</p>
        </div>
        <Link
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-white/80"
          href="/settings"
        >
          ⚙️ Account Settings
        </Link>
      </div>
    </div>
  );
}

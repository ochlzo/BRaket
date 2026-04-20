import Image from "next/image";

import type { ClientProfile, TalentProfile } from "@/lib/types";

type AdminUserListProps = {
  flaggedUsers: Set<string>;
  handleFlagUser: (userId: string) => void;
  handleRemoveUser: (userId: string) => void;
  userList: (TalentProfile | ClientProfile)[];
};

export function AdminUserList({
  flaggedUsers,
  handleFlagUser,
  handleRemoveUser,
  userList,
}: AdminUserListProps) {
  return (
    <div>
      <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
        Showing <span className="font-semibold text-foreground">{userList.length}</span>{" "}
        registered user{userList.length !== 1 ? "s" : ""}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-white">
        {userList.map((user, index) => (
          <div
            key={user.userId}
            className={`flex items-center gap-4 px-6 py-4 transition hover:bg-[color:var(--surface-alt)] ${
              index < userList.length - 1
                ? "border-b border-[color:var(--line)]"
                : ""
            }`}
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
              <Image
                alt={`${user.firstName} ${user.lastName}`}
                className="h-full w-full object-cover"
                height={80}
                src={user.avatarUrl}
                width={80}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[color:var(--ink-muted)]">
                {user.email}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                user.role === "talent"
                  ? "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]"
                  : "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]"
              }`}
            >
              {user.role === "talent" ? "Provider" : "Client"}
            </span>
            {user.role === "talent" ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user.verified
                    ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                    : "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]"
                }`}
              >
                {user.verified ? "Verified" : "Pending"}
              </span>
            ) : null}
            {flaggedUsers.has(user.userId) ? (
              <span className="rounded-full bg-[color:var(--tone-red-soft)] px-3 py-1 text-xs font-bold text-[color:var(--tone-red-deep)]">
                Flagged
              </span>
            ) : null}
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-[color:var(--tone-amber-base)]/30 px-4 py-1.5 text-xs font-bold text-[color:var(--tone-amber-base)] transition hover:bg-[color:var(--tone-amber-soft)]"
                onClick={() => handleFlagUser(user.userId)}
                type="button"
              >
                {flaggedUsers.has(user.userId) ? "Unflag" : "Flag"}
              </button>
              <button
                className="rounded-lg border border-[color:var(--tone-red-base)]/30 px-4 py-1.5 text-xs font-bold text-[color:var(--tone-red-base)] transition hover:bg-[color:var(--tone-red-soft)]"
                onClick={() => handleRemoveUser(user.userId)}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";

import { adminStatusColors } from "@/app/dashboard/admin/_data";
import type { TalentProfile } from "@/lib/types";

type AdminApprovalsProps = {
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  pendingList: TalentProfile[];
};

export function AdminApprovals({
  handleApprove,
  handleReject,
  pendingList,
}: AdminApprovalsProps) {
  return (
    <div>
      <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
        Showing <span className="font-semibold text-foreground">{pendingList.length}</span>{" "}
        pending provider{pendingList.length !== 1 ? "s" : ""}
      </p>

      {pendingList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-4 text-lg font-bold text-foreground">
            All caught up!
          </p>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            No pending provider approvals at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingList.map((talent) => (
            <div
              key={talent.id}
              className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    alt={`${talent.firstName} ${talent.lastName}`}
                    className="h-full w-full object-cover"
                    height={112}
                    src={talent.avatarUrl}
                    width={112}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {talent.firstName} {talent.lastName}
                      </h3>
                      <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">
                        {talent.headline} · {talent.email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${adminStatusColors.pending}`}
                    >
                      Pending Review
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-body)]">
                    {talent.bio}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {talent.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill.name}
                        className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-medium text-[color:var(--ink-body)]"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="rounded-lg bg-[color:var(--tone-green-base)] px-5 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--tone-green-deep)]"
                      onClick={() => handleApprove(talent.id)}
                      type="button"
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="rounded-lg border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-5 py-2 text-xs font-bold text-[color:var(--tone-red-deep)] transition hover:bg-[color:var(--tone-red-base)]/20"
                      onClick={() => handleReject(talent.id)}
                      type="button"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

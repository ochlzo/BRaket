import Image from "next/image";
import { Check, ExternalLink, X } from "lucide-react";

import {
  approveTalentVerificationAction,
  rejectTalentVerificationAction,
} from "@/app/admin/_actions/review-talent-verification-action";
import type { AdminVerificationRequest } from "@/server/talent-verification/admin-data";

type AdminVerificationConsoleProps = {
  requests: AdminVerificationRequest[];
};

export function AdminVerificationConsole({
  requests,
}: AdminVerificationConsoleProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold">No pending verification requests</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--ink-muted)]">
          New BU student talent applications will appear here once applicants
          submit their email and ID.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {requests.map((request) => (
        <article
          className="grid gap-5 rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)] lg:grid-cols-[22rem_minmax(0,1fr)]"
          key={request.requestId}
        >
          <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-alt)]">
            {request.buIdImageUrl ? (
              <a
                className="group block"
                href={request.buIdImageUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    alt={`${request.displayName} BU ID`}
                    className="object-cover transition group-hover:scale-[1.02]"
                    fill
                    sizes="(max-width: 1024px) 90vw, 352px"
                    src={request.buIdImageUrl}
                  />
                </div>
                <span className="flex items-center justify-center gap-2 border-t border-[color:var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--brand-blue)]">
                  Open private preview
                  <ExternalLink className="size-3.5" />
                </span>
              </a>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm text-[color:var(--ink-muted)]">
                Private ID preview is unavailable. Check Supabase admin storage
                configuration.
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em]">
                  {request.displayName}
                </h2>
                <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                  {request.email}
                </p>
              </div>
              <span className="w-fit rounded-full bg-[color:var(--tone-amber-soft)] px-3 py-1 text-xs font-bold text-[color:var(--tone-amber-deep)]">
                Pending review
              </span>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="BU email" value={request.buEmail} />
              <Info
                label="Submitted"
                value={new Date(request.createdAt).toLocaleString()}
              />
              <Info label="College" value={request.college || "Not provided"} />
              <Info label="Course" value={request.course || "Not provided"} />
              <Info
                label="Year level"
                value={
                  request.yearLevel ? `Year ${request.yearLevel}` : "Not provided"
                }
              />
              <Info label="Headline" value={request.headline || "Not provided"} />
            </dl>

            <div className="mt-5 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)]">
              <form action={approveTalentVerificationAction}>
                <input name="requestId" type="hidden" value={request.requestId} />
                <button
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--tone-green-base)] px-5 text-sm font-bold text-white transition hover:bg-[color:var(--tone-green-deep)] lg:w-auto"
                  type="submit"
                >
                  <Check className="size-4" />
                  Approve
                </button>
              </form>

              <form
                action={rejectTalentVerificationAction}
                className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <input name="requestId" type="hidden" value={request.requestId} />
                <input
                  className="h-11 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 text-sm outline-none focus:border-[color:var(--brand-orange)]"
                  maxLength={240}
                  name="rejectionReason"
                  placeholder="Optional rejection reason"
                />
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-5 text-sm font-bold text-[color:var(--tone-red-deep)] transition hover:bg-[color:var(--tone-red-base)]/20"
                  type="submit"
                >
                  <X className="size-4" />
                  Reject
                </button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-[color:var(--ink-body)]">
        {value}
      </dd>
    </div>
  );
}

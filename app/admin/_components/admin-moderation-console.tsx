import Link from "next/link";
import { ExternalLink, Flag } from "lucide-react";

import { updateContentReportReviewAction } from "@/app/admin/_actions/review-content-report-action";
import {
  reportReasonLabel,
  reportStatuses,
  reportStatusLabel,
} from "@/lib/moderation/report-options";
import type { AdminContentReport } from "@/server/moderation/admin-data";

type AdminModerationConsoleProps = {
  reports: AdminContentReport[];
};

export function AdminModerationConsole({
  reports,
}: AdminModerationConsoleProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-6 py-12 text-center">
        <Flag className="mx-auto size-8 text-[color:var(--ink-muted)]" />
        <p className="mt-3 text-lg font-bold">No content reports yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--ink-muted)]">
          Reports from profiles, services, bookings, and reviews will appear
          here once users flag something.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <article
          className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]"
          key={report.reportId}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[color:var(--tone-red-soft)] px-3 py-1 text-xs font-bold text-[color:var(--tone-red-deep)]">
                  {reportReasonLabel(report.reason)}
                </span>
                <span className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-bold text-[color:var(--ink-muted)]">
                  {reportStatusLabel(report.status)}
                </span>
              </div>
              <h3 className="mt-3 break-words text-lg font-black tracking-normal text-foreground">
                {report.targetLabel}
              </h3>
              <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                {report.targetType} - Reported by {report.reporterName} (
                {report.reporterEmail})
              </p>
            </div>

            {report.targetPath ? (
              <Link
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 py-1.5 text-xs font-bold text-[color:var(--brand-blue)] transition hover:bg-[color:var(--surface-hover)]"
                href={report.targetPath}
              >
                Open target
                <ExternalLink className="size-3.5" />
              </Link>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <Info label="Target ID" value={report.targetId} />
            <Info
              label="Submitted"
              value={new Date(report.createdAt).toLocaleString()}
            />
          </div>

          <div className="mt-4 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
              Reporter details
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[color:var(--ink-body)]">
              {report.details || "No extra details provided."}
            </p>
          </div>

          <form
            action={updateContentReportReviewAction}
            className="mt-4 grid gap-3 lg:grid-cols-[12rem_minmax(0,1fr)_auto]"
          >
            <input name="reportId" type="hidden" value={report.reportId} />
            <select
              className="h-11 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 text-sm font-bold text-foreground outline-none"
              defaultValue={report.status}
              name="status"
            >
              {reportStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <input
              className="h-11 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 text-sm outline-none focus:border-[color:var(--brand-orange)]"
              defaultValue={report.adminNotes}
              maxLength={500}
              name="adminNotes"
              placeholder="Admin notes"
            />
            <button
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--brand-blue)] px-5 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
              type="submit"
            >
              Save Review
            </button>
          </form>
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

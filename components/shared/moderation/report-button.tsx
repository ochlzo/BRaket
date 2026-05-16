"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  reportReasons,
  type ReportTargetTypeValue,
} from "@/lib/moderation/report-options";
import {
  createContentReportAction,
  type ReportActionState,
} from "@/server/moderation/actions";

type ReportButtonProps = {
  className?: string;
  label?: string;
  targetId: string;
  targetLabel: string;
  targetPath?: string;
  targetType: ReportTargetTypeValue;
};

const INITIAL_STATE: ReportActionState = {
  message: "",
  ok: false,
};

export function ReportButton({
  className = "",
  label = "Report",
  targetId,
  targetLabel,
  targetPath = "",
  targetType,
}: ReportButtonProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createContentReportAction,
    INITIAL_STATE,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`More actions for ${targetLabel}`}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-2 text-sm font-black leading-none text-[color:var(--ink-muted)] transition hover:bg-[color:var(--surface-alt)] hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[color:var(--brand-blue-soft)] ${className}`}
        >
          ...
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="cursor-pointer px-2 py-2 text-[color:var(--tone-red-deep)]"
            onClick={() => setIsReportOpen(true)}
          >
            <Flag className="size-4" aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
      <DialogContent className="border border-[color:var(--line-strong)] bg-[color:var(--surface)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report This Item</DialogTitle>
          <DialogDescription>
            Send this to BRaket admins for moderation review.
          </DialogDescription>
        </DialogHeader>

        {state.ok ? (
          <div className="rounded-xl bg-[color:var(--tone-green-soft)] px-4 py-3 text-sm font-semibold text-[color:var(--tone-green-deep)]">
            {state.message}
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input name="targetType" type="hidden" value={targetType} />
            <input name="targetId" type="hidden" value={targetId} />
            <input name="targetLabel" type="hidden" value={targetLabel} />
            <input name="targetPath" type="hidden" value={targetPath} />

            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-alt)] px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
                Reporting
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-foreground">
                {targetLabel}
              </p>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Reason
              <select
                className="h-10 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 text-sm font-medium outline-none focus:border-[color:var(--brand-blue)]"
                name="reason"
                required
              >
                <option value="">Choose a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Details
              <Textarea
                className="min-h-28 rounded-xl border-[color:var(--line-strong)] bg-white text-sm focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
                maxLength={500}
                name="details"
                placeholder="Add context that will help admins review this."
              />
            </label>

            {state.message ? (
              <p
                className="rounded-xl bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm font-medium text-[color:var(--tone-red-deep)]"
                role="alert"
              >
                {state.message}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button
                className="rounded-xl bg-[color:var(--brand-orange)] px-4 py-2 text-sm font-semibold !text-white hover:bg-[color:var(--brand-orange-strong)]"
                disabled={isPending}
                type="submit"
              >
                {isPending ? "Sending..." : "Send Report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

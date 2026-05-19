"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type PendingTalentVerificationDashboardProps = {
  backPath: string;
  message: string;
  onNavigate: (path: string) => void;
};

export function PendingTalentVerificationDashboard({
  backPath,
  message,
  onNavigate,
}: PendingTalentVerificationDashboardProps) {
  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <div className="mx-auto flex w-fit items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-orange)] text-3xl font-black text-white">
          B
        </div>
        <div className="text-left leading-none">
          <p className="text-5xl font-black tracking-[-0.04em] text-foreground">
            BRaket
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
            Bicol University
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-[color:var(--tone-amber-base)]/30 bg-[color:var(--tone-amber-soft)] px-6 py-8 shadow-[var(--shadow-surface-soft)] sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--tone-amber-deep)]">
          Verification pending
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight text-foreground sm:text-4xl">
          Waiting for admin to verify your BU student status.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[color:var(--ink-body)]">
          {message}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xs">
        <Button
          className="h-14 w-full rounded-2xl border-[color:var(--brand-blue)] text-base font-bold text-[color:var(--brand-blue)] hover:bg-[color:var(--surface-alt)]"
          onClick={() => onNavigate(backPath)}
          size="lg"
          type="button"
          variant="outline"
        >
          <ArrowLeft className="size-5" />
          Go back
        </Button>
      </div>
    </div>
  );
}

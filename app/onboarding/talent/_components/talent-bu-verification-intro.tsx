"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import {
  sendTalentVerificationOtpAction,
  submitTalentVerificationAction,
} from "@/app/onboarding/talent/verification/_actions/submit-talent-verification-action";
import { initialTalentVerificationState } from "@/app/onboarding/talent/verification/_actions/submit-talent-verification-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Label } from "@/components/ui/label";
import type { ApplicantVerificationState } from "@/server/talent-verification/get-applicant-state";
import {
  getPendingTalentVerificationDashboardState,
  getTalentVerificationMaybeLaterPath,
} from "@/lib/talent-onboarding/registration-route";
import { PendingTalentVerificationDashboard } from "@/app/onboarding/talent/_components/pending-talent-verification-dashboard";

type TalentBuVerificationIntroProps = {
  backLabel?: string;
  email: string;
  isTalent: boolean;
  source?: string;
  step?: string;
  verification: ApplicantVerificationState;
  verificationBasePath?: string;
};

export function TalentBuVerificationIntro({
  backLabel = "dashboard",
  email,
  isTalent,
  source,
  step,
  verification,
  verificationBasePath = "/talent/verify",
}: TalentBuVerificationIntroProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitTalentVerificationAction,
    initialTalentVerificationState,
  );
  const [otpState, otpFormAction, isSendingOtp] = useActionState(
    sendTalentVerificationOtpAction,
    initialTalentVerificationState,
  );
  const isFormStep = step === "form";
  const isDashboardSource = source === "dashboard";
  const maybeLaterPath = getTalentVerificationMaybeLaterPath(isTalent, source);
  const sourceQuery = isDashboardSource ? "&source=dashboard" : "";
  const introPath = isDashboardSource
    ? `${verificationBasePath}?source=dashboard`
    : verificationBasePath;
  const formPath = `${verificationBasePath}?step=form${sourceQuery}`;
  const pendingDashboardState = getPendingTalentVerificationDashboardState({
    isTalent,
    source,
    verificationStatus: verification.status,
  });

  if (pendingDashboardState.shouldShow) {
    return (
      <PendingTalentVerificationDashboard
        backPath={pendingDashboardState.backPath}
        message={pendingDashboardState.message}
        onNavigate={router.push}
      />
    );
  }

  if (isFormStep) {
    const isApproved = verification.status === "approved" || state.ok;
    const isAlreadyPending = verification.status === "pending" && !state.ok;
    const canSubmit = verification.status !== "pending" && !isApproved;

    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-surface-soft)] sm:p-8">
        <button
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)] transition hover:text-foreground"
          onClick={() => router.push(introPath)}
          type="button"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-orange)]">
            BU student verification
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-foreground sm:text-4xl">
            Verify your talent account
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[color:var(--ink-muted)]">
            Enter your Bicol University email and upload a clear photo of your
            student ID.
          </p>
        </div>

        {isApproved ? (
          <div className="mt-8 rounded-2xl border border-[color:var(--tone-green-base)]/30 bg-[color:var(--tone-green-soft)] p-5 text-sm text-[color:var(--tone-green-deep)]">
            Your BU student verification is approved. You can continue talent
            onboarding.
          </div>
        ) : null}

        {isAlreadyPending ? (
          <div className="mt-8 rounded-2xl border border-[color:var(--tone-amber-base)]/30 bg-[color:var(--tone-amber-soft)] p-5 text-sm text-[color:var(--tone-amber-deep)]">
            Your request for {verification.buEmail || email} is waiting for
            admin review.
          </div>
        ) : null}

        {verification.status === "rejected" && !state.ok ? (
          <div className="mt-8 rounded-2xl border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] p-5 text-sm text-[color:var(--tone-red-deep)]">
            Your previous request was rejected
            {verification.rejectionReason
              ? `: ${verification.rejectionReason}`
              : "."}
          </div>
        ) : null}

        {canSubmit ? (
        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="bu-email">Bicol University email</Label>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--ink-muted)]" />
                <input
                  className="h-12 w-full rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 pr-4 text-sm font-semibold text-[color:var(--ink-body)] outline-none transition placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-blue)]"
                  defaultValue={verification.buEmail || email}
                  id="bu-email"
                  name="buEmail"
                  placeholder="name@bicol-u.edu.ph"
                  required
                  type="email"
                />
              </div>
              <Button
                className="h-12 rounded-xl border-[color:var(--brand-blue)] text-sm font-bold text-[color:var(--brand-blue)]"
                disabled={isSendingOtp || isPending}
                formAction={otpFormAction}
                formNoValidate
                type="submit"
                variant="outline"
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            </div>
            {otpState.message ? (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  otpState.ok
                    ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                    : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
                }`}
                role={otpState.ok ? "status" : "alert"}
              >
                {otpState.message}
              </p>
            ) : null}
          </div>

          {otpState.ok ? (
            <div className="space-y-2">
              <Label htmlFor="otp-code">OTP code</Label>
              <input
                className="h-12 w-full rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm font-semibold tracking-[0.24em] text-[color:var(--ink-body)] outline-none transition placeholder:tracking-normal placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-blue)]"
                id="otp-code"
                inputMode="numeric"
                maxLength={6}
                name="otpCode"
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="student-id">Upload student ID</Label>
            <FileInput
              accept="image/jpeg,image/png,image/webp"
              id="student-id"
              name="studentId"
              required
            />
          </div>

          <Button
            className="h-12 w-full rounded-2xl bg-[color:var(--brand-blue)] !text-white hover:bg-[color:var(--brand-blue-strong)]"
            disabled={isPending}
            size="lg"
            type="submit"
          >
            {isPending ? "Submitting..." : "Submit verification"}
          </Button>

          {state.message ? (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${
                state.ok
                  ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                  : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
              }`}
              role={state.ok ? "status" : "alert"}
            >
              {state.message}
            </p>
          ) : null}
        </form>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-5xl text-center">
      {isDashboardSource ? (
        <a
          className="absolute left-0 top-0 inline-flex -translate-y-16 items-center text-sm font-bold text-foreground transition hover:text-[color:var(--brand-orange)] sm:-translate-x-3 sm:-translate-y-4"
          href="/dashboard/client"
        >
          &larr; Back to {backLabel}
        </a>
      ) : null}

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

      <div className="mt-8 space-y-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-orange)] sm:text-base">
          Open your BRaket talent account
        </p>
        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
          Start offering your skills to real clients
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-8 text-[color:var(--ink-muted)] sm:text-xl">
          Build your talent profile, publish services, and make your work
          discoverable to clients looking for verified BU student talent.
        </p>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-base leading-7 text-[color:var(--ink-body)]">
        Confirm your Bicol University email and student ID before your services
        appear to clients. This keeps BRaket bookings tied to real BU student
        talents.
      </p>

      <div className="mx-auto mt-9 grid max-w-xl gap-4 sm:grid-cols-2">
        <Button
          className="h-14 rounded-2xl bg-[color:var(--brand-blue)] text-base font-bold text-white hover:bg-[color:var(--brand-blue-strong)]"
          onClick={() => router.push(formPath)}
          size="lg"
          type="button"
        >
          Verify Now
          <ArrowRight className="size-5" />
        </Button>
        <Dialog>
          <DialogTrigger
            render={
              <Button
                className="h-14 rounded-2xl border-[color:var(--brand-orange)]/40 bg-white text-base font-bold text-[color:var(--brand-orange)] hover:bg-[color:var(--surface-alt)]"
                variant="outline"
              />
            }
          >
            Maybe Later
          </DialogTrigger>
          <DialogContent className="overflow-hidden border border-[color:var(--line-strong)] bg-white p-0 shadow-[var(--shadow-panel-elevated)] sm:max-w-md">
            <DialogHeader className="items-center gap-3 px-6 pb-2 pt-6 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)]">
                <Mail className="size-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">Just a quick note</DialogTitle>
              <DialogDescription className="text-sm leading-6 text-[color:var(--ink-muted)]">
                You are welcome to continue for now. Your services will simply
                stay private until your BU student verification is complete.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mx-0 mb-0 flex-row items-center justify-center border-t border-[color:var(--line)] bg-[color:var(--surface-alt)] px-6 pb-7 pt-3 sm:justify-center">
              <Button
                className="mx-auto h-11 min-w-32 translate-y-1 cursor-pointer bg-[color:var(--brand-orange)] px-6 text-white hover:bg-[color:var(--brand-orange-strong)]"
                onClick={() => router.push(maybeLaterPath)}
                type="button"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

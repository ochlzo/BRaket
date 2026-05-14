"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TalentBuVerificationIntroProps = {
  step?: string;
};

export function TalentBuVerificationIntro({
  step,
}: TalentBuVerificationIntroProps) {
  const router = useRouter();
  const isFormStep = step === "form";

  if (isFormStep) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-surface-soft)] sm:p-8">
        <button
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)] transition hover:text-foreground"
          onClick={() => router.push("/onboarding/talent/verification")}
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

        <form className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="bu-email">Bicol University email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--ink-muted)]" />
              <Input
                className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10"
                id="bu-email"
                name="email"
                placeholder="you@bicol-u.edu.ph"
                required
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-id">Upload student ID</Label>
            <FileInput
              accept="image/jpeg,image/png,image/webp,application/pdf"
              id="student-id"
              name="studentId"
              required
            />
          </div>

          <Button className="h-12 w-full rounded-2xl" size="lg" type="submit">
            Submit verification
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl text-center">
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
          onClick={() => router.push("/onboarding/talent/verification?step=form")}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Important note</DialogTitle>
              <DialogDescription>
                Your services will not be listed until you are verified as a BU
                student.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => router.push("/onboarding/talent?step=1")}
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

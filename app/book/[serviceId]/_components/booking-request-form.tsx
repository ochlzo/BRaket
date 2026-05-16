"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { BookingActionState } from "@/lib/bookings/types";
import { createBookingRequestAction } from "@/server/bookings/actions";

type BookingRequestFormProps = {
  cancelHref: string;
  serviceId: string;
};

const INITIAL_STATE: BookingActionState = {
  message: "",
  ok: false,
};

export function BookingRequestForm({
  cancelHref,
  serviceId,
}: BookingRequestFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createBookingRequestAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state.ok, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-6">
      <input name="serviceId" type="hidden" value={serviceId} />

      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-foreground"
          htmlFor="project-details"
        >
          Project Details <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <Textarea
          className="min-h-36 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
          id="project-details"
          name="projectDetails"
          placeholder="Describe what you need, the desired outcome, important requirements, and any deadline."
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-foreground"
          htmlFor="booking-budget"
        >
          Your Budget <span className="font-normal text-[color:var(--ink-soft)]">(optional)</span>
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
            PHP
          </span>
          <Input
            className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-14 text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
            id="booking-budget"
            min="1"
            name="budget"
            placeholder="5000"
            type="number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-foreground"
          htmlFor="booking-notes"
        >
          Additional Notes <span className="font-normal text-[color:var(--ink-soft)]">(optional)</span>
        </Label>
        <Textarea
          className="min-h-24 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
          id="booking-notes"
          name="notes"
          placeholder="Communication preferences, revision notes, reference links, or timeline details."
        />
      </div>

      {state.message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            state.ok
              ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
              : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
          }`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
          href={cancelHref}
        >
          Cancel
        </Link>
        <Button
          className="rounded-xl bg-[color:var(--brand-orange)] px-8 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Sending..." : "Send Booking Request"}
        </Button>
      </div>
    </form>
  );
}

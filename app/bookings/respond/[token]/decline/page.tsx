import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import {
  declineBookingByResponseToken,
  getBookingResponseSummary,
} from "@/server/bookings/responses";
import { getCurrentAppUser } from "@/server/users/current-user";

type Props = {
  params: Promise<{ token: string }>;
};

function readReason(formData: FormData) {
  const value = formData.get("reason");

  return typeof value === "string" ? value.trim() : "";
}

export default async function BookingDeclinePage({ params }: Props) {
  const { token } = await params;
  const [booking, currentUser] = await Promise.all([
    getBookingResponseSummary(token),
    getCurrentAppUser(),
  ]);

  if (!booking) {
    notFound();
  }

  const canRespond = currentUser?.id === booking.talentUserId;

  async function declineAction(formData: FormData) {
    "use server";

    const result = await declineBookingByResponseToken(
      token,
      readReason(formData),
    );

    if (result.ok) {
      redirect(`/bookings/respond/${token}/declined`);
    }

    if (result.code === "invalid-reason") {
      redirect(`/bookings/respond/${token}/decline?error=reason`);
    }

    redirect(
      `/bookings/respond/${token}?error=${
        result.code === "not-talent" ? "not-talent" : "answered"
      }`,
    );
  }

  return (
    <PageShell
      activeHref="/browse"
      ctaHref="/browse"
      ctaLabel="Browse Talents"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[color:var(--line-strong)] bg-white p-8 shadow-[var(--shadow-surface-soft)]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--tone-orange-deep)]">
            Decline request
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-normal text-foreground">
            Tell the client why you are declining
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--ink-muted)]">
            This reason will be emailed to {booking.clientName} for{" "}
            <span className="font-semibold text-foreground">
              {booking.serviceTitle}
            </span>
            .
          </p>

          {canRespond ? (
            <form action={declineAction} className="mt-6 space-y-5">
              <Textarea
                className="min-h-36 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                minLength={10}
                name="reason"
                placeholder="Example: I am unavailable on the requested timeline, but I can take similar work next week."
                required
              />
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                  href="/dashboard/talent/bookings"
                >
                  Back to Dashboard
                </Link>
                <Button
                  className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                  type="submit"
                >
                  Send Decline Reason
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 rounded-xl bg-[color:var(--surface-alt)] p-4">
              <p className="text-sm font-semibold text-foreground">
                Sign in as {booking.talentName} to decline this request.
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                The account currently signed in is not the talent assigned to
                this booking.
              </p>
              <Link
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                href={`/bookings/respond/${token}`}
              >
                Back to Request
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

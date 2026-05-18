import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/shared/layout/page-shell";
import { formatBookingBudgetLabel } from "@/lib/bookings/budget-label";
import { appNavigation } from "@/lib/content/navigation";
import { getAuthorizedBookingResponseSummary } from "@/server/bookings/responses";
import { getCurrentAppUser } from "@/server/users/current-user";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function BookingResponsePage({
  params,
}: Props) {
  const { token } = await params;
  const currentUser = await getCurrentAppUser();
  const booking = await getAuthorizedBookingResponseSummary(token, currentUser);

  if (!booking) {
    notFound();
  }

  const isPending = booking.status === "PENDING";
  const clientProfileReturnHref = booking.clientProfileHref
    ? `${booking.clientProfileHref}?returnTo=${encodeURIComponent(
        `/bookings/respond/${token}`,
      )}`
    : null;

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
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_300px]">
          <article className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-surface-soft)]">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
              Booking request
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-normal text-foreground">
              {booking.serviceTitle}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
              Requested by {booking.clientName}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Project details
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
                  {booking.projectDetails}
                </p>
              </div>
              {booking.notes ? (
                <div className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                    Notes
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
                    {booking.notes}
                  </p>
                </div>
              ) : null}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                Client
              </p>
              <h2 className="mt-2 text-lg font-extrabold text-foreground">
                {booking.clientName}
              </h2>
              {clientProfileReturnHref ? (
                <Link
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                  href={clientProfileReturnHref}
                >
                  View Client Profile
                </Link>
              ) : null}
            </div>

            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                Proposed budget
              </p>
              <p className="mt-2 text-xl font-extrabold text-[color:var(--brand-orange)]">
                {formatBookingBudgetLabel(booking.budget)}
              </p>
            </div>

            {isPending ? (
              <div className="grid gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                  href={`/bookings/respond/${token}/accept`}
                >
                  Accept Request
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                  href={`/bookings/respond/${token}/decline`}
                >
                  Decline with Reason
                </Link>
              </div>
            ) : (
              <p className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 text-sm font-semibold text-[color:var(--ink-muted)]">
                This request is already {booking.status.toLowerCase()}.
              </p>
            )}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

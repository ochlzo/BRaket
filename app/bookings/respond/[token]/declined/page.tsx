import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getBookingResponseSummary } from "@/server/bookings/responses";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function BookingDeclinedPage({ params }: Props) {
  const { token } = await params;
  const booking = await getBookingResponseSummary(token);

  if (!booking) {
    notFound();
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
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line-strong)] bg-white p-8 text-center shadow-[var(--shadow-surface-soft)]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--tone-red-deep)]">
            Declined
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-normal text-foreground">
            Booking request declined
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--ink-muted)]">
            The client has been notified by email with your reason for declining{" "}
            <span className="font-semibold text-foreground">
              {booking.serviceTitle}
            </span>
            .
          </p>
          <Link
            className="mt-6 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
            href="/dashboard/talent/bookings"
          >
            View Dashboard
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

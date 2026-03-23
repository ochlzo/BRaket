"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getBookingsByClient, mockCurrentClientProfile } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  pending: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  accepted: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  "in-progress": "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  completed: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  cancelled: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  declined: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

export default function ClientDashboardPage() {
  const profile = mockCurrentClientProfile;
  const bookings = getBookingsByClient(profile.id);

  const activeBookings = bookings.filter((b) => b.status === "in-progress" || b.status === "accepted");
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <DashboardLayout role="client" title={`Welcome back, ${profile.firstName}!`} subtitle="Here's an overview of your projects">
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:w-[70%]">
        {[
          { label: "Active Bookings", value: activeBookings.length, emoji: "🔥", bg: "from-[color:var(--tone-orange-soft)] to-white" },
          { label: "Pending Requests", value: pendingBookings.length, emoji: "⏳", bg: "from-[color:var(--tone-amber-soft)] to-white" },
          { label: "Total Bookings", value: bookings.length, emoji: "📋", bg: "from-[color:var(--tone-sky-soft)] to-white" },
          { label: "Projects Posted", value: profile.projectsPosted, emoji: "📝", bg: "from-[color:var(--tone-green-soft)] to-white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <div>
              <p className="text-2xl font-extrabold leading-none tracking-[-0.03em] text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs font-medium leading-none text-[color:var(--ink-muted)]">{stat.label}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center opacity-80">
              <span className="text-2xl leading-none">{stat.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          🔍 Browse Talent
        </Link>
        <Link
          href="/post-project"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[color:var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
        >
          📝 Post a Project
        </Link>
      </div>

      {/* Active Bookings */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">Your Active Bookings</h2>
          <Link href="/dashboard/client/bookings" className="text-sm font-semibold text-[color:var(--brand-orange)] hover:underline">
            View All →
          </Link>
        </div>

        {activeBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-12 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-3 text-sm font-semibold text-foreground">No active bookings yet</p>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Browse talent and book services to get started
            </p>
            <Link
              href="/browse"
              className="mt-4 inline-flex items-center rounded-xl bg-[color:var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
            >
              Browse Talents
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="group rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      alt={`${booking.talent.firstName} ${booking.talent.lastName}`}
                      className="h-full w-full object-cover"
                      height={96}
                      src={booking.talent.avatarUrl}
                      width={96}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{booking.service.title}</h3>
                        <p className="text-xs text-[color:var(--ink-muted)]">
                          by {booking.talent.firstName} {booking.talent.lastName} · {booking.talent.headline}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusColors[booking.status]}`}>
                        {booking.status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--ink-body)]">
                      {booking.projectDetails}
                    </p>
                    {booking.budget && (
                      <p className="mt-2 text-sm font-semibold text-[color:var(--brand-orange)]">
                        Budget: ₱{booking.budget.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
            Pending Requests ({pendingBookings.length})
          </h2>
          <div className="grid gap-4">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      alt={`${booking.talent.firstName} ${booking.talent.lastName}`}
                      className="h-full w-full object-cover"
                      height={96}
                      src={booking.talent.avatarUrl}
                      width={96}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{booking.service.title}</h3>
                        <p className="text-xs text-[color:var(--ink-muted)]">
                          Sent to {booking.talent.firstName} {booking.talent.lastName}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusColors[booking.status]}`}>
                        Pending
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--ink-body)]">
                      {booking.projectDetails}
                    </p>
                    <button
                      type="button"
                      className="mt-3 text-xs font-semibold text-[color:var(--tone-red-base)] transition hover:underline"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getBookingsByTalent, getServicesByTalent, mockCurrentTalentProfile } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  pending: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  accepted: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  "in-progress": "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  completed: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  cancelled: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  declined: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

export default function TalentDashboardPage() {
  const profile = mockCurrentTalentProfile;
  const bookings = getBookingsByTalent(profile.id);
  const services = getServicesByTalent(profile.id);

  const activeBookings = bookings.filter((b) => b.status === "in-progress" || b.status === "accepted");
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <DashboardLayout
      role="talent"
      title={`Welcome back, ${profile.firstName}!`}
      subtitle="Here's what's happening with your commissions"
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          + New Service
        </Link>
      }
    >
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:w-[70%]">
        {[
          { label: "Active Bookings", value: activeBookings.length, emoji: "🔥", bg: "from-[color:var(--tone-orange-soft)] to-white" },
          { label: "Pending Requests", value: pendingBookings.length, emoji: "⏳", bg: "from-[color:var(--tone-amber-soft)] to-white" },
          { label: "Published Services", value: services.length, emoji: "🛠️", bg: "from-[color:var(--tone-sky-soft)] to-white" },
          { label: "Completed Projects", value: profile.completedProjects, emoji: "✅", bg: "from-[color:var(--tone-green-soft)] to-white" },
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

      {/* Pending Booking Requests */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
          New Booking Requests {pendingBookings.length > 0 && `(${pendingBookings.length})`}
        </h2>

        {pendingBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-12 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-3 text-sm font-semibold text-foreground">No new requests</p>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              New booking requests from clients will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      alt={`${booking.client.firstName} ${booking.client.lastName}`}
                      className="h-full w-full object-cover"
                      height={96}
                      src={booking.client.avatarUrl}
                      width={96}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {booking.client.firstName} {booking.client.lastName}
                          {booking.client.company && (
                            <span className="font-normal text-[color:var(--ink-muted)]"> · {booking.client.company}</span>
                          )}
                        </h3>
                        <p className="text-xs text-[color:var(--ink-muted)]">
                          Requested: {booking.service.title}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusColors.pending}`}>
                        New Request
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--ink-body)]">
                      {booking.projectDetails}
                    </p>
                    {booking.budget && (
                      <p className="mt-1 text-sm font-semibold text-[color:var(--brand-orange)]">
                        Budget: ₱{booking.budget.toLocaleString()}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-[color:var(--tone-green-base)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--tone-green-deep)]"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-[color:var(--line-strong)] bg-white px-4 py-2 text-xs font-bold text-[color:var(--tone-red-base)] transition hover:bg-[color:var(--tone-red-soft)]"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">Active Bookings</h2>
            <Link href="/dashboard/talent/bookings" className="text-sm font-semibold text-[color:var(--brand-orange)] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid gap-4">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      alt={`${booking.client.firstName} ${booking.client.lastName}`}
                      className="h-full w-full object-cover"
                      height={96}
                      src={booking.client.avatarUrl}
                      width={96}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{booking.service.title}</h3>
                        <p className="text-xs text-[color:var(--ink-muted)]">
                          Client: {booking.client.firstName} {booking.client.lastName}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusColors[booking.status]}`}>
                        {booking.status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--ink-body)]">
                      {booking.projectDetails}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-lg bg-[color:var(--brand-blue)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                    >
                      Mark Complete
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

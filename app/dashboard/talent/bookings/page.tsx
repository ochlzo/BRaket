"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getBookingsByTalent, mockCurrentTalentProfile } from "@/lib/mock-data";
import type { BookingStatus, Booking } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  accepted: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  "in-progress": "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  completed: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  cancelled: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  declined: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

type Tab = "all" | "pending" | "active" | "completed";
const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "New Requests" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function TalentBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [bookingsList, setBookingsList] = useState<Booking[]>(getBookingsByTalent(mockCurrentTalentProfile.id));

  const filtered = activeTab === "all"
    ? bookingsList
    : activeTab === "active"
      ? bookingsList.filter((b) => b.status === "in-progress" || b.status === "accepted")
      : activeTab === "pending"
        ? bookingsList.filter((b) => b.status === "pending")
        : bookingsList.filter((b) => b.status === "completed");

  const updateStatus = (id: string, newStatus: BookingStatus) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <DashboardLayout role="talent" title="My Bookings" subtitle="Manage your commission requests">
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.value
                ? "bg-[color:var(--brand-orange)] !text-white shadow-md"
                : "bg-white border border-[color:var(--line-strong)] text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> booking{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-3 text-sm font-semibold text-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    alt={`${booking.client.firstName} ${booking.client.lastName}`}
                    className="h-full w-full object-cover"
                    height={112}
                    src={booking.client.avatarUrl}
                    width={112}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {booking.client.firstName} {booking.client.lastName}
                        {booking.client.company && (
                          <span className="font-normal text-[color:var(--ink-muted)]"> · {booking.client.company}</span>
                        )}
                      </h3>
                      <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">
                        Service: {booking.service.title}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusColors[booking.status]}`}>
                      {booking.status === "pending" ? "New Request" : booking.status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-body)]">
                    {booking.projectDetails}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {booking.budget && (
                      <span className="text-sm font-semibold text-[color:var(--brand-orange)]">
                        Budget: ₱{booking.budget.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-[color:var(--ink-soft)]">
                      {new Date(booking.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Contact Info Reveal upon acceptance */}
                  {["accepted", "in-progress", "completed"].includes(booking.status) && (
                    <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-alt)] p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--ink-muted)]">
                        Client Contact Information
                      </p>
                      <div className="grid gap-2 text-sm text-[color:var(--ink-body)] sm:grid-cols-2">
                        <p>📧 Email: <a href={`mailto:${booking.client.email}`} className="text-[color:var(--brand-blue)] hover:underline">{booking.client.email}</a></p>
                        {booking.client.phone && <p>📞 Phone: {booking.client.phone}</p>}
                        {booking.client.socials?.facebook && <p>🔵 FB: {booking.client.socials.facebook}</p>}
                        {booking.client.socials?.instagram && <p>📸 IG: {booking.client.socials.instagram}</p>}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(booking.id, "accepted")}
                          className="rounded-lg bg-[color:var(--tone-green-base)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--tone-green-deep)]"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(booking.id, "declined")}
                          className="rounded-lg border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-4 py-2 text-xs font-bold text-[color:var(--tone-red-base)] transition hover:bg-[color:var(--tone-red-base)]/20"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {(booking.status === "in-progress" || booking.status === "accepted") && (
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="rounded-lg bg-[color:var(--brand-blue)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { getBookingsByClient, mockCurrentClientProfile } from "@/lib/mock-data";
import type { BookingStatus, Booking } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  accepted: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  "in-progress": "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  completed: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  cancelled: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  declined: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

type Tab = "all" | BookingStatus;
const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function ClientBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [bookingsList, setBookingsList] = useState<Booking[]>(getBookingsByClient(mockCurrentClientProfile.id));

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const filtered = activeTab === "all"
    ? bookingsList
    : bookingsList.filter((b) => b.status === activeTab);

  const updateStatus = (id: string, newStatus: BookingStatus) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Review submitted for booking ${reviewBookingId}\nRating: ${rating}\nComment: ${comment}`);
    setReviewModalOpen(false);
    setReviewBookingId(null);
    setRating(5);
    setComment("");
  };

  return (
    <DashboardLayout role="client" title="My Bookings" subtitle="Track all your project bookings">
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

      {/* Results count */}
      <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> booking{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-3 text-sm font-semibold text-foreground">No bookings found</p>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            {activeTab === "all" ? "You haven't made any bookings yet" : `No ${activeTab} bookings`}
          </p>
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
                    alt={`${booking.talent.firstName} ${booking.talent.lastName}`}
                    className="h-full w-full object-cover"
                    height={112}
                    src={booking.talent.avatarUrl}
                    width={112}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{booking.service.title}</h3>
                      <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">
                        by {booking.talent.firstName} {booking.talent.lastName} · {booking.talent.headline}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusColors[booking.status]}`}>
                      {booking.status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-body)]">
                    {booking.projectDetails}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {booking.budget && (
                      <span className="text-sm font-semibold text-[color:var(--brand-orange)]">
                        ₱{booking.budget.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-[color:var(--ink-soft)]">
                      Requested: {new Date(booking.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Contact Info Reveal */}
                  {["accepted", "in-progress", "completed"].includes(booking.status) && (
                    <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-alt)] p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--ink-muted)]">
                        Provider Contact Information
                      </p>
                      <div className="grid gap-2 text-sm text-[color:var(--ink-body)] sm:grid-cols-2">
                        <p>📧 Email: <a href={`mailto:${booking.talent.email}`} className="text-[color:var(--brand-blue)] hover:underline">{booking.talent.email}</a></p>
                        {booking.talent.phone && <p>📞 Phone: {booking.talent.phone}</p>}
                        {booking.talent.socials?.facebook && <p>🔵 FB: {booking.talent.socials.facebook}</p>}
                        {booking.talent.socials?.instagram && <p>📸 IG: {booking.talent.socials.instagram}</p>}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        className="rounded-lg border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-4 py-2 text-xs font-bold text-[color:var(--tone-red-deep)] transition hover:bg-[color:var(--tone-red-base)]/20"
                      >
                        Cancel Request
                      </button>
                    )}
                    {(booking.status === "in-progress" || booking.status === "accepted") && (
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="rounded-lg bg-[color:var(--tone-green-base)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--tone-green-deep)]"
                      >
                        Mark Complete
                      </button>
                    )}
                    {booking.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewBookingId(booking.id);
                          setReviewModalOpen(true);
                        }}
                        className="rounded-lg border border-[color:var(--brand-blue)] bg-white px-4 py-2 text-xs font-bold text-[color:var(--brand-blue)] transition hover:bg-[color:var(--surface-alt)]"
                      >
                        ★ Leave a Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-xl font-bold text-foreground">Write a Review</h2>
            <p className="mb-6 text-sm text-[color:var(--ink-muted)]">
              Share your experience to help others find great talent.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-foreground">Rating</label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={star <= rating ? "text-[color:var(--brand-orange)]" : "text-[color:var(--line)]"}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-foreground">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was it like working with them?"
                  className="h-24 w-full resize-none rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-3 text-sm outline-none transition placeholder:text-[color:var(--ink-soft)] focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[color:var(--brand-orange)] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#FF9252] hover:shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

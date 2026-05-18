import assert from "node:assert/strict";
import test from "node:test";

const { buildBookingServiceSummary } = (await import(
  new URL("./service-summary.ts", import.meta.url).href
)) as typeof import("./service-summary");

const decimal = (value: number) => ({ toString: () => String(value) });
const createdAt = new Date("2026-05-16T08:00:00.000Z");

test("builds service summary media and service-scoped talent reviews", () => {
  const summary = buildBookingServiceSummary({
    description: "Build a landing page.",
    maxPrice: decimal(2000),
    minPrice: decimal(1000),
    serviceId: "service-1",
    title: "Landing Page Design",
    ServiceCategories: [{ Category: { name: "Graphic Design" } }],
    ServiceMedia: [
      { mediaUrl: "https://example.com/one.webp", serviceDetailId: "media-1" },
    ],
    TalentProfile: {
      headline: "Designer",
      User: {
        avatarUrl: "https://example.com/avatar.webp",
        firstName: "Dana",
        initials: "DP",
        is_verified: true,
        lastName: "Pispis",
        username: "dana",
      },
    },
    Bookings: [
      {
        bookingId: "booking-1",
        status: "COMPLETED",
        Reviews: [
          {
            comment: "Excellent work and communication.",
            createdAt,
            rating: 5,
            reviewId: "review-1",
            target: "TALENT",
            Reviewer: {
              firstName: "Alex",
              lastName: "Client",
              username: "alex",
            },
          },
          {
            comment: "Client was responsive.",
            createdAt,
            rating: 4,
            reviewId: "review-2",
            target: "CLIENT",
            Reviewer: {
              firstName: "Dana",
              lastName: "Pispis",
              username: "dana",
            },
          },
        ],
      },
      {
        bookingId: "booking-2",
        status: "PENDING",
        Reviews: [
          {
            comment: "Should not show before completion.",
            createdAt,
            rating: 1,
            reviewId: "review-3",
            target: "TALENT",
            Reviewer: {
              firstName: "Pending",
              lastName: "Client",
              username: "pending",
            },
          },
        ],
      },
    ],
  });

  assert.deepEqual(summary.media, [
    { id: "media-1", url: "https://example.com/one.webp" },
  ]);
  assert.equal(summary.reviews.length, 1);
  assert.equal(summary.reviews[0]?.id, "review-1");
  assert.equal(summary.averageRating, 5);
  assert.equal(summary.reputationLabel, "Excellent talent");
});

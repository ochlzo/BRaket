import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type ReviewTarget } from "@prisma/client";
import { expect, type Page } from "@playwright/test";

loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for booking review tests.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

export type BookingReviewContext = {
  bookingId: string;
  clientUserId: string;
  clientUsername: string;
  serviceId: string;
  talentUserId: string;
  talentUsername: string;
};

export type BookingReviewRow = {
  comment: string;
  rating: number;
  reviewerUserId: string;
  target: ReviewTarget;
};

export async function getBookingReviewContext(
  bookingId: string,
): Promise<BookingReviewContext> {
  const booking = await prisma.booking.findUnique({
    select: {
      bookingId: true,
      clientUserId: true,
      serviceId: true,
      talentUserId: true,
      Client: { select: { username: true } },
      Talent: { select: { username: true } },
    },
    where: { bookingId },
  });

  if (!booking || !booking.Client.username || !booking.Talent.username) {
    throw new Error(`Unable to read booking context for ${bookingId}.`);
  }

  return {
    bookingId: booking.bookingId,
    clientUserId: booking.clientUserId,
    clientUsername: booking.Client.username,
    serviceId: booking.serviceId,
    talentUserId: booking.talentUserId,
    talentUsername: booking.Talent.username,
  };
}

export async function readBookingReviews(bookingId: string) {
  return prisma.review.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      comment: true,
      rating: true,
      reviewerUserId: true,
      target: true,
    },
    where: { bookingId },
  });
}

export async function waitForBookingReviews(
  bookingId: string,
  expected: BookingReviewRow[],
) {
  await expect.poll(() => readBookingReviews(bookingId), { timeout: 60000 }).toEqual(
    expected,
  );
}

export async function submitBookingReview(
  page: Page,
  bookingId: string,
  comment: string,
  rating: string,
) {
  await fillBookingReviewForm(page, bookingId, comment, rating);
  await page.locator(`article[data-booking-id="${bookingId}"]`).getByRole("button", { name: /submit review/i }).click();
}

export async function fillBookingReviewForm(
  page: Page,
  bookingId: string,
  comment: string,
  rating: string,
) {
  const card = page.locator(`article[data-booking-id="${bookingId}"]`);

  await card.locator('select[name="rating"]').selectOption(rating);
  await card.locator('textarea[name="comment"]').fill(comment);
}

export async function expectBookingCardComment(
  page: Page,
  bookingId: string,
  comment: string,
) {
  await expect(page.locator(`article[data-booking-id="${bookingId}"]`)).toContainText(
    comment,
    { timeout: 15000 },
  );
}

export async function disconnectBookingReviewDb() {
  await prisma.$disconnect();
}

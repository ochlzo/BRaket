import fs from "node:fs";
import path from "node:path";

import { expect, type BrowserContext, type Page } from "@playwright/test";

export type BookingStatusValue =
  | "ACCEPTED"
  | "CANCELLED"
  | "COMPLETED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "PENDING"
  | "WORK_SUBMITTED";

export type BookingRow = {
  bookingId: string;
  projectDetails: string;
  status: BookingStatusValue;
};

const STATUS_LABELS: Record<BookingStatusValue, string> = {
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
  WORK_SUBMITTED: "Work submitted",
};

const BREVO_WEBHOOK_LOG_FILE = path.join(
  process.cwd(),
  "test-results",
  "brevo-webhook-events.log",
);

export function clearWebhookLog(webhookLogFile?: string) {
  const logFile = webhookLogFile || BREVO_WEBHOOK_LOG_FILE;
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.writeFileSync(logFile, "", "utf8");
}

function readWebhookEvents() {
  if (!fs.existsSync(BREVO_WEBHOOK_LOG_FILE)) {
    return [] as Array<{ email?: string; event: string; tags: string[] }>;
  }

  return fs
    .readFileSync(BREVO_WEBHOOK_LOG_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { email?: string; event: string; tags: string[] });
}

export async function signIn(
  context: BrowserContext,
  email: string,
  password: string,
) {
  const page = await context.newPage();

  await page.goto("/login");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/services\/?$/, { timeout: 15000 });

  return page;
}

export async function expectBookingCardStatus(page: Page, booking: BookingRow) {
  const card = page.locator(`article[data-booking-id="${booking.bookingId}"]`);
  await expect(card).toContainText(STATUS_LABELS[booking.status], {
    timeout: 60000,
  });
}

export async function clickBookingAction(
  page: Page,
  booking: BookingRow,
  label: string,
) {
  const card = page.locator(`article[data-booking-id="${booking.bookingId}"]`);
  await card.getByRole("button", { name: label }).click();
}

export async function readBookingsFromPage(page: Page) {
  const cards = page.locator("article[data-booking-id]");
  const total = await cards.count();
  const bookings: BookingRow[] = [];

  for (let index = 0; index < total; index++) {
    const card = cards.nth(index);
    const projectDetails = (await card.locator("p").nth(1).textContent())?.trim();
    const bookingId = await card.getAttribute("data-booking-id");
    const statusText = (await card.locator("span").first().textContent())?.trim();

    if (!projectDetails || !bookingId || !statusText) {
      throw new Error(`Unable to read booking card ${index + 1}.`);
    }

    const statusEntry = (Object.entries(STATUS_LABELS).find(([, label]) => label === statusText) ?? [
      null,
      null,
    ])[0] as BookingStatusValue | null;

    if (!statusEntry) {
      throw new Error(`Unable to map booking status label "${statusText}".`);
    }

    bookings.push({
      bookingId,
      projectDetails,
      status: statusEntry,
    });
  }

  return bookings;
}

export async function waitForDelivered(
  tag: string,
  recipientEmail: string,
) {
  await expect
    .poll(() => readWebhookEvents(), { timeout: 60000 })
    .toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: recipientEmail,
          event: "delivered",
          tags: expect.arrayContaining([tag]),
        }),
      ]),
    );
}

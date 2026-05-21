import { expect, test, type BrowserContext, type Page, type TestInfo } from "@playwright/test";
import path from "node:path";

import {
  disconnectBookingReviewDb,
  expectBookingCardComment,
  fillBookingReviewForm,
  getBookingReviewContext,
  waitForBookingReviews,
} from "./booking-review-helpers";
import { captureBookingStatusScreenshot } from "./booking-status-screenshots";
import {
  clearWebhookLog,
  clickBookingAction,
  expectBookingCardStatus,
  readBookingsFromPage,
  signIn,
  waitForDelivered,
  type BookingRow,
} from "./booking-workflow-helpers";

function getWebhookLogFile() {
  return path.join(process.cwd(), "test-results", "brevo-webhook-events.log");
}

test.setTimeout(180000);
test.describe.configure({ timeout: 180000 });

const CLIENT_EMAIL = "cholocandelaria123@gmail.com";
const TALENT_EMAIL = "jbbc2023-4132-17458@bicol-u.edu.ph";
const PASSWORD = "Password123!";
const CLIENT_REVIEW_COMMENT = "Client review from the completed booking flow";
const TALENT_REVIEW_COMMENT = "Talent review from the completed booking flow";

test.describe.serial("booking status workflow", () => {
  let clientContext: BrowserContext;
  let talentContext: BrowserContext;
  let clientPage: Page;
  let talentPage: Page;
  let cancelledBooking: BookingRow;
  let declinedBooking: BookingRow;
  let acceptedBooking: BookingRow;

  test.beforeAll(async ({ browser }) => {
    clientContext = await browser.newContext();
    clientPage = await signIn(clientContext, CLIENT_EMAIL, PASSWORD);
    await clientPage.goto("/dashboard/client/bookings");
    await expect(clientPage).toHaveURL(/\/dashboard\/client\/bookings\/?$/);
    await clientPage.reload();
    const pendingBookings = (await readBookingsFromPage(clientPage)).filter(
      (booking) => booking.status === "PENDING",
    );

    if (pendingBookings.length < 3) {
      throw new Error(`Expected at least 3 pending bookings, found ${pendingBookings.length}.`);
    }

    [cancelledBooking, declinedBooking, acceptedBooking] = pendingBookings.slice(0, 3);

    talentContext = await browser.newContext();
    talentPage = await signIn(talentContext, TALENT_EMAIL, PASSWORD);
    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
  });

  test.afterAll(async () => {
    await disconnectBookingReviewDb();
    await talentContext?.close();
    await clientContext?.close();
  });

  test("A: client cancels the latest booking", async ({}, testInfo: TestInfo) => {
    const webhookLogFile = getWebhookLogFile();
    clearWebhookLog(webhookLogFile);

    await clientPage.goto("/dashboard/client/bookings");
    await clickBookingAction(clientPage, cancelledBooking, "Cancel");
    cancelledBooking.status = "CANCELLED";
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-cancels",
      "after-action",
    );

    await waitForDelivered(
      `booking-cancelled:${cancelledBooking.bookingId}`,
      TALENT_EMAIL,
    );

    await clientPage.reload();
    await expectBookingCardStatus(clientPage, cancelledBooking);
    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, cancelledBooking);
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-ui-cancelled",
      "after-refresh",
    );
  });

  test("B: talent declines the next latest booking", async ({}, testInfo: TestInfo) => {
    const webhookLogFile = getWebhookLogFile();
    clearWebhookLog(webhookLogFile);

    await talentPage.goto("/dashboard/talent/bookings");
    await clickBookingAction(talentPage, declinedBooking, "Decline");
    declinedBooking.status = "DECLINED";
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-declines",
      "after-action",
    );

    await waitForDelivered(
      `booking-response:${declinedBooking.bookingId}:DECLINED`,
      CLIENT_EMAIL,
    );

    await clientPage.goto("/dashboard/client/bookings");
    await clientPage.reload();
    await expectBookingCardStatus(clientPage, declinedBooking);
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, declinedBooking);
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-ui-declined",
      "after-refresh",
    );
  });

  test("C: talent accepts the next latest booking and completes it", async ({}, testInfo: TestInfo) => {
    const webhookLogFile = getWebhookLogFile();
    clearWebhookLog(webhookLogFile);

    await talentPage.goto("/dashboard/talent/bookings");
    await clickBookingAction(talentPage, acceptedBooking, "Accept");
    acceptedBooking.status = "ACCEPTED";
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-accepts",
      "after-action",
    );

    await waitForDelivered(
      `booking-response:${acceptedBooking.bookingId}:ACCEPTED`,
      CLIENT_EMAIL,
    );

    await clientPage.goto("/dashboard/client/bookings");
    await clientPage.reload();
    await expectBookingCardStatus(clientPage, acceptedBooking);
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, acceptedBooking);
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-ui-accepted",
      "after-refresh",
    );

    clearWebhookLog(webhookLogFile);
    await clientPage.goto("/dashboard/client/bookings");
    await clickBookingAction(clientPage, acceptedBooking, "Initiate work");
    acceptedBooking.status = "IN_PROGRESS";
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-initiates-work",
      "after-action",
    );

    await waitForDelivered(
      `booking-work-initiated:${acceptedBooking.bookingId}`,
      TALENT_EMAIL,
    );

    await clientPage.reload();
    await expectBookingCardStatus(clientPage, acceptedBooking);
    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, acceptedBooking);
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-ui-in-progress",
      "after-refresh",
    );

    clearWebhookLog(webhookLogFile);
    await talentPage.goto("/dashboard/talent/bookings");
    await clickBookingAction(talentPage, acceptedBooking, "Submit work");
    acceptedBooking.status = "WORK_SUBMITTED";
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-submits-work",
      "after-action",
    );

    await waitForDelivered(
      `booking-work-submitted:${acceptedBooking.bookingId}`,
      CLIENT_EMAIL,
    );

    await clientPage.goto("/dashboard/client/bookings");
    await clientPage.reload();
    await expectBookingCardStatus(clientPage, acceptedBooking);
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, acceptedBooking);
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-ui-work-submitted",
      "after-refresh",
    );

    clearWebhookLog(webhookLogFile);
    await clientPage.goto("/dashboard/client/bookings");
    await clickBookingAction(clientPage, acceptedBooking, "Approve & complete");
    acceptedBooking.status = "COMPLETED";
    await captureBookingStatusScreenshot(
      clientPage,
      testInfo,
      "client-approves-complete",
      "after-action",
    );

    await waitForDelivered(
      `booking-work-completed:${acceptedBooking.bookingId}`,
      TALENT_EMAIL,
    );

    await clientPage.reload();
    await expectBookingCardStatus(clientPage, acceptedBooking);
    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
    await expectBookingCardStatus(talentPage, acceptedBooking);
    await captureBookingStatusScreenshot(
      talentPage,
      testInfo,
      "talent-ui-completed",
      "after-refresh",
    );
  });

  test("D: client and talent leave reviews on the completed booking", async ({}, testInfo: TestInfo) => {
    const webhookLogFile = getWebhookLogFile();
    const booking = await getBookingReviewContext(acceptedBooking.bookingId);

    await clientPage.goto("/dashboard/client/bookings");
    await fillBookingReviewForm(clientPage, booking.bookingId, CLIENT_REVIEW_COMMENT, "5");
    await captureBookingStatusScreenshot(clientPage, testInfo, "client-review", "before-submit");
    await clientPage
      .locator(`article[data-booking-id="${booking.bookingId}"]`)
      .getByRole("button", { name: /submit review/i })
      .click();
    await expectBookingCardComment(
      clientPage,
      booking.bookingId,
      CLIENT_REVIEW_COMMENT,
    );
    await waitForBookingReviews(booking.bookingId, [
      {
        comment: CLIENT_REVIEW_COMMENT,
        rating: 5,
        reviewerUserId: booking.clientUserId,
        target: "TALENT",
      },
    ]);

    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
    await expectBookingCardComment(
      talentPage,
      booking.bookingId,
      CLIENT_REVIEW_COMMENT,
    );
    await talentPage.goto(`/talent/${booking.talentUsername}`);
    await expect(
      talentPage
        .locator("#talent-reviews article")
        .filter({ hasText: CLIENT_REVIEW_COMMENT })
        .first(),
    ).toBeVisible();
    await clientPage.goto(`/book/${booking.serviceId}`);
    await expect(
      clientPage
        .locator("#service-reviews article")
        .filter({ hasText: CLIENT_REVIEW_COMMENT })
        .first(),
    ).toBeVisible();

    await talentPage.goto("/dashboard/talent/bookings");
    await fillBookingReviewForm(talentPage, booking.bookingId, TALENT_REVIEW_COMMENT, "4");
    await captureBookingStatusScreenshot(talentPage, testInfo, "talent-review", "before-submit");
    await talentPage
      .locator(`article[data-booking-id="${booking.bookingId}"]`)
      .getByRole("button", { name: /submit review/i })
      .click();
    await expectBookingCardComment(
      talentPage,
      booking.bookingId,
      TALENT_REVIEW_COMMENT,
    );
    await waitForBookingReviews(booking.bookingId, [
      {
        comment: CLIENT_REVIEW_COMMENT,
        rating: 5,
        reviewerUserId: booking.clientUserId,
        target: "TALENT",
      },
      {
        comment: TALENT_REVIEW_COMMENT,
        rating: 4,
        reviewerUserId: booking.talentUserId,
        target: "CLIENT",
      },
    ]);

    await clientPage.goto("/dashboard/client/bookings");
    await clientPage.reload();
    await expectBookingCardComment(
      clientPage,
      booking.bookingId,
      CLIENT_REVIEW_COMMENT,
    );
    await expectBookingCardComment(
      clientPage,
      booking.bookingId,
      TALENT_REVIEW_COMMENT,
    );
    await talentPage.goto("/dashboard/talent/bookings");
    await talentPage.reload();
    await expectBookingCardComment(
      talentPage,
      booking.bookingId,
      CLIENT_REVIEW_COMMENT,
    );
    await expectBookingCardComment(
      talentPage,
      booking.bookingId,
      TALENT_REVIEW_COMMENT,
    );
    await clientPage.goto(`/client/${booking.clientUsername}`);
    await expect(
      clientPage
        .locator("#client-reviews article")
        .filter({ hasText: TALENT_REVIEW_COMMENT })
        .first(),
    ).toBeVisible();

    await clientPage.reload();
    await talentPage.reload();
    await captureBookingStatusScreenshot(clientPage, testInfo, "client-bookings", "after-refresh");
    await captureBookingStatusScreenshot(talentPage, testInfo, "talent-bookings", "after-refresh");
    await clientPage.goto(`/client/${booking.clientUsername}`);
    await captureBookingStatusScreenshot(clientPage, testInfo, "public-client-profile", "after-refresh");
    await talentPage.goto(`/talent/${booking.talentUsername}`);
    await captureBookingStatusScreenshot(talentPage, testInfo, "public-talent-profile", "after-refresh");
    await clientPage.goto(`/book/${booking.serviceId}`);
    await captureBookingStatusScreenshot(clientPage, testInfo, "booking-page", "after-refresh");
  });
});

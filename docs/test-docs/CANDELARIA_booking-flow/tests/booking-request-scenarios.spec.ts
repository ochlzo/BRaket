import fs from "node:fs";
import path from "node:path";

import {
  expect,
  test,
  type BrowserContext,
  type Page,
  type TestInfo,
} from "@playwright/test";

import { captureTestScreenshot } from "./test-screenshot";

const BOOKING_URL = "/book/eca07e1c-493e-4cea-a80e-53def2bf3241";
const LOGIN_URL = "/login";
const CLIENT_EMAIL = "cholocandelaria123@gmail.com";
const TALENT_EMAIL = "jbbc2023-4132-17458@bicol-u.edu.ph";
const PASSWORD = "Password123!";
const BREVO_WEBHOOK_LOG_FILE = path.join(
  process.cwd(),
  "test-results",
  "brevo-webhook-events.log",
);
const BOOKING_EMAIL_LOG_FILE = path.join(
  process.cwd(),
  "test-results",
  "booking-email-events.log",
);

type BookingScenario = {
  assertNoEmailAttempt?: boolean;
  budget?: string;
  label: string;
  notes?: string;
  projectDetails?: string;
  shouldPass: boolean;
};

type BookingEmailEvent = {
  email?: string;
  event: string;
  messageId?: string;
  tags: string[];
};

type BookingEmailAttemptEvent = {
  kind: string;
  stage: string;
};

function getWebhookLogFile() {
  return BREVO_WEBHOOK_LOG_FILE;
}

function getBookingEmailLogFile() {
  return BOOKING_EMAIL_LOG_FILE;
}

function clearWebhookLog(webhookLogFile: string) {
  fs.mkdirSync(path.dirname(webhookLogFile), { recursive: true });
  fs.writeFileSync(webhookLogFile, "", "utf8");
}

function clearBookingEmailLog(emailLogFile: string) {
  fs.mkdirSync(path.dirname(emailLogFile), { recursive: true });
  fs.writeFileSync(emailLogFile, "", "utf8");
}

function readWebhookEvents(webhookLogFile: string) {
  if (!fs.existsSync(webhookLogFile)) {
    return [] as BookingEmailEvent[];
  }

  return fs
    .readFileSync(webhookLogFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as BookingEmailEvent);
}

function readBookingEmailAttempts(emailLogFile: string) {
  if (!fs.existsSync(emailLogFile)) {
    return [] as BookingEmailAttemptEvent[];
  }

  return fs
    .readFileSync(emailLogFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as BookingEmailAttemptEvent)
    .filter(
      (event) =>
        event.kind === "talent-booking-request" && event.stage === "attempt",
    );
}

async function signIn(
  context: BrowserContext,
  email: string,
  password: string,
) {
  const page = await context.newPage();

  await page.goto(LOGIN_URL);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/services\/?$/, { timeout: 15000 });

  return page;
}

async function submitBooking(
  page: Page,
  scenario: BookingScenario,
  testInfo: TestInfo,
) {
  const webhookLogFile = getWebhookLogFile();
  clearWebhookLog(webhookLogFile);
  const bookingEmailLogFile = getBookingEmailLogFile();

  if (scenario.assertNoEmailAttempt) {
    clearBookingEmailLog(bookingEmailLogFile);
  }

  await page.goto(BOOKING_URL);

  await page.getByLabel(/project details/i).fill(scenario.projectDetails ?? "");
  await page.getByLabel(/your budget/i).fill(scenario.budget ?? "");
  await page.getByLabel(/additional notes/i).fill(scenario.notes ?? "");

  await captureTestScreenshot(page, testInfo, scenario.label, "before-submit");
  await page.getByRole("button", { name: /send booking request/i }).click();

  if (scenario.shouldPass) {
    await expect(page).toHaveURL(/\/dashboard\/client\/bookings\?created=/, {
      timeout: 15000,
    });
    const createdBookingId = new URL(page.url()).searchParams.get("created");

    expect(createdBookingId).toBeTruthy();

    await expect(
      page.locator(`article[data-booking-id="${createdBookingId}"]`),
    ).toBeVisible();

    await captureTestScreenshot(page, testInfo, scenario.label, "after-submit");

    await expect
      .poll(() => readWebhookEvents(webhookLogFile), { timeout: 60000 })
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            event: "delivered",
            tags: expect.arrayContaining([
              `booking-request:${createdBookingId}`,
            ]),
          }),
        ]),
      );
    return;
  }

  await expect(page).toHaveURL(new RegExp(`${BOOKING_URL}$`));
  await expect(page.locator('p[role="alert"]')).toHaveText(
    "Project details are required.",
  );
  await captureTestScreenshot(page, testInfo, scenario.label, "error-visible");

  if (scenario.assertNoEmailAttempt) {
    expect(readBookingEmailAttempts(bookingEmailLogFile)).toEqual([]);
    return;
  }

  await expect.poll(() => readWebhookEvents(webhookLogFile)).toEqual([]);
}

test.describe.serial("booking request scenarios", () => {
  let clientContext: BrowserContext;
  let talentContext: BrowserContext;
  let clientPage: Page;

  test.beforeAll(async ({ browser }) => {
    clientContext = await browser.newContext();
    clientPage = await signIn(clientContext, CLIENT_EMAIL, PASSWORD);

    talentContext = await browser.newContext();
    await signIn(talentContext, TALENT_EMAIL, PASSWORD);
  });

  test.afterAll(async () => {
    await talentContext?.close();
    await clientContext?.close();
  });

  test("A: project details, budget, and notes submit successfully", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      budget: "1500",
      label: "A",
      notes: "Scenario A notes",
      projectDetails: "Scenario A project details",
      shouldPass: true,
    }, testInfo);
  });

  test("B: budget left empty still submits successfully", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      label: "B",
      notes: "Scenario B notes",
      projectDetails: "Scenario B project details",
      shouldPass: true,
    }, testInfo);
  });

  test("C: notes left empty still submits successfully", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      budget: "1800",
      label: "C",
      projectDetails: "Scenario C project details",
      shouldPass: true,
    }, testInfo);
  });

  test("D: budget and notes left empty still submits successfully", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      label: "D",
      projectDetails: "Scenario D project details",
      shouldPass: true,
    }, testInfo);
  });

  test("E: empty project details should not submit", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      assertNoEmailAttempt: true,
      budget: "1900",
      label: "E",
      notes: "Scenario E notes",
      shouldPass: false,
    }, testInfo);
  });

  test("F: no fields filled should not submit", async ({}, testInfo) => {
    await submitBooking(clientPage, {
      label: "F",
      shouldPass: false,
    }, testInfo);
  });
});

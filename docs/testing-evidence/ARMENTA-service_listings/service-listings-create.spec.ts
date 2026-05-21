import { expect, test } from "@playwright/test";

import {
  CATEGORY_NAME,
  attachScreenshot,
  createTalentAccount,
  expectServiceInDb,
  loginAs,
  resetTestAccount,
  type TestAccount,
} from "./service-listings.fixture";

let talent: TestAccount;

test.beforeAll(async () => {
  talent = await createTalentAccount("create");
});

test.afterAll(async () => {
  await resetTestAccount(talent.email, talent.username);
});

test("creates a service listing and verifies UI plus database state", async ({
  page,
}, testInfo) => {
  const title = `Armenta QA Poster Package ${Date.now()}`;

  await loginAs(page, talent.email);
  await expect(page).toHaveURL(/\/dashboard\/talent\/services$/);
  await page.getByRole("link", { name: "Create New Service" }).click();

  await page.getByLabel("Service Title").fill(title);
  await page
    .getByLabel("Description")
    .fill("Automated create test listing for poster design deliverables.");
  await page.getByLabel("Categories").fill("Graphic");
  await page.getByRole("option", { name: CATEGORY_NAME }).click();
  await page.getByLabel("Minimum price").fill("2500");
  await page.getByLabel("Maximum price").fill("6800");
  await page.getByText("Select pricing basis").click();
  await page.getByRole("option", { name: "Per project" }).click();
  await attachScreenshot(testInfo, page, "create-form-ready");

  await page.getByRole("button", { name: "Create service" }).click();

  await expect(page).toHaveURL(/\/dashboard\/talent\/services$/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(
    page.getByText(new RegExp("\\u20b12,500 - \\u20b16,800")),
  ).toBeVisible();
  await expectServiceInDb(title);
  await attachScreenshot(testInfo, page, "created-service-dashboard");
});

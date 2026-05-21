import { expect, test } from "@playwright/test";

import {
  CATEGORY_NAME,
  attachScreenshot,
  createClientAccount,
  createTalentAccount,
  expectNoServiceInDb,
  loginAs,
  resetTestAccount,
  type TestAccount,
} from "./service-listings.fixture";

let client: TestAccount;
let talent: TestAccount;

test.beforeAll(async () => {
  talent = await createTalentAccount("validation");
  client = await createClientAccount("security");
});

test.afterAll(async () => {
  await resetTestAccount(talent.email, talent.username);
  await resetTestAccount(client.email, client.username);
});

test("blocks invalid service data before creating a database row", async ({
  page,
}, testInfo) => {
  const invalidTitle = `Armenta Invalid Service ${Date.now()}`;

  await loginAs(page, talent.email);
  await page.getByRole("link", { name: "Create New Service" }).click();
  await page.getByLabel("Service Title").fill(invalidTitle);
  await page.getByLabel("Description").fill("Invalid price range coverage.");
  await page.getByLabel("Categories").fill("Graphic");
  await page.getByRole("option", { name: CATEGORY_NAME }).click();
  await page.getByLabel("Minimum price").fill("9000");
  await page.getByLabel("Maximum price").fill("1000");
  await page.getByText("Select pricing basis").click();
  await page.getByRole("option", { name: "Per project" }).click();

  await expect(
    page.getByText("Min price cannot be greater than max price."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create service" }).click();
  await expect(page).toHaveURL(/\/dashboard\/talent\/services\/new$/);
  await expectNoServiceInDb(invalidTitle);
  await attachScreenshot(testInfo, page, "invalid-price-blocked");
});

test("redirects unauthenticated users away from talent service management", async ({
  page,
}, testInfo) => {
  await page.goto("/dashboard/talent/services");

  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard%2Ftalent%2Fservices$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await attachScreenshot(testInfo, page, "unauthenticated-redirect");
});

test("prevents a client account from accessing talent service listings", async ({
  page,
}, testInfo) => {
  await loginAs(page, client.email);

  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { name: "My Services" })).toBeHidden();
  await page.goto("/dashboard/talent/services");
  await expect(page).not.toHaveURL(/\/dashboard\/talent\/services$/);
  await attachScreenshot(testInfo, page, "client-role-blocked");
});

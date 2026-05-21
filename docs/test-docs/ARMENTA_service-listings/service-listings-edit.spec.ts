import { expect, test } from "@playwright/test";

import {
  attachScreenshot,
  createDbService,
  createTalentAccount,
  expectServiceInDb,
  loginAs,
  resetTestAccount,
  type TestAccount,
  type TestService,
} from "./service-listings.fixture";

let service: TestService;
let talent: TestAccount;

test.beforeAll(async () => {
  talent = await createTalentAccount("edit");
  service = await createDbService(talent, "edit");
});

test.afterAll(async () => {
  await resetTestAccount(talent.email, talent.username);
});

test("edits a service listing and verifies persisted changes", async ({
  page,
}, testInfo) => {
  const updatedTitle = `Armenta QA Edited Service ${Date.now()}`;

  await loginAs(page, talent.email);
  await expect(page.getByRole("heading", { name: service.title })).toBeVisible();
  await page.getByRole("button", { name: `Edit ${service.title}` }).click();

  const editDialog = page.getByRole("dialog", { name: "Edit service" });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Service Title").fill(updatedTitle);
  await editDialog.getByLabel("Maximum price").fill("7200");
  await attachScreenshot(testInfo, page, "edit-dialog-updated-values");
  await editDialog.getByRole("button", { name: "Save changes" }).click();

  await expect(editDialog).toBeHidden();
  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
  await expect(page.getByRole("heading", { name: service.title })).toBeHidden();
  await expect(
    page.getByText(new RegExp("\\u20b12,500 - \\u20b17,200")),
  ).toBeVisible();

  const saved = await expectServiceInDb(updatedTitle);
  expect(saved?.serviceId).toBe(service.serviceId);
  expect(saved?.maxPrice.toString()).toBe("7200");
  await attachScreenshot(testInfo, page, "edited-service-dashboard");
});

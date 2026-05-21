import { expect, test } from "@playwright/test";

import {
  attachScreenshot,
  createDbService,
  createTalentAccount,
  expectNoServiceInDb,
  loginAs,
  resetTestAccount,
  type TestAccount,
  type TestService,
} from "./service-listings.fixture";

let service: TestService;
let talent: TestAccount;

test.beforeAll(async () => {
  talent = await createTalentAccount("delete");
  service = await createDbService(talent, "delete");
});

test.afterAll(async () => {
  await resetTestAccount(talent.email, talent.username);
});

test("deletes a service listing and verifies it is removed", async ({
  page,
}, testInfo) => {
  await loginAs(page, talent.email);
  await expect(page.getByRole("heading", { name: service.title })).toBeVisible();
  await page.getByRole("button", { name: `Edit ${service.title}` }).click();

  const editDialog = page.getByRole("dialog", { name: "Edit service" });
  await expect(editDialog).toBeVisible();
  await editDialog.getByRole("button", { name: "Delete service" }).click();

  const confirmDialog = page.getByRole("dialog", {
    name: "Delete this service?",
  });
  await expect(confirmDialog).toBeVisible();
  await attachScreenshot(testInfo, page, "delete-confirmation-dialog");
  await confirmDialog.getByRole("button", { name: "Delete service" }).click();

  await expect(confirmDialog).toBeHidden();
  await expect(editDialog).toBeHidden();
  await expect(page.getByRole("heading", { name: service.title })).toBeHidden();
  await expectNoServiceInDb(service.title);
  await attachScreenshot(testInfo, page, "deleted-service-dashboard");
});

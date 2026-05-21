import assert from "node:assert/strict";
import test from "node:test";

import { createDriver } from "../lib/driver.js";
import { requiredEnv } from "../lib/config.js";
import {
  clickButton,
  clickByCss,
  clickText,
  expectBodyText,
  fillByCss,
  getValidationMessage,
  loginAs,
  openPath,
} from "../lib/ui.js";

async function withDriver(run) {
  const driver = await createDriver();
  try {
    await run(driver);
  } finally {
    await driver.quit();
  }
}

async function loginClient(t, driver) {
  if (!requiredEnv(t, ["QA_CLIENT_EMAIL", "QA_CLIENT_PASSWORD"])) return false;
  await loginAs(driver, process.env.QA_CLIENT_EMAIL, process.env.QA_CLIENT_PASSWORD);
  return true;
}

test("client profile creation validates required fields", async (t) => {
  await withDriver(async (driver) => {
    if (!(await loginClient(t, driver))) return;

    await openPath(driver, "/dashboard/client/profile");
    await clickByCss(driver, '[aria-label="Edit organization details"]');
    await fillByCss(driver, "#organizationName", "");
    await clickButton(driver, "Save changes");

    await expectBodyText(driver, "Organization name is required.");
  });
});

test("profile identity rejects duplicate username", async (t) => {
  const keys = [
    "QA_CLIENT_EMAIL",
    "QA_CLIENT_PASSWORD",
    "QA_DUPLICATE_USERNAME",
  ];
  if (!requiredEnv(t, keys)) return;

  await withDriver(async (driver) => {
    await loginAs(driver, process.env.QA_CLIENT_EMAIL, process.env.QA_CLIENT_PASSWORD);
    await openPath(driver, "/settings/account");
    await clickButton(driver, "Edit account");
    await fillByCss(driver, "#username", process.env.QA_DUPLICATE_USERNAME);
    await fillByCss(driver, "#contactNum", process.env.QA_CLIENT_CONTACT_NUMBER ?? "09123456789");
    await fillByCss(driver, "#address", process.env.QA_CLIENT_ADDRESS ?? "Bicol University");
    await clickButton(driver, "Save changes");

    await expectBodyText(driver, "Username is already taken.");
  });
});

test("client profile creation can be completed", async (t) => {
  await withDriver(async (driver) => {
    if (!(await loginClient(t, driver))) return;

    const name = `BRaket QA Studio ${Date.now()}`;
    await openPath(driver, "/dashboard/client/profile");
    await clickByCss(driver, '[aria-label="Edit organization details"]');
    await fillByCss(driver, "#organizationName", name);
    await fillByCss(driver, "#businessAddress", "Bicol University");
    await fillByCss(driver, "#website", "qa-braket.example");
    await clickButton(driver, "Save changes");

    await expectBodyText(driver, /Organization details updated|BRaket QA Studio/i);
  });
});

test("talent profile creation validates required fields", async (t) => {
  if (!requiredEnv(t, ["QA_TALENT_EMAIL", "QA_TALENT_PASSWORD"])) return;

  await withDriver(async (driver) => {
    await loginAs(driver, process.env.QA_TALENT_EMAIL, process.env.QA_TALENT_PASSWORD);
    await openPath(driver, "/onboarding/talent?step=1");
    await fillByCss(driver, "#ob-headline", "");
    await fillByCss(driver, "#ob-bio", "");
    await clickButton(driver, "Next");

    const message = await getValidationMessage(driver, "#ob-headline");
    assert.ok(message.length > 0, "Expected headline to require input.");
  });
});

test("talent profile creation step can be completed", async (t) => {
  if (!requiredEnv(t, ["QA_TALENT_EMAIL", "QA_TALENT_PASSWORD"])) return;

  await withDriver(async (driver) => {
    await loginAs(driver, process.env.QA_TALENT_EMAIL, process.env.QA_TALENT_PASSWORD);
    await openPath(driver, "/onboarding/talent?step=1");
    await fillByCss(driver, "#ob-headline", "QA portfolio designer for student teams");
    await fillByCss(driver, "#ob-bio", "I create polished digital materials, portfolio visuals, and practical project assets for student teams that need dependable creative support from planning through launch.");
    await fillByCss(driver, "#ob-college", "College of Science");
    await fillByCss(driver, "#ob-course", "BS Information Technology");
    await clickByCss(driver, '[data-slot="select-trigger"]');
    await clickText(driver, "3rd year");

    for (const skill of ["Figma", "React", "Copywriting"]) {
      await fillByCss(driver, 'input[placeholder*="Find or add"]', skill);
      await clickButton(driver, "Add");
    }

    await clickButton(driver, "Next");
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes("/onboarding/talent?step=2");
    }, 15000);
  });
});

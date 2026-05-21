import assert from "node:assert/strict";
import test from "node:test";

import { createDriver } from "../lib/driver.js";
import { uniqueEmail, requiredEnv } from "../lib/config.js";
import {
  clickButton,
  expectAlertText,
  expectBodyText,
  fillByCss,
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

test("registration validates required fields", async () => {
  await withDriver(async (driver) => {
    await openPath(driver, "/signup");
    await clickButton(driver, "Create Account");

    await expectAlertText(driver, "Enter your email address to continue.");

    await fillByCss(driver, "#signup-email", uniqueEmail("short-password"));
    await fillByCss(driver, "#password", "short");
    await fillByCss(driver, "#confirmPassword", "short");
    await clickButton(driver, "Create Account");

    await expectAlertText(driver, "Password must be at least 8 characters long.");
  });
});

test("registration rejects duplicate email", async (t) => {
  if (!requiredEnv(t, ["QA_DUPLICATE_EMAIL"])) return;

  await withDriver(async (driver) => {
    await openPath(driver, "/signup");
    await fillByCss(driver, "#signup-email", process.env.QA_DUPLICATE_EMAIL);
    await fillByCss(driver, "#password", process.env.QA_NEW_PASSWORD ?? "QaPassw0rd!");
    await fillByCss(driver, "#confirmPassword", process.env.QA_NEW_PASSWORD ?? "QaPassw0rd!");
    await clickButton(driver, "Create Account");

    await expectAlertText(driver, /already exists|sign in/i);
  });
});

test("registration accepts a new account request", async () => {
  await withDriver(async (driver) => {
    const password = process.env.QA_NEW_PASSWORD ?? "QaPassw0rd!";

    await openPath(driver, "/signup");
    await fillByCss(driver, "#signup-email", uniqueEmail("new-account"));
    await fillByCss(driver, "#password", password);
    await fillByCss(driver, "#confirmPassword", password);
    await clickButton(driver, "Create Account");

    await expectBodyText(driver, /sent a confirmation code|Services|Browse/i);
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes("/signup") || url.includes("/services"));
  });
});

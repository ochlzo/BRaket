import assert from "node:assert/strict";
import { By, Key, until } from "selenium-webdriver";

import { BASE_URL, TIMEOUT_MS } from "./config.js";

function xpathLiteral(value) {
  if (!value.includes("'")) return `'${value}'`;
  const parts = value.split("'").map((part) => `'${part}'`);
  return `concat(${parts.join(', "\"\'\"", ')})`;
}

export async function openPath(driver, path) {
  await driver.get(new URL(path, BASE_URL).toString());
}

export async function waitForLocated(driver, locator) {
  return driver.wait(until.elementLocated(locator), TIMEOUT_MS);
}

async function scrollIntoClickView(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ block: 'center', inline: 'center' });",
    element,
  );
  await driver.sleep(100);
}

async function clickElement(driver, element) {
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS);
  await scrollIntoClickView(driver, element);

  try {
    await element.click();
  } catch {
    await driver.executeScript("arguments[0].click();", element);
  }
}

export async function clickButton(driver, text) {
  const literal = xpathLiteral(text);
  const button = await waitForLocated(
    driver,
    By.xpath(`//button[contains(normalize-space(.), ${literal})]`),
  );
  await clickElement(driver, button);
}

export async function clickText(driver, text) {
  const literal = xpathLiteral(text);
  const itemLocator = By.xpath(
    `//*[@data-slot='select-item' or @data-slot='combobox-item'][contains(normalize-space(.), ${literal})]`,
  );
  const fallbackLocator = By.xpath(
    `//*[self::button or self::a][contains(normalize-space(.), ${literal})]`,
  );
  const element = await driver.wait(async () => {
    const items = await driver.findElements(itemLocator);
    for (const item of items) {
      if (await item.isDisplayed()) return item;
    }

    const fallbacks = await driver.findElements(fallbackLocator);
    for (const fallback of fallbacks) {
      if (await fallback.isDisplayed()) return fallback;
    }

    return null;
  }, TIMEOUT_MS);

  await clickElement(driver, element);
}

export async function clickByCss(driver, selector) {
  const element = await waitForLocated(driver, By.css(selector));
  await clickElement(driver, element);
}

export async function fillByCss(driver, selector, value) {
  const field = await waitForLocated(driver, By.css(selector));
  await driver.wait(until.elementIsVisible(field), TIMEOUT_MS);
  await field.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE, value);
}

export async function expectBodyText(driver, expected) {
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css("body")).getText();
    return expected instanceof RegExp
      ? expected.test(bodyText)
      : bodyText.includes(expected);
  }, TIMEOUT_MS);
}

export async function expectAlertText(driver, expected) {
  const alert = await waitForLocated(driver, By.css('[role="alert"]'));
  const text = await alert.getText();
  if (expected instanceof RegExp) {
    assert.match(text, expected);
    return;
  }
  assert.ok(text.includes(expected), `Expected alert to include ${expected}`);
}

async function getVisibleText(driver, locator) {
  const elements = await driver.findElements(locator);

  for (const element of elements) {
    if (await element.isDisplayed()) {
      return element.getText();
    }
  }

  return "";
}

export async function loginAs(driver, email, password) {
  await openPath(driver, "/login");
  await fillByCss(driver, "#login-email", email);
  await fillByCss(driver, "#password", password);
  await clickButton(driver, "Sign In");
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    if (!url.includes("/login")) return true;

    const alertText = await getVisibleText(driver, By.css('[role="alert"]'));
    return alertText.length > 0;
  }, TIMEOUT_MS);

  const url = await driver.getCurrentUrl();
  if (url.includes("/login")) {
    const alertText = await getVisibleText(driver, By.css('[role="alert"]'));
    assert.fail(
      `Login failed for ${email}: ${alertText || "still on the login page"}`,
    );
  }
}

export async function getValidationMessage(driver, selector) {
  return driver.executeScript(
    "return document.querySelector(arguments[0])?.validationMessage || '';",
    selector,
  );
}

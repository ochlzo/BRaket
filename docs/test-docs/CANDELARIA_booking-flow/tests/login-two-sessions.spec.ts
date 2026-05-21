import { expect, test, type Browser } from "@playwright/test";

const LOGIN_URL = "/login";

async function signIn(browser: Browser, email: string, password: string) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(LOGIN_URL);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/services\/?$/);

  return { context, page };
}

test("client and talent can sign in in separate sessions", async ({
  browser,
}) => {
  const client = await signIn(
    browser,
    "cholocandelaria123@gmail.com",
    "Password123!",
  );

  const talent = await signIn(
    browser,
    "jbbc2023-4132-17458@bicol-u.edu.ph",
    "Password123!",
  );

  await client.context.close();
  await talent.context.close();
});

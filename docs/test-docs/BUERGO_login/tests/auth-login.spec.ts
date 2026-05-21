import { test, expect } from "@playwright/test";

test.describe("Member 1 - Login and Authentication", () => {
  test("TC-LOGIN-001: Login page should load successfully", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();

    await expect(
      page.getByText(/sign in with google, your password, or a 6-digit email code/i)
    ).toBeVisible();
  });

  test("TC-LOGIN-002: Login form should show email field", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("TC-LOGIN-003: Empty login submission should show validation or stay on login page", async ({
    page,
  }) => {
    await page.goto("/login");

    const signInButton = page.getByRole("button", { name: /^sign in$/i });
    await signInButton.click();

    await expect(page).toHaveURL(/.*login.*/);
  });

  test("TC-LOGIN-004: Invalid login credentials should not redirect to dashboard", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("wrong-user@example.com");

    const passwordField = page.getByLabel(/password/i);
    await passwordField.fill("wrongpassword123");

    await page.getByRole("button", { name: /^sign in$/i }).click();

    await expect(page).not.toHaveURL(/.*dashboard.*/);
  });

  test("TC-LOGIN-005: Forgot password option should be accessible", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /forgot password/i }).click();

    await expect(page.getByText(/password/i)).toBeVisible();
  });
});
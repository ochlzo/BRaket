# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-login.spec.ts >> Member 1 - Login and Authentication >> TC-LOGIN-004: Invalid login credentials should not redirect to dashboard
- Location: tests\auth-login.spec.ts:33:7

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel(/password/i) resolved to 2 elements:
    1) <input id="password" type="password" name="password" data-slot="input" autocomplete="new-password" placeholder="Enter your password" class="w-full min-w-0 border px-2.5 py-1 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-…/> aka getByRole('textbox', { name: 'Password' })
    2) <button type="button" tabindex="-1" aria-label="Show password" class="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70">…</button> aka getByRole('button', { name: 'Show password' })

Call log:
  - waiting for getByLabel(/password/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - link "B BRaket" [ref=e10] [cursor=pointer]:
        - /url: /
        - generic [ref=e11]: B
        - generic [ref=e13]: BRaket
      - generic [ref=e14]:
        - generic [ref=e15]:
          - heading "Discover talent. Unlock potential." [level=2] [ref=e16]
          - paragraph [ref=e17]: Join hundreds of Bicol University students already building income, experience, and stronger portfolios on BRaket.
        - paragraph [ref=e24]: 500+ students already earning
        - generic [ref=e25]:
          - generic [ref=e26]: Verified Talents
          - generic [ref=e28]: Secure Payments
          - generic [ref=e30]: Real Portfolios
    - generic [ref=e32]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - heading "Welcome back" [level=1] [ref=e37]
          - paragraph [ref=e38]: Sign in with Google, your password, or a 6-digit email code.
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: Email Address
            - generic [ref=e43]:
              - generic:
                - img
              - textbox "Email Address" [active] [ref=e44]:
                - /placeholder: you@example.com
                - text: wrong-user@example.com
          - generic [ref=e45]:
            - generic [ref=e46]:
              - generic [ref=e47]: Password
              - link "Forgot password" [ref=e48] [cursor=pointer]:
                - /url: "#forgot-password"
            - generic [ref=e49]:
              - generic:
                - img
              - textbox "Password" [ref=e50]:
                - /placeholder: Enter your password
              - button "Show password" [ref=e51]:
                - img [ref=e52]
          - button "Sign In" [ref=e55]:
            - text: Sign In
            - img
          - button "Use email code instead" [ref=e56]
          - generic [ref=e57]:
            - generic [ref=e58]:
              - separator [ref=e59]
              - generic [ref=e60]: or sign in with Google
              - separator [ref=e61]
            - button "Sign in with Google" [ref=e62]:
              - img
              - text: Sign in with Google
          - paragraph [ref=e63]:
            - text: Need an account?
            - link "Create one" [ref=e64] [cursor=pointer]:
              - /url: /signup
      - generic [ref=e65]: © 2026 BRaket. All rights reserved.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e71] [cursor=pointer]:
    - img [ref=e72]
  - alert [ref=e75]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Member 1 - Login and Authentication", () => {
  4  |   test("TC-LOGIN-001: Login page should load successfully", async ({ page }) => {
  5  |     await page.goto("/login");
  6  | 
  7  |     await expect(
  8  |       page.getByRole("heading", { name: /welcome back/i })
  9  |     ).toBeVisible();
  10 | 
  11 |     await expect(
  12 |       page.getByText(/sign in with google, your password, or a 6-digit email code/i)
  13 |     ).toBeVisible();
  14 |   });
  15 | 
  16 |   test("TC-LOGIN-002: Login form should show email field", async ({ page }) => {
  17 |     await page.goto("/login");
  18 | 
  19 |     await expect(page.getByLabel(/email/i)).toBeVisible();
  20 |   });
  21 | 
  22 |   test("TC-LOGIN-003: Empty login submission should show validation or stay on login page", async ({
  23 |     page,
  24 |   }) => {
  25 |     await page.goto("/login");
  26 | 
  27 |     const signInButton = page.getByRole("button", { name: /^sign in$/i });
  28 |     await signInButton.click();
  29 | 
  30 |     await expect(page).toHaveURL(/.*login.*/);
  31 |   });
  32 | 
  33 |   test("TC-LOGIN-004: Invalid login credentials should not redirect to dashboard", async ({
  34 |     page,
  35 |   }) => {
  36 |     await page.goto("/login");
  37 | 
  38 |     await page.getByLabel(/email/i).fill("wrong-user@example.com");
  39 | 
  40 |     const passwordField = page.getByLabel(/password/i);
> 41 |     await passwordField.fill("wrongpassword123");
     |                         ^ Error: locator.fill: Error: strict mode violation: getByLabel(/password/i) resolved to 2 elements:
  42 | 
  43 |     await page.getByRole("button", { name: /^sign in$/i }).click();
  44 | 
  45 |     await expect(page).not.toHaveURL(/.*dashboard.*/);
  46 |   });
  47 | 
  48 |   test("TC-LOGIN-005: Forgot password option should be accessible", async ({
  49 |     page,
  50 |   }) => {
  51 |     await page.goto("/login");
  52 | 
  53 |     await page.getByRole("button", { name: /forgot password/i }).click();
  54 | 
  55 |     await expect(page.getByText(/password/i)).toBeVisible();
  56 |   });
  57 | });
```
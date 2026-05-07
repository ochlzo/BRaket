import assert from "node:assert/strict";
import test from "node:test";

const signupEmailAvailabilityModule = await import(
  new URL("./get-signup-email-availability.ts", import.meta.url).href,
);

const {
  getSignupEmailAvailability,
  SIGNUP_EMAIL_EXISTS_MESSAGE,
  SIGNUP_EMAIL_REQUIRED_MESSAGE,
} = signupEmailAvailabilityModule;

test("rejects signup when the auth email already exists", async () => {
  const checkedEmails: string[] = [];

  const result = await getSignupEmailAvailability(
    " Existing@Example.com ",
    async (email: string) => {
      checkedEmails.push(email);
      return true;
    },
  );

  assert.deepEqual(result, {
    ok: false,
    message: SIGNUP_EMAIL_EXISTS_MESSAGE,
  });
  assert.deepEqual(checkedEmails, ["existing@example.com"]);
});

test("allows signup when the auth email is available", async () => {
  const result = await getSignupEmailAvailability(
    "new@example.com",
    async () => false,
  );

  assert.deepEqual(result, { ok: true });
});

test("rejects signup when the email is empty", async () => {
  const result = await getSignupEmailAvailability("   ", async () => false);

  assert.deepEqual(result, {
    ok: false,
    message: SIGNUP_EMAIL_REQUIRED_MESSAGE,
  });
});

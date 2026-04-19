import assert from "node:assert/strict";
import test from "node:test";

const passwordResetModule = await import(
  new URL("./password-reset.ts", import.meta.url).href,
);

const {
  buildPasswordResetRedirectTo,
  isPasswordRecoveryAttempt,
  PASSWORD_RESET_CONFIRM_MISMATCH_MESSAGE,
  PASSWORD_RESET_MIN_LENGTH_MESSAGE,
  validatePasswordResetChange,
} = passwordResetModule;

test("builds the update-password redirect URL from the site origin", () => {
  assert.equal(
    buildPasswordResetRedirectTo("https://braket.example"),
    "https://braket.example/update-password?recovery=1",
  );
});

test("recognizes the recovery query flag", () => {
  assert.equal(isPasswordRecoveryAttempt("1"), true);
  assert.equal(isPasswordRecoveryAttempt("true"), false);
  assert.equal(isPasswordRecoveryAttempt(undefined), false);
});

test("rejects a new password shorter than 8 characters", () => {
  assert.deepEqual(validatePasswordResetChange("short", "short"), {
    ok: false,
    message: PASSWORD_RESET_MIN_LENGTH_MESSAGE,
  });
});

test("rejects password confirmation mismatches", () => {
  assert.deepEqual(validatePasswordResetChange("long-enough", "different"), {
    ok: false,
    message: PASSWORD_RESET_CONFIRM_MISMATCH_MESSAGE,
  });
});

test("accepts a valid new password and confirmation", () => {
  assert.deepEqual(
    validatePasswordResetChange("long-enough", "long-enough"),
    { ok: true },
  );
});

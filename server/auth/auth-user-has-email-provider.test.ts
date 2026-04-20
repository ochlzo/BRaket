import assert from "node:assert/strict";
import test from "node:test";

const authUserHasEmailProviderModule = await import(
  new URL("./auth-user-has-email-provider.ts", import.meta.url).href,
);

const { authUserHasEmailProvider } = authUserHasEmailProviderModule;

test("returns true when the auth user has an email provider", async () => {
  const hasEmailProvider = await authUserHasEmailProvider(
    "user-1",
    async () => ["google", "email"],
  );

  assert.equal(hasEmailProvider, true);
});

test("returns false when the auth user only has oauth providers", async () => {
  const hasEmailProvider = await authUserHasEmailProvider(
    "user-2",
    async () => ["google"],
  );

  assert.equal(hasEmailProvider, false);
});

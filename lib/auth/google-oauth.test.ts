import assert from "node:assert/strict";
import test from "node:test";

const googleOAuthModule = await import(
  new URL("./google-oauth.ts", import.meta.url).href,
);

const {
  buildGoogleOAuthMetadataPatch,
  buildGoogleOAuthRedirectTo,
  readGoogleOAuthContext,
  resolveGoogleOAuthMode,
} = googleOAuthModule;

test("builds a signup callback URL with the selected role", () => {
  const redirectTo = buildGoogleOAuthRedirectTo(
    "https://braket.example",
    "signup",
    "talent",
  );

  assert.equal(
    redirectTo,
    "https://braket.example/auth/callback?mode=signup&role=talent",
  );
});

test("defaults callback context to login and client when params are invalid", () => {
  const context = readGoogleOAuthContext(
    new URLSearchParams({
      mode: "unknown",
      role: "invalid",
    }),
  );

  assert.deepEqual(context, {
    mode: "login",
    role: "client",
  });
});

test("adds missing role and username metadata for Google auth users", () => {
  const patch = buildGoogleOAuthMetadataPatch("Talent.User@example.com", "talent");

  assert.deepEqual(patch, {
    role: "talent",
    username: "talent-user",
  });
});

test("does not overwrite existing role and username metadata", () => {
  const patch = buildGoogleOAuthMetadataPatch("person@example.com", "client", {
    role: "talent",
    username: "existing-user",
  });

  assert.equal(patch, null);
});

test("treats signup OAuth as login when the user already has a stored role", () => {
  const mode = resolveGoogleOAuthMode("signup", {
    role: "talent",
  });

  assert.equal(mode, "login");
});

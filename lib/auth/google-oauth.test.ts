import assert from "node:assert/strict";
import test from "node:test";

import {
  buildGoogleOAuthFlowPath,
  buildGoogleOAuthMetadataPatch,
  buildGoogleOAuthRedirectTo,
  getGoogleOAuthCallbackRedirectPath,
  readGoogleOAuthContext,
  resolveGoogleOAuthMode,
} from "./google-oauth";

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

test("builds a login callback URL with a safe callback target", () => {
  const redirectTo = buildGoogleOAuthRedirectTo(
    "https://braket.example",
    "login",
    "client",
    "/onboarding/talent",
  );

  assert.equal(
    redirectTo,
    "https://braket.example/auth/callback?mode=login&callbackUrl=%2Fonboarding%2Ftalent",
  );
});

test("builds a create-password path with the oauth context", () => {
  assert.equal(
    buildGoogleOAuthFlowPath("/create-password", "signup", "talent"),
    "/create-password?mode=signup&role=talent",
  );
});

test("builds an oauth flow path with a safe callback target", () => {
  assert.equal(
    buildGoogleOAuthFlowPath(
      "/auth/complete",
      "login",
      "client",
      "/onboarding/talent",
    ),
    "/auth/complete?mode=login&role=client&callbackUrl=%2Fonboarding%2Ftalent",
  );
});

test("redirects oauth callback to create-password when email auth is missing", () => {
  assert.equal(
    getGoogleOAuthCallbackRedirectPath(
      true,
      "login",
      "client",
      "/onboarding/talent",
    ),
    "/create-password?mode=login&role=client&callbackUrl=%2Fonboarding%2Ftalent",
  );
});

test("redirects oauth callback to auth complete when email auth exists", () => {
  assert.equal(
    getGoogleOAuthCallbackRedirectPath(false, "signup", "talent"),
    "/auth/complete?mode=signup&role=talent",
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
    callbackUrl: null,
    mode: "login",
    role: "client",
  });
});

test("reads safe callback URLs from oauth search params", () => {
  const context = readGoogleOAuthContext(
    new URLSearchParams({
      callbackUrl: "/onboarding/talent",
      mode: "login",
    }),
  );

  assert.equal(context.callbackUrl, "/onboarding/talent");
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

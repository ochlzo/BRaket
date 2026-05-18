import assert from "node:assert/strict";
import test from "node:test";

const sessionModule = await import(new URL("./session.ts", import.meta.url).href);

const {
  buildAvatarInitials,
  buildDicebearNotionistsAvatarUrl,
  getAuthRedirectPath,
  getLoginRedirectPath,
  normalizeCallbackUrl,
  resolveAppSession,
  resolveCanonicalUsername,
} = sessionModule;

test("redirects all signup flows to services", () => {
  assert.equal(getAuthRedirectPath("talent", "signup"), "/services");
  assert.equal(getAuthRedirectPath("client", "signup"), "/services");
});

test("redirects login without a callback to services", () => {
  assert.equal(getAuthRedirectPath("talent", "login"), "/services");
  assert.equal(getAuthRedirectPath("client", "login"), "/services");
});

test("uses safe callback URLs for login redirects", () => {
  assert.equal(
    getAuthRedirectPath("client", "login", "/onboarding/talent"),
    "/onboarding/talent",
  );
  assert.equal(
    getAuthRedirectPath("client", "login", "/onboarding/talent?step=2"),
    "/onboarding/talent?step=2",
  );
  assert.equal(
    getAuthRedirectPath("talent", "login", "/settings/account?tab=profile"),
    "/settings/account?tab=profile",
  );
});

test("ignores unsafe callback URLs", () => {
  assert.equal(normalizeCallbackUrl("https://evil.example/path"), null);
  assert.equal(normalizeCallbackUrl("//evil.example/path"), null);
  assert.equal(normalizeCallbackUrl("/login"), null);
  assert.equal(
    getAuthRedirectPath("client", "login", "https://evil.example"),
    "/services",
  );
});

test("builds login redirects with callback parameters", () => {
  assert.equal(
    getLoginRedirectPath("/onboarding/talent"),
    "/login?callbackUrl=%2Fonboarding%2Ftalent",
  );
  assert.equal(
    getLoginRedirectPath("/onboarding/talent?step=2"),
    "/login?callbackUrl=%2Fonboarding%2Ftalent%3Fstep%3D2",
  );
  assert.equal(getLoginRedirectPath("https://evil.example"), "/login");
});

test("prefers the stored database username over auth metadata", () => {
  assert.equal(
    resolveCanonicalUsername({
      authEmail: "person@example.com",
      authUsername: "old-google-name",
      dbUsername: "new-db-name",
    }),
    "new-db-name",
  );
});

test("builds the notionists avatar url from a seed", () => {
  assert.equal(
    buildDicebearNotionistsAvatarUrl("Vivian"),
    "https://api.dicebear.com/9.x/notionists/svg?seed=Vivian",
  );
});

test("keeps auth metadata avatar url in the client app session", () => {
  const session = resolveAppSession({
    email: "vivian@example.com",
    mode: "login",
    userMetadata: {
      avatar_url: "https://example.com/avatar.jpg",
      username: "vivian",
    },
  });

  assert.equal(session.avatarUrl, "https://example.com/avatar.jpg");
});

test("builds initials from display name or email", () => {
  assert.equal(buildAvatarInitials("Vivian Santos", "vivian@example.com"), "VS");
  assert.equal(buildAvatarInitials("", "vivian@example.com"), "V");
});

import assert from "node:assert/strict";
import test from "node:test";

const sessionModule = await import(new URL("./session.ts", import.meta.url).href);

const {
  buildDicebearNotionistsAvatarUrl,
  getAuthRedirectPath,
  resolveCanonicalUsername,
} = sessionModule;

test("redirects all signup flows to the client dashboard", () => {
  assert.equal(getAuthRedirectPath("talent", "signup"), "/dashboard/client");
  assert.equal(getAuthRedirectPath("client", "signup"), "/dashboard/client");
});

test("keeps login redirects role-aware", () => {
  assert.equal(getAuthRedirectPath("talent", "login"), "/dashboard/talent");
  assert.equal(getAuthRedirectPath("client", "login"), "/dashboard/client");
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

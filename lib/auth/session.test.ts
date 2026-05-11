import assert from "node:assert/strict";
import test from "node:test";

const sessionModule = await import(new URL("./session.ts", import.meta.url).href);

const { getAuthRedirectPath } = sessionModule;

test("redirects all signup flows to the client dashboard", () => {
  assert.equal(getAuthRedirectPath("talent", "signup"), "/dashboard/client");
  assert.equal(getAuthRedirectPath("client", "signup"), "/dashboard/client");
});

test("keeps login redirects role-aware", () => {
  assert.equal(getAuthRedirectPath("talent", "login"), "/dashboard/talent");
  assert.equal(getAuthRedirectPath("client", "login"), "/dashboard/client");
});

import assert from "node:assert/strict";
import test from "node:test";

const {
  getSettingsHref,
  getSettingsSourceFromPathname,
  parseSettingsSource,
} = (await import(new URL("./settings-source.ts", import.meta.url).href)) as typeof import("./settings-source");

test("resolves settings source from dashboard pathnames", () => {
  assert.equal(
    getSettingsSourceFromPathname("/dashboard/talent/profile", "client"),
    "talent",
  );
  assert.equal(
    getSettingsSourceFromPathname("/dashboard/client/bookings", "talent"),
    "client",
  );
  assert.equal(getSettingsSourceFromPathname("/settings", "talent"), "talent");
});

test("parses settings source query values", () => {
  assert.equal(parseSettingsSource("talent", "client"), "talent");
  assert.equal(parseSettingsSource("client", "talent"), "client");
  assert.equal(parseSettingsSource(["talent"], "client"), "talent");
  assert.equal(parseSettingsSource("admin", "client"), "client");
  assert.equal(parseSettingsSource(undefined, "talent"), "talent");
});

test("builds settings hrefs with source context", () => {
  assert.equal(getSettingsHref("talent"), "/settings?source=talent");
  assert.equal(
    getSettingsHref("client", "/settings/account"),
    "/settings/account?source=client",
  );
});

import assert from "node:assert/strict";
import test from "node:test";

const accessRulesModule = await import(
  new URL("./access-rules.ts", import.meta.url).href
);

const { isAdminEmail, parseAdminEmails } = accessRulesModule;

test("parses admin emails as a normalized allowlist", () => {
  assert.deepEqual(
    parseAdminEmails(" Admin@Example.com, second@example.com ,, "),
    ["admin@example.com", "second@example.com"],
  );
});

test("checks admin emails case-insensitively", () => {
  assert.equal(isAdminEmail("ADMIN@example.com", ["admin@example.com"]), true);
  assert.equal(isAdminEmail("user@example.com", ["admin@example.com"]), false);
});

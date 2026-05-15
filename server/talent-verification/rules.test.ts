import assert from "node:assert/strict";
import test from "node:test";

const rulesModule = await import(new URL("./rules.ts", import.meta.url).href);

const {
  buildBuIdStoragePath,
  isBuEmail,
  normalizeBuEmail,
  validateBuIdImageFile,
} = rulesModule;

test("normalizes and validates BU email addresses", () => {
  assert.equal(normalizeBuEmail(" Student@BICOL-U.EDU.PH "), "student@bicol-u.edu.ph");
  assert.equal(isBuEmail("student@bicol-u.edu.ph"), true);
  assert.equal(isBuEmail("student@example.com"), false);
});

test("validates BU ID image uploads", () => {
  assert.equal(validateBuIdImageFile(null), "Upload a clear BU ID image.");
  assert.equal(
    validateBuIdImageFile({ name: "id.pdf", size: 100, type: "application/pdf" }),
    "Upload a JPG, PNG, or WebP image of your BU ID.",
  );
  assert.equal(
    validateBuIdImageFile({
      name: "id.png",
      size: 6 * 1024 * 1024,
      type: "image/png",
    }),
    "Keep the BU ID image under 5 MB.",
  );
  assert.equal(
    validateBuIdImageFile({ name: "id.png", size: 1024, type: "image/png" }),
    "",
  );
});

test("builds BU ID paths under the auth user folder", () => {
  const path = buildBuIdStoragePath("auth-123", {
    name: "School ID.PNG",
    size: 1024,
    type: "image/png",
  });

  assert.match(path, /^auth-123\/talent-verification-.+\.png$/);
});

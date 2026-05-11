import assert from "node:assert/strict";
import test from "node:test";

const organizationDetailsModule = await import(
  new URL("./organization-details.ts", import.meta.url).href,
);

const {
  buildOrganizationDetailsEditorValues,
  parseOrganizationDetailsFormData,
  validateOrganizationDetailsInput,
} = organizationDetailsModule;

test("builds organization editor values from the profile model", () => {
  const result = buildOrganizationDetailsEditorValues({
    businessAddress: "Bicol University",
    email: "client@example.com",
    organizationName: "BRaket Creative Studio",
    website: "https://braket.example",
  });

  assert.deepEqual(result, {
    businessAddress: "Bicol University",
    email: "client@example.com",
    organizationName: "BRaket Creative Studio",
    website: "https://braket.example",
  });
});

test("parses organization form data with trimmed values and normalized website", () => {
  const formData = new FormData();
  formData.append("organizationName", "  BRaket Creative Studio  ");
  formData.append("businessAddress", "  Bicol University  ");
  formData.append("website", "braket.example");
  formData.append("email", "ignored@example.com");

  const result = parseOrganizationDetailsFormData(formData);

  assert.deepEqual(result, {
    businessAddress: "Bicol University",
    organizationName: "BRaket Creative Studio",
    website: "https://braket.example",
  });
});

test("rejects an empty organization name", () => {
  assert.deepEqual(
    validateOrganizationDetailsInput({
      businessAddress: "Bicol University",
      organizationName: "   ",
      website: "https://braket.example",
    }),
    {
      fieldErrors: {
        organizationName: "Organization name is required.",
      },
      message: "Please fix the highlighted fields.",
      ok: false,
    },
  );
});

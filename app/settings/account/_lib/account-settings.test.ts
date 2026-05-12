import assert from "node:assert/strict";
import test from "node:test";

const accountSettingsModule = await import(
  new URL("./account-settings.ts", import.meta.url).href
);

const {
  parseAccountSettingsFormData,
  validateAccountSettingsInput,
} = accountSettingsModule;

test("parses account settings form data with digit-only contact numbers", () => {
  const formData = new FormData();
  formData.set("firstName", "  Jane  ");
  formData.set("lastName", "  Cruz ");
  formData.set("username", "  Jane Cruz  ");
  formData.set("email", "jane@example.com");
  formData.set("contactNum", "09-17 482 1945");
  formData.set("address", "  Legazpi City  ");
  formData.set("facebookUrl", "  jane.cruz  ");

  const result = parseAccountSettingsFormData(formData);

  assert.equal(result.firstName, "Jane");
  assert.equal(result.lastName, "Cruz");
  assert.equal(result.username, "jane-cruz");
  assert.equal(result.contactNum, "09174821945");
  assert.equal(result.address, "Legazpi City");
  assert.equal(result.facebookUrl, "jane.cruz");
});

test("rejects missing required account fields", () => {
  const result = validateAccountSettingsInput({
    address: "",
    contactNum: "",
    email: "jane@example.com",
    facebookUrl: "",
    firstName: "",
    githubUrl: "",
    instagramUrl: "",
    lastName: "",
    linkedinUrl: "",
    username: "",
    xUrl: "",
  }, {
    usernameTaken: false,
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.username, "Username is required.");
  assert.equal(result.fieldErrors?.contactNum, "Contact number is required.");
  assert.equal(result.fieldErrors?.address, "Address is required.");
});

test("rejects contact numbers that are not exactly 11 digits starting with 09", () => {
  const result = validateAccountSettingsInput({
    address: "Legazpi City",
    contactNum: "08123456789",
    email: "jane@example.com",
    facebookUrl: "",
    firstName: "Jane",
    githubUrl: "",
    instagramUrl: "",
    lastName: "Cruz",
    linkedinUrl: "",
    username: "jane-cruz",
    xUrl: "",
  }, {
    usernameTaken: false,
  });

  assert.equal(result.ok, false);
  assert.equal(
    result.fieldErrors?.contactNum,
    "Contact number must start with 09 and contain 11 digits.",
  );
});

test("rejects duplicate usernames", () => {
  const result = validateAccountSettingsInput({
    address: "Legazpi City",
    contactNum: "09174821945",
    email: "jane@example.com",
    facebookUrl: "",
    firstName: "Jane",
    githubUrl: "",
    instagramUrl: "",
    lastName: "Cruz",
    linkedinUrl: "",
    username: "jane-cruz",
    xUrl: "",
  }, {
    usernameTaken: true,
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.username, "Username is already taken.");
});

test("rejects duplicate contact numbers", () => {
  const result = validateAccountSettingsInput({
    address: "Legazpi City",
    contactNum: "09174821945",
    email: "jane@example.com",
    facebookUrl: "",
    firstName: "Jane",
    githubUrl: "",
    instagramUrl: "",
    lastName: "Cruz",
    linkedinUrl: "",
    username: "jane-cruz",
    xUrl: "",
  }, {
    contactNumTaken: true,
    usernameTaken: false,
  });

  assert.equal(result.ok, false);
  assert.equal(
    result.fieldErrors?.contactNum,
    "Contact number is already in use.",
  );
});

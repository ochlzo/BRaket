import assert from "node:assert/strict";
import test from "node:test";

const namePartsModule = await import(
  new URL("./name-parts.ts", import.meta.url).href,
);

const { resolveNamePartsFromMetadata } = namePartsModule;

test("splits a Google display name into first and last name parts", () => {
  const result = resolveNamePartsFromMetadata({
    full_name: "Maria Clara Santos",
  });

  assert.deepEqual(result, {
    firstName: "Maria",
    lastName: "Clara Santos",
  });
});

test("prefers explicit first and last name metadata over display name", () => {
  const result = resolveNamePartsFromMetadata({
    first_name: "Maria",
    last_name: "Santos",
    full_name: "Maria Clara Santos",
  });

  assert.deepEqual(result, {
    firstName: "Maria",
    lastName: "Santos",
  });
});

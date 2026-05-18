import assert from "node:assert/strict";
import test from "node:test";

const { formatBookingBudgetLabel } = (await import(
  new URL("./budget-label.ts", import.meta.url).href
)) as typeof import("./budget-label");

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

test("formats a submitted proposed booking budget", () => {
  assert.equal(formatBookingBudgetLabel(150), pesoFormatter.format(150));
});

test("uses not specified when no proposed budget exists", () => {
  assert.equal(formatBookingBudgetLabel(null), "Not specified");
});

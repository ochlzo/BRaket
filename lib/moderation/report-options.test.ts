import assert from "node:assert/strict";
import test from "node:test";

const optionsModule = await import(
  new URL("./report-options.ts", import.meta.url).href,
);

const { isReportStatusValue, reportStatuses } = optionsModule;

test("report statuses exclude reviewed", () => {
  assert.deepEqual(
    reportStatuses.map((status: { value: string }) => status.value),
    ["PENDING", "ACTIONED", "DISMISSED"],
  );
  assert.equal(isReportStatusValue("REVIEWED"), false);
});

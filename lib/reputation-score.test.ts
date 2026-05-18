import assert from "node:assert/strict";
import test from "node:test";

const reputationModule = await import(
  new URL("./reputation-score.ts", import.meta.url).href,
);

const { calculateReportBasedReputationScore } = reputationModule;

test("defaults reputation score to 100 when there are no actioned reports", () => {
  assert.equal(calculateReportBasedReputationScore(0), 100);
});

test("subtracts 20 points per actioned report down to zero", () => {
  assert.equal(calculateReportBasedReputationScore(1), 80);
  assert.equal(calculateReportBasedReputationScore(2), 60);
  assert.equal(calculateReportBasedReputationScore(3), 40);
  assert.equal(calculateReportBasedReputationScore(4), 20);
  assert.equal(calculateReportBasedReputationScore(5), 0);
  assert.equal(calculateReportBasedReputationScore(10), 0);
});

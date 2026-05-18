const DEFAULT_REPUTATION_SCORE = 100;
const REPORT_SCORE_PENALTY = 20;

export function calculateReportBasedReputationScore(actionedReportCount: number) {
  const safeReportCount = Math.max(0, Math.floor(actionedReportCount));

  return Math.max(
    0,
    DEFAULT_REPUTATION_SCORE - safeReportCount * REPORT_SCORE_PENALTY,
  );
}

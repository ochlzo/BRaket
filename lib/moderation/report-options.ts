export const reportReasons = [
  { label: "Scam or fraud", value: "SCAM_OR_FRAUD" },
  { label: "Harassment or abuse", value: "HARASSMENT_OR_ABUSE" },
  { label: "Fake profile", value: "FAKE_PROFILE" },
  { label: "Inappropriate content", value: "INAPPROPRIATE_CONTENT" },
  { label: "Academic dishonesty", value: "ACADEMIC_DISHONESTY" },
  { label: "Copyright issue", value: "COPYRIGHT_ISSUE" },
  { label: "Spam", value: "SPAM" },
  { label: "Other", value: "OTHER" },
] as const;

export const reportStatuses = [
  { label: "Pending", value: "PENDING" },
  { label: "Actioned", value: "ACTIONED" },
  { label: "Dismissed", value: "DISMISSED" },
] as const;

export const reportTargetTypes = [
  "PROFILE",
  "SERVICE",
  "REVIEW",
  "BOOKING",
  "PORTFOLIO",
] as const;

export type ReportReasonValue = (typeof reportReasons)[number]["value"];

export type ReportStatusValue = (typeof reportStatuses)[number]["value"];

export type ReportTargetTypeValue = (typeof reportTargetTypes)[number];

export function isReportReasonValue(
  value: string,
): value is ReportReasonValue {
  return reportReasons.some((reason) => reason.value === value);
}

export function isReportStatusValue(
  value: string,
): value is ReportStatusValue {
  return reportStatuses.some((status) => status.value === value);
}

export function isReportTargetTypeValue(
  value: string,
): value is ReportTargetTypeValue {
  return reportTargetTypes.includes(value as ReportTargetTypeValue);
}

export function reportReasonLabel(value: string) {
  return reportReasons.find((reason) => reason.value === value)?.label ?? value;
}

export function reportStatusLabel(value: string) {
  return reportStatuses.find((status) => status.value === value)?.label ?? value;
}

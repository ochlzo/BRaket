import "dotenv/config";

export const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
export const BROWSER = process.env.QA_BROWSER ?? "chrome";
export const HEADLESS = process.env.QA_HEADLESS !== "false";
export const TIMEOUT_MS = Number(process.env.QA_TIMEOUT_MS ?? 15000);

export function uniqueEmail(prefix = "qa-user") {
  const domain = process.env.QA_EMAIL_DOMAIN ?? "example.com";
  return `${prefix}.${Date.now()}@${domain}`.toLowerCase();
}

export function requiredEnv(t, keys) {
  const missing = keys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    t.skip(`Missing environment variable(s): ${missing.join(", ")}`);
    return false;
  }

  return true;
}

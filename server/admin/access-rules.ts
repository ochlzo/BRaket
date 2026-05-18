export function parseAdminEmails(value = "") {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string, allowlist: string[]) {
  return allowlist.includes(email.trim().toLowerCase());
}

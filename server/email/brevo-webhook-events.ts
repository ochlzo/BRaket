import "server-only";

import fs from "node:fs";
import path from "node:path";

export type BrevoWebhookEvent = {
  email?: string;
  event: string;
  messageId?: string;
  tags: string[];
};

const LOG_FILE = path.join(
  process.cwd(),
  "test-results",
  "brevo-webhook-events.log",
);

export function recordBrevoWebhookEvent(event: BrevoWebhookEvent) {
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(
      LOG_FILE,
      `${JSON.stringify({ ...event, at: new Date().toISOString() })}\n`,
      "utf8",
    );
  } catch (error) {
    console.warn("Failed to record Brevo webhook event.", error);
  }
}


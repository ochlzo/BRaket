import "server-only";

import fs from "node:fs";
import path from "node:path";

type BookingEmailEvent = {
  bookingId: string;
  clientEmail: string;
  kind: "talent-booking-request";
  message?: string;
  serviceId?: string;
  stage: "attempt" | "failure" | "success";
  talentEmail: string;
};

const LOG_FILE = path.join(
  process.cwd(),
  "test-results",
  "booking-email-events.log",
);

export function recordBookingEmailEvent(event: BookingEmailEvent) {
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(
      LOG_FILE,
      `${JSON.stringify({ ...event, at: new Date().toISOString() })}\n`,
      "utf8",
    );
  } catch (error) {
    console.warn("Failed to record booking email event.", error);
  }
}


import { NextResponse } from "next/server";

import { recordBrevoWebhookEvent } from "@/server/email/brevo-webhook-events";

type BrevoWebhookPayload = {
  email?: string;
  event?: string;
  "message-id"?: string;
  tags?: string[];
};

function readTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;

      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function POST(request: Request) {
  let payload: BrevoWebhookPayload | null = null;

  try {
    payload = (await request.json()) as BrevoWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = payload.event?.trim();

  if (!event) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  recordBrevoWebhookEvent({
    email: payload.email?.trim(),
    event,
    messageId: payload["message-id"]?.trim(),
    tags: readTags(payload.tags),
  });

  return NextResponse.json({ ok: true });
}


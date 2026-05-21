import "server-only";

type SendEmailInput = {
  from?: string;
  html: string;
  idempotencyKey?: string;
  tags?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  to: string;
};

type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function parseEmailAddress(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);

  if (match) {
    return {
      email: match[2].trim(),
      name: match[1].replace(/^"|"$/g, "").trim() || undefined,
    };
  }

  return {
    email: value.trim(),
    name: undefined,
  };
}

export async function sendEmail({
  from = process.env.BOOKING_EMAIL_FROM,
  html,
  idempotencyKey,
  tags,
  replyTo,
  subject,
  text,
  to,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || !from) {
    return {
      message: "Brevo email notifications are not configured.",
      ok: false,
    };
  }

  if (apiKey.includes("your_brevo_api_key")) {
    return {
      message: "BREVO_API_KEY must be a real Brevo API key.",
      ok: false,
    };
  }

  const sender = parseEmailAddress(from);
  const recipient = parseEmailAddress(to);
  const replyToAddress = replyTo ? parseEmailAddress(replyTo) : undefined;
  const response = await fetch(BREVO_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
      htmlContent: html,
      replyTo: replyToAddress,
      sender,
      tags,
      subject,
      textContent: text,
      to: [recipient],
    }),
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as {
    code?: string;
    message?: string;
    messageId?: string;
  } | null;

  if (!response.ok) {
    return {
      message:
        payload?.message ??
        `Brevo email notification failed with status ${response.status}.`,
      ok: false,
    };
  }

  return {
    id: payload?.messageId ?? "",
    ok: true,
  };
}

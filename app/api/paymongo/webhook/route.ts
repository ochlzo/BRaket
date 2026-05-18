import { NextResponse } from "next/server";

import { activateBoostFromCheckoutSession } from "@/server/boosts/boost";
import { verifyPaymongoWebhookSignature } from "@/server/paymongo/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaymongoWebhookPayload = {
  data?: {
    attributes?: {
      data?: unknown;
      type?: string;
    };
    id?: string;
  };
};

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const signatureHeader =
    request.headers.get("paymongo-signature") ??
    request.headers.get("Paymongo-Signature");

  if (
    !verifyPaymongoWebhookSignature({
      payload: rawPayload,
      signatureHeader,
    })
  ) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawPayload) as PaymongoWebhookPayload;
    const eventType = payload.data?.attributes?.type;
    const resource = payload.data?.attributes?.data;

    if (eventType === "checkout_session.payment.paid" && resource) {
      await activateBoostFromCheckoutSession(
        resource as Parameters<typeof activateBoostFromCheckoutSession>[0],
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PayMongo webhook processing failed.", error);
    return NextResponse.json({ ok: true });
  }
}

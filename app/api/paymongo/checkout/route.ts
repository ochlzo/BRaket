import { NextResponse } from "next/server";

import { getSubscriptionPlan } from "@/lib/content/subscription-plans";

const PAYMONGO_CHECKOUT_URL = "https://api.paymongo.com/v1/checkout_sessions";

function getBaseUrl(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "http";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    return `${forwardedProto}://${host}`;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ??
    new URL(request.url).origin
  );
}

function getPaymongoAuthHeader() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY?.trim();

  if (!secretKey) {
    return null;
  }

  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const planSlug = String(formData.get("plan") ?? "");
  const plan = getSubscriptionPlan(planSlug);

  if (!plan) {
    return NextResponse.json(
      { message: "Choose a valid subscription plan." },
      { status: 400 },
    );
  }

  const authorization = getPaymongoAuthHeader();

  if (!authorization) {
    return NextResponse.json(
      { message: "PayMongo secret key is not configured." },
      { status: 500 },
    );
  }

  const baseUrl = getBaseUrl(request);
  const referenceNumber = `braket-${plan.slug}-${Date.now()}`;
  const paymentDescription = `BRaket boost payment for ${plan.name}`;
  const successUrl = `${baseUrl}/subscriptions/success?plan=${plan.slug}&ref=${referenceNumber}`;
  const cancelUrl = `${baseUrl}/subscriptions/cancel?plan=${plan.slug}&ref=${referenceNumber}`;

  const response = await fetch(PAYMONGO_CHECKOUT_URL, {
    body: JSON.stringify({
      data: {
        attributes: {
          cancel_url: cancelUrl,
          description: paymentDescription,
          line_items: [
            {
              amount: plan.amount,
              currency: "PHP",
              description: paymentDescription,
              name: plan.name,
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya"],
          reference_number: referenceNumber,
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          success_url: successUrl,
        },
      },
    }),
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as {
    data?: { attributes?: { checkout_url?: string } };
    errors?: Array<{ detail?: string }>;
  } | null;

  const checkoutUrl = payload?.data?.attributes?.checkout_url;

  if (!response.ok || !checkoutUrl) {
    console.error("PayMongo checkout creation failed.", payload);
    return NextResponse.json(
      {
        message:
          payload?.errors?.[0]?.detail ??
          "PayMongo could not create a checkout session.",
      },
      { status: 502 },
    );
  }

  return NextResponse.redirect(checkoutUrl, 303);
}

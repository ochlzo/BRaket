import "server-only";

import type { BoostPlan } from "@/lib/content/boost-plans";

const PAYMONGO_CHECKOUT_URL = "https://api.paymongo.com/v1/checkout_sessions";

export type PaymongoCheckoutSession = {
  id: string;
  attributes: {
    paid_at?: number | null;
    payment_intent?: {
      id?: string;
    } | null;
    payments?: Array<{
      id: string;
      attributes?: {
        paid_at?: number | null;
        payment_intent_id?: string | null;
        status?: string;
      };
    }>;
  };
};

type CreateCheckoutSessionInput = {
  cancelUrl: string;
  plan: BoostPlan;
  referenceNumber: string;
  successUrl: string;
};

function getPaymongoAuthHeader() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY?.trim();

  if (!secretKey) {
    return null;
  }

  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

async function readPaymongoResponse(response: Response) {
  return (await response.json().catch(() => null)) as {
    data?: PaymongoCheckoutSession & {
      attributes?: PaymongoCheckoutSession["attributes"] & {
        checkout_url?: string;
      };
    };
    errors?: Array<{ detail?: string }>;
  } | null;
}

export async function createPaymongoCheckoutSession({
  cancelUrl,
  plan,
  referenceNumber,
  successUrl,
}: CreateCheckoutSessionInput) {
  const authorization = getPaymongoAuthHeader();

  if (!authorization) {
    throw new Error("PayMongo secret key is not configured.");
  }

  const paymentDescription = `BRaket boost payment for ${plan.name}`;
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
  const payload = await readPaymongoResponse(response);
  const checkoutUrl = payload?.data?.attributes?.checkout_url;
  const checkoutSessionId = payload?.data?.id;

  if (!response.ok || !checkoutUrl || !checkoutSessionId) {
    throw new Error(
      payload?.errors?.[0]?.detail ??
        "PayMongo could not create a checkout session.",
    );
  }

  return { checkoutSessionId, checkoutUrl };
}

export async function retrievePaymongoCheckoutSession(checkoutSessionId: string) {
  const authorization = getPaymongoAuthHeader();

  if (!authorization) {
    throw new Error("PayMongo secret key is not configured.");
  }

  const response = await fetch(`${PAYMONGO_CHECKOUT_URL}/${checkoutSessionId}`, {
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
  });
  const payload = await readPaymongoResponse(response);

  if (!response.ok || !payload?.data) {
    throw new Error(
      payload?.errors?.[0]?.detail ??
        "PayMongo could not retrieve the checkout session.",
    );
  }

  return payload.data;
}

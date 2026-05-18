const PAYMONGO_API_BASE = "https://api.paymongo.com/v1";

function getPayMongoAuthHeader() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing PAYMONGO_SECRET_KEY");
  }

  const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

  return `Basic ${encodedKey}`;
}

export async function createPayMongoCheckoutSession(params: {
  amount: number;
  currency?: "PHP";
  description: string;
  lineItemName: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const {
    amount,
    currency = "PHP",
    description,
    lineItemName,
    quantity = 1,
    successUrl,
    cancelUrl,
    metadata = {},
  } = params;

  const response = await fetch(`${PAYMONGO_API_BASE}/checkout_sessions`, {
    method: "POST",
    headers: {
      Authorization: getPayMongoAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description,
          line_items: [
            {
              currency,
              amount,
              name: lineItemName,
              quantity,
            },
          ],
          payment_method_types: [
            "card",
            "gcash",
            "paymaya",
            "grab_pay",
          ],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata,
        },
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("PayMongo checkout error:", result);
    throw new Error("Failed to create PayMongo checkout session");
  }

  return result.data;
}
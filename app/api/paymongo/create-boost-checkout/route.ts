import { NextResponse } from "next/server";
import { createPayMongoCheckoutSession } from "@/lib/paymongo";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      boostSubscriptionId,
      serviceListingId,
      boostPlanName,
      amount,
    } = body;

    if (!boostSubscriptionId || !serviceListingId || !boostPlanName || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await createPayMongoCheckoutSession({
      amount,
      description: `BRaket boost payment for ${boostPlanName}`,
      lineItemName: boostPlanName,
      successUrl: `${appUrl}/client/payments/success?type=boost&id=${boostSubscriptionId}`,
      cancelUrl: `${appUrl}/client/payments/cancel?type=boost&id=${boostSubscriptionId}`,
      metadata: {
        payment_type: "boost_subscription",
        boost_subscription_id: boostSubscriptionId,
        service_listing_id: serviceListingId,
      },
    });

    await prisma.$executeRaw`
        update public.boost_subscriptions
        set
            paymongo_checkout_session_id = ${checkoutSession.id},
            payment_status = 'pending',
            status = 'pending_payment'
        where boost_subs_id = ${boostSubscriptionId}
    `;

    return NextResponse.json({
      checkoutUrl: checkoutSession.attributes.checkout_url,
      checkoutSessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Unable to create boost checkout:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
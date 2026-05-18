import { NextResponse } from "next/server";

import { getBoostPlan } from "@/lib/content/boost-plans";
import {
  attachCheckoutSessionToBoost,
  createPendingBoost,
  getTalentProfileIdForUser,
} from "@/server/boosts/boost";
import { createPaymongoCheckoutSession } from "@/server/paymongo/client";
import { getCurrentAppUser } from "@/server/users/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function POST(request: Request) {
  const formData = await request.formData();
  const planSlug = String(formData.get("plan") ?? "");
  const plan = getBoostPlan(planSlug);

  if (!plan) {
    return NextResponse.json(
      { message: "Choose a valid boost plan." },
      { status: 400 },
    );
  }

  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  if (!currentUser.isTalent) {
    return NextResponse.redirect(
      new URL("/onboarding/talent", request.url),
      303,
    );
  }

  const talentProfileId = await getTalentProfileIdForUser(currentUser.id);

  if (!talentProfileId) {
    return NextResponse.redirect(
      new URL("/onboarding/talent", request.url),
      303,
    );
  }

  const boostId = await createPendingBoost({
    plan,
    talentProfileId,
  });

  if (!boostId) {
    return NextResponse.json(
      { message: "Could not create a boost record." },
      { status: 500 },
    );
  }

  const baseUrl = getBaseUrl(request);
  const referenceNumber = `braket-${plan.slug}-${Date.now()}`;
  const successUrl = `${baseUrl}/boost/success?boost=${boostId}&plan=${plan.slug}&ref=${referenceNumber}`;
  const cancelUrl = `${baseUrl}/boost/cancel?boost=${boostId}&plan=${plan.slug}&ref=${referenceNumber}`;

  try {
    const { checkoutSessionId, checkoutUrl } =
      await createPaymongoCheckoutSession({
        cancelUrl,
        plan,
        referenceNumber,
        successUrl,
      });

    await attachCheckoutSessionToBoost({
      checkoutSessionId,
      boostId,
    });

    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("PayMongo checkout creation failed.", error);
    const message =
      error instanceof Error
        ? error.message
        : "PayMongo could not create a checkout session.";

    return NextResponse.json(
      { message },
      { status: 502 },
    );
  }
}

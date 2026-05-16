import { NextResponse, type NextRequest } from "next/server";

import { acceptBookingByResponseToken } from "@/server/bookings/responses";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;

  const result = await acceptBookingByResponseToken(token);

  if (!result.ok) {
    const error = result.code === "not-talent" ? "not-talent" : "answered";

    return NextResponse.redirect(
      new URL(`/bookings/respond/${token}?error=${error}`, request.url),
    );
  }

  return NextResponse.redirect(
    new URL(`/bookings/respond/${token}/accepted`, request.url),
  );
}

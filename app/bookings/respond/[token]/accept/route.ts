import { NextResponse, type NextRequest } from "next/server";

import { acceptBookingByResponseToken } from "@/server/bookings/responses";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;

  await acceptBookingByResponseToken(token);

  return NextResponse.redirect(
    new URL(`/bookings/respond/${token}/accepted`, request.url),
  );
}

import { type NextRequest, NextResponse } from "next/server";
// import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // return updateSession(request);
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

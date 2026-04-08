export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    vercelRegion: process.env.VERCEL_REGION ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}


import "dotenv/config";

function getProjectRefFromUrl(url) {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    // Typical Supabase URL: https://<project-ref>.supabase.co
    const match = hostname.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "Missing SUPABASE_ACCESS_TOKEN. Create a Supabase personal access token and set it in your .env.",
    );
  }

  const projectRef =
    process.env.SUPABASE_PROJECT_REF ??
    getProjectRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!projectRef) {
    throw new Error(
      "Missing SUPABASE_PROJECT_REF (or NEXT_PUBLIC_SUPABASE_URL). Set SUPABASE_PROJECT_REF in your .env, or ensure NEXT_PUBLIC_SUPABASE_URL is like https://<ref>.supabase.co",
    );
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Supabase API error (${res.status} ${res.statusText}). ${body ? `Body: ${body}` : ""}`.trim(),
    );
  }

  const project = await res.json();

  const region =
    project?.region ??
    project?.region_id ??
    project?.region_name ??
    project?.db?.region ??
    project?.db?.region_id ??
    null;

  if (region) {
    process.stdout.write(String(region));
    process.stdout.write("\n");
    return;
  }

  // Fallback: print the whole object so you can see which field exists in your API version.
  process.stdout.write(JSON.stringify(project, null, 2));
  process.stdout.write("\n");
}

main().catch((err) => {
  process.stderr.write(`${err?.message ?? String(err)}\n`);
  process.exitCode = 1;
});


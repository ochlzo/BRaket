import { redirect } from "next/navigation";

type LegacyCancelPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    }
  }

  return query.toString();
}

export default async function LegacySubscriptionsCancelPage({
  searchParams,
}: LegacyCancelPageProps) {
  const queryString = toQueryString(await searchParams);

  redirect(queryString ? `/boost/cancel?${queryString}` : "/boost/cancel");
}

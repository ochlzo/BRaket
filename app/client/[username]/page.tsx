import { notFound } from "next/navigation";
import Link from "next/link";

import { PublicClientProfileBody } from "@/app/client/[username]/_components/public-client-profile-body";
import { PublicClientProfileHero } from "@/app/client/[username]/_components/public-client-profile-hero";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getPublicClientProfilePageData } from "@/server/client-profile/get-client-profile";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ returnTo?: string }>;
};

function safeReturnTo(value: string | undefined) {
  if (!value || !value.startsWith("/")) {
    return "/browse";
  }

  if (value.startsWith("//")) {
    return "/browse";
  }

  return value;
}

export default async function PublicClientProfilePage({
  params,
  searchParams,
}: Props) {
  const { username } = await params;
  const { returnTo } = await searchParams;
  const profile = await getPublicClientProfilePageData(username);

  if (!profile) {
    notFound();
  }

  return (
    <PageShell
      activeHref="/browse"
      className="bg-[color:var(--surface)]"
      ctaHref="/browse"
      ctaLabel="Browse Talents"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            className="inline-flex items-center rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
            href={safeReturnTo(returnTo)}
          >
            Back
          </Link>

          <PublicClientProfileHero profile={profile} />
          <PublicClientProfileBody profile={profile} />
        </div>
      </section>
    </PageShell>
  );
}

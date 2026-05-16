import { notFound } from "next/navigation";
import Link from "next/link";

import { ProfileReviewsPanel } from "@/components/shared/profile-reviews/profile-reviews-panel";
import { ReportButton } from "@/components/shared/moderation/report-button";
import { UserAvatar } from "@/components/shared/user-avatar";
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
      <section className="px-5 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            className="inline-flex items-center rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-[color:var(--surface-alt)]"
            href={safeReturnTo(returnTo)}
          >
            Back
          </Link>

          <section className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-surface-soft)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <UserAvatar
                alt={profile.displayName}
                className="h-20 w-20 rounded-3xl"
                fallbackClassName="rounded-3xl text-xl font-black"
                imageClassName="rounded-3xl"
                initials={`${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`}
                src={profile.avatarUrl}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Client profile
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-normal text-foreground">
                  {profile.organizationName || profile.displayName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-body)]">
                  {profile.about || "No client bio yet."}
                </p>
                <div className="mt-4">
                  <ReportButton
                    label="Report profile"
                    targetId={profile.userId}
                    targetLabel={`${
                      profile.organizationName || profile.displayName
                    } client profile`}
                    targetPath={`/client/${profile.username}`}
                    targetType="PROFILE"
                  />
                </div>
              </div>
            </div>
          </section>

          <ProfileReviewsPanel
            averageRating={profile.averageRating}
            emptyLabel="No talent reviews yet"
            id="client-reviews"
            reputationLabel={profile.reputationLabel}
            reviews={profile.receivedReviews}
            title="Talent Reviews"
          />
        </div>
      </section>
    </PageShell>
  );
}

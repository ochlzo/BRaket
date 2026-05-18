import Link from "next/link";

import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getBoostPlan } from "@/lib/content/boost-plans";
import { semantic } from "@/lib/theme/semantic";
import { cancelPendingBoost } from "@/server/boosts/boost";

type CancelPageProps = {
  searchParams: Promise<{
    boost?: string;
    plan?: string;
    ref?: string;
  }>;
};

export default async function BoostCancelPage({
  searchParams,
}: CancelPageProps) {
  const params = await searchParams;
  const plan = getBoostPlan(params.plan ?? "");

  if (params.boost) {
    await cancelPendingBoost(params.boost).catch((error) => {
      console.error("Failed to cancel pending boost.", error);
    });
  }

  return (
    <PageShell
      activeHref="/boost"
      ctaHref="/boost"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="bg-[linear-gradient(135deg,var(--tone-orange-soft)_0%,var(--surface)_100%)] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-8 text-center shadow-[var(--shadow-panel-soft)] sm:p-10">
          <p className="typo-label-sm text-[color:var(--brand-orange)]">
            Checkout canceled
          </p>
          <h1 className="typo-section-title-heavy mt-3 text-foreground">
            No payment was completed
          </h1>
          <p className="typo-body-lg mx-auto mt-4 max-w-2xl text-[color:var(--ink-soft)]">
            You can return to the boost plans and start another PayMongo
            checkout.
          </p>

          {plan ? (
            <p className="typo-meta mt-6 text-[color:var(--ink-muted)]">
              Last selected: {plan.name}
              {params.ref ? ` (${params.ref})` : ""}
            </p>
          ) : null}

          <div className="mt-8">
            <Link className={semantic.button.brandOrange} href="/boost">
              Back to Boost
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import Link from "next/link";

import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import {
  formatBoostPlanPrice,
  getBoostPlan,
} from "@/lib/content/boost-plans";
import { semantic } from "@/lib/theme/semantic";
import { syncBoostFromPaymongo } from "@/server/boosts/boost";

type SuccessPageProps = {
  searchParams: Promise<{
    boost?: string;
    plan?: string;
    ref?: string;
  }>;
};

export default async function BoostSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const plan = getBoostPlan(params.plan ?? "");
  const activeBoost = params.boost
    ? await syncBoostFromPaymongo(params.boost).catch((error) => {
        console.error("PayMongo success reconciliation failed.", error);

        return null;
      })
    : null;

  return (
    <PageShell
      activeHref="/boost"
      ctaHref="/boost"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="bg-[linear-gradient(135deg,var(--tone-green-soft)_0%,var(--surface)_100%)] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-8 text-center shadow-[var(--shadow-panel-soft)] sm:p-10">
          <p className="typo-label-sm text-[color:var(--tone-green-base)]">
            {activeBoost ? "Boost activated" : "Payment submitted"}
          </p>
          <h1 className="typo-section-title-heavy mt-3 text-foreground">
            Checkout completed
          </h1>
          <p className="typo-body-lg mx-auto mt-4 max-w-2xl text-[color:var(--ink-soft)]">
            {activeBoost
              ? "Your talent profile now shows the active boost label."
              : "The boost activates once PayMongo confirms the payment."}
          </p>

          {plan ? (
            <div className="mt-8 rounded-[1.25rem] bg-[color:var(--surface-alt)] p-5 text-left">
              <p className="typo-label-sm text-foreground">{plan.name}</p>
              <p className="typo-body mt-1 text-[color:var(--ink-body)]">
                {formatBoostPlanPrice(plan)} for {plan.durationDays} days
              </p>
              {params.ref ? (
                <p className="typo-meta mt-3 break-all text-[color:var(--ink-muted)]">
                  Reference: {params.ref}
                </p>
              ) : null}
              {activeBoost ? (
                <p className="typo-meta mt-3 text-[color:var(--tone-green-deep)]">
                  Active until{" "}
                  {new Date(activeBoost.expiresAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className={semantic.button.brandOrange} href="/dashboard/talent/profile">
              Go to Profile
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import { CheckCircle2Icon, CreditCardIcon, SparklesIcon } from "lucide-react";

import { PageShell } from "@/components/shared/layout/page-shell";
import {
  formatBoostPlanPrice,
  boostPlans,
} from "@/lib/content/boost-plans";
import { appNavigation } from "@/lib/content/navigation";
import { semantic } from "@/lib/theme/semantic";
import { toneStyles, type ToneName } from "@/lib/theme/tailwind";
import {
  getActiveBoostForTalentProfile,
  getTalentProfileIdForUser,
} from "@/server/boosts/boost";
import { getCurrentAppUser } from "@/server/users/current-user";

const planTones: ToneName[] = ["orange", "indigo", "green"];

async function getCurrentBoostSlug() {
  const user = await getCurrentAppUser();

  if (!user?.isTalent) {
    return null;
  }

  const talentProfileId = await getTalentProfileIdForUser(user.id);

  if (!talentProfileId) {
    return null;
  }

  const activeBoost = await getActiveBoostForTalentProfile(talentProfileId);

  return activeBoost?.slug ?? null;
}

export default async function BoostPage() {
  const activeBoostSlug = await getCurrentBoostSlug();

  return (
    <PageShell
      activeHref="/boost"
      ctaHref="/boost"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="bg-[linear-gradient(135deg,var(--tone-orange-soft)_0%,var(--surface)_52%,var(--tone-indigo-soft)_100%)] px-5 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--ink-body)]">
              <SparklesIcon aria-hidden="true" className="h-4 w-4 text-[color:var(--brand-orange)]" />
              PayMongo checkout
            </div>
            <h1 className="typo-page-title mt-6 text-foreground">
              Profile <span className="text-[color:var(--brand-orange)]">Boost</span>
            </h1>
            <p className="typo-body-xl mt-6 max-w-3xl text-[color:var(--ink-soft)]">
              Choose a boost plan to promote your talent profile, show your
              active boost label, and move higher in browse results.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-panel-soft)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-base)]">
                <CreditCardIcon aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <p className="typo-label-sm text-foreground">Secure checkout</p>
                <p className="typo-meta text-[color:var(--ink-muted)]">
                  Pay with PayMongo and activate your profile boost after confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {boostPlans.map((plan, index) => {
            const tone = toneStyles[planTones[index] ?? "sky"];
            const isActivePlan = plan.slug === activeBoostSlug;

            return (
              <article
                key={plan.slug}
                className={`${tone.card} flex h-full flex-col rounded-[1.75rem] border p-8 shadow-[var(--shadow-panel-soft)] transition ${
                  isActivePlan
                    ? "border-[color:var(--brand-orange)] ring-2 ring-[color:var(--brand-orange)]/25"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`typo-label-sm ${tone.text}`}>
                      {plan.durationDays} days
                    </p>
                    <h2 className="typo-card-title-2xl mt-2 text-foreground">
                      {plan.name}
                    </h2>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface)] px-3 py-1.5 text-sm font-bold ${
                      isActivePlan
                        ? "text-[color:var(--brand-orange)]"
                        : "text-foreground"
                    }`}
                  >
                    {isActivePlan ? (
                      <SparklesIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : null}
                    {isActivePlan ? "Active" : "Boost"}
                  </div>
                </div>

                <p className="typo-body mt-4 text-[color:var(--ink-body)]">
                  {plan.description}
                </p>

                <div className="mt-7">
                  <p className="text-4xl font-bold text-foreground">
                    {formatBoostPlanPrice(plan)}
                  </p>
                </div>

                <ul className="mt-7 grid gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="typo-meta flex items-center gap-3 text-[color:var(--ink-body)]"
                    >
                      <CheckCircle2Icon
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${tone.text}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <form
                  action="/api/paymongo/checkout"
                  className="mt-8"
                  method="post"
                >
                  <input name="plan" type="hidden" value={plan.slug} />
                  <button
                    className={`${semantic.button.outlineNeutralStrong} w-full bg-[color:var(--surface)] disabled:cursor-not-allowed disabled:opacity-70`}
                    disabled={isActivePlan}
                    type="submit"
                  >
                    {isActivePlan ? "Current Boost" : "Select Plan"}
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

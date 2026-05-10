import { FeatureCard } from "@/components/shared/marketing/feature-card";
import { semantic } from "@/lib/theme/semantic";

import { homeFeatureCards } from "@/app/_home/home-data";

export function HomeFeaturesSection() {
  return (
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="typo-section-title text-foreground">
              Everything you need to find talent with confidence
            </h2>
            <p className="typo-body-lg mt-4 text-[color:var(--ink-muted)]">
              We provide end-to-end support throughout your project journey,
              from discovery to final delivery.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {homeFeatureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

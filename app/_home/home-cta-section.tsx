import { CtaBanner } from "@/components/shared/marketing/cta-banner";

export function HomeCtaSection() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8" id="cta">
      <div className="mx-auto max-w-5xl">
        <CtaBanner
          description="Join hundreds of BU students already building income, experience, and stronger portfolios on BRaket."
          gradientClassName="bg-[linear-gradient(90deg,var(--tone-orange-base)_0%,var(--brand-blue)_100%)]"
          primaryAction={{
            href: "/signup",
            label: "Get Started Today",
            variant: "whiteOrange",
          }}
          secondaryAction={{
            href: "/how-it-works",
            label: "Learn More",
            variant: "outlineWhite",
          }}
          title="Ready to start your journey?"
        />
      </div>
    </section>
  );
}

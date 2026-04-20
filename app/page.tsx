"use client";

import { useSyncExternalStore } from "react";

import { HomeCategoriesSection } from "@/app/_home/home-categories-section";
import { HomeCtaSection } from "@/app/_home/home-cta-section";
import { HomeFeaturesSection } from "@/app/_home/home-features-section";
import { HomeHeroSection } from "@/app/_home/home-hero-section";
import { HomeJourneySection } from "@/app/_home/home-journey-section";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";

export default function Home() {
  const isLoggedIn = useSyncExternalStore(
    () => () => {},
    () => !!localStorage.getItem("braket_session"),
    () => false,
  );

  return (
    <PageShell
      activeHref="#top"
      ctaHref="#journey"
      homeHref="#top"
      items={appNavigation}
      signInHref="#categories"
    >
      <HomeHeroSection />
      <HomeJourneySection />
      <HomeCategoriesSection />
      <HomeFeaturesSection />
      {!isLoggedIn ? <HomeCtaSection /> : null}
    </PageShell>
  );
}

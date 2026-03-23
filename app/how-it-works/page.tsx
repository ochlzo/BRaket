"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { ProcessStepCard } from "@/components/marketing/process-step-card";
import {
  BriefcaseIcon,
  SearchIcon,
  StarOutlineIcon,
  UserCheckIcon,
} from "@/components/icons/marketing-icons";
import { appNavigation } from "@/content/navigation";
import { semantic } from "@/theme/semantic";

const clientSteps = [
  {
    description:
      "Explore our directory of verified BU student talents. Use filters to find the right match for your project.",
    icon: <SearchIcon className="h-7 w-7" />,
    title: "Browse & Search",
    tone: "indigo" as const,
  },
  {
    description:
      "Check portfolios, ratings, and reviews. View previous work and client feedback before deciding.",
    icon: <UserCheckIcon />,
    title: "Review Profiles",
    tone: "orange" as const,
  },
  {
    description:
      "Contact your chosen talent, discuss project details, and align on terms to get the work moving.",
    icon: <BriefcaseIcon className="h-7 w-7" />,
    title: "Hire & Collaborate",
    tone: "green" as const,
  },
  {
    description:
      "After project completion, leave a review and rating to help others discover great talents.",
    icon: <StarOutlineIcon />,
    title: "Review & Rate",
    tone: "purple" as const,
  },
];

const talentSteps = [
  {
    description:
      "Sign up with your BU email and create a professional profile showcasing your skills and experience.",
    icon: <UserCheckIcon />,
    title: "Create Profile",
    tone: "amber" as const,
  },
  {
    description:
      "Upload your best work, add descriptions, and highlight your achievements to attract potential clients.",
    icon: <BriefcaseIcon className="h-7 w-7" />,
    title: "Build Portfolio",
    tone: "indigo" as const,
  },
  {
    description:
      "Clients find you through search and browse. Respond to inquiries and proposals promptly.",
    icon: <SearchIcon className="h-7 w-7" />,
    title: "Get Discovered",
    tone: "pink" as const,
  },
  {
    description:
      "Complete projects, earn money, and build your reputation while growing your skills over time.",
    icon: <StarOutlineIcon />,
    title: "Earn & Grow",
    tone: "green" as const,
  },
];

const features = [
  {
    description:
      "All users are verified BU students, ensuring a trusted and safer community.",
    title: "Verified Students Only",
  },
  {
    description:
      "Clear hourly rates and project costs so both sides know what to expect.",
    title: "Transparent Pricing",
  },
  {
    description:
      "Reliable transaction flows that protect both clients and student talents.",
    title: "Secure Payments",
  },
  {
    description:
      "Build trust through ratings, reviews, and verified work history.",
    title: "Reputation System",
  },
  {
    description:
      "Display your strongest work and attract the clients you want to work with.",
    title: "Portfolio Showcase",
  },
  {
    description:
      "Access resources, tips, and support from fellow students and collaborators.",
    title: "Community Support",
  },
];

export default function HowItWorksPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("braket_session"));
  }, []);

  return (
    <PageShell
      activeHref="/how-it-works"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <section className="bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,var(--tone-purple-soft)_100%)] px-5 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="typo-page-title text-foreground">
            How <span className="text-[color:var(--brand-orange)]">BRaket</span> Works
          </h1>
          <p className="typo-body-xl mx-auto mt-6 max-w-3xl text-[color:var(--ink-soft)]">
            A simple, transparent process for connecting BU students with real opportunities.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="typo-section-title-heavy text-foreground">
              For <span className="text-[color:var(--brand-indigo)]">Clients</span>
            </h2>
            <p className="typo-body-xl mx-auto mt-4 max-w-2xl text-[color:var(--ink-soft)]">
              Find and hire talented BU students in four simple steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {clientSteps.map((step, index) => (
              <ProcessStepCard
                key={step.title}
                description={step.description}
                icon={step.icon}
                showConnector={index < clientSteps.length - 1}
                step={index + 1}
                title={step.title}
                tone={step.tone}
                variant="filled"
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a className={semantic.button.brandIndigoLg} href="/browse">
              Start Browsing Talents
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,var(--tone-orange-soft)_0%,var(--tone-indigo-soft)_100%)] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="typo-section-title-heavy text-foreground">
              For <span className="text-[color:var(--brand-orange)]">Talents</span>
            </h2>
            <p className="typo-body-xl mx-auto mt-4 max-w-2xl text-[color:var(--ink-soft)]">
              Start earning and building your portfolio in four easy steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {talentSteps.map((step, index) => (
              <ProcessStepCard
                key={step.title}
                description={step.description}
                icon={step.icon}
                showConnector={index < talentSteps.length - 1}
                step={index + 1}
                title={step.title}
                tone={step.tone}
                variant="surface"
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link className={semantic.button.brandOrangeLg} href="/#cta">
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="typo-section-title-heavy text-foreground">
              Platform <span className="text-[color:var(--brand-indigo)]">Features</span>
            </h2>
            <p className="typo-body-xl mx-auto mt-4 max-w-2xl text-[color:var(--ink-soft)]">
              Everything you need for successful collaboration.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.5rem] border border-[color:var(--line-strong)] bg-[linear-gradient(135deg,var(--surface-alt)_0%,#FFFFFF_100%)] p-6 transition duration-200 hover:shadow-[0_18px_40px_rgba(35,46,66,0.08)]"
              >
                <h3 className="typo-card-title-lg text-foreground">{feature.title}</h3>
                <p className="typo-body mt-2 text-[color:var(--ink-soft)]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(!mounted || !isLoggedIn) && (
        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <CtaBanner
              description="Join the BRaket community today and unlock new opportunities."
              gradientClassName="bg-[linear-gradient(90deg,var(--brand-orange)_0%,var(--brand-indigo)_100%)]"
              primaryAction={{ href: "/signup", label: "Sign Up Now", variant: "whiteOrange" }}
              secondaryAction={{ href: "/#top", label: "Learn More", variant: "outlineWhite" }}
              title="Ready to get started?"
            />
          </div>
        </section>
      )}
    </PageShell>
  );
}

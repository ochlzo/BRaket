"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

import { CategoryCard } from "@/components/shared/marketing/category-card";
import { CtaBanner } from "@/components/shared/marketing/cta-banner";
import { FeatureCard } from "@/components/shared/marketing/feature-card";
import {
  CameraIcon,
  CodeIcon,
  PaletteIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/shared/icons/marketing-icons";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { semantic } from "@/lib/theme/semantic";

const categories = [
  {
    description:
      "Frontend, backend, and full-stack students ready to ship real projects.",
    icon: <CodeIcon />,
    title: "Web Development",
    tone: "sky" as const,
  },
  {
    description:
      "Branding, social visuals, posters, and polished creative assets.",
    icon: <PaletteIcon />,
    title: "Graphic Design",
    tone: "orange" as const,
  },
  {
    description:
      "Event, portrait, and product photographers for local campaigns and shoots.",
    icon: <CameraIcon />,
    title: "Photography",
    tone: "teal" as const,
  },
  {
    description:
      "Editors for reels, explainers, promos, and high-retention content.",
    icon: <VideoIcon />,
    title: "Video Editing",
    tone: "orange" as const,
  },
];

const featureCards = [
  {
    accent: <ShieldIcon />,
    decor: (
      <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-6 translate-y-6 rotate-12 rounded-tl-[3.5rem] bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-blue-strong)] opacity-25" />
    ),
    description:
      "Every profile is tied to real BU students, with portfolios reviewed before they are surfaced to clients.",
    label: "Insulator",
    title: "Verified Student Talents",
    tone: "sky" as const,
  },
  {
    accent: <PaletteIcon />,
    decor: (
      <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
        <div className="absolute inset-0 -rotate-12 rounded-[1.6rem] bg-white shadow-lg" />
        <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-6 rounded-[1.6rem] bg-[color:var(--tone-orange-base)]" />
      </div>
    ),
    description:
      "Clients can scan work samples, compare specialties, and shortlist top students with confidence.",
    label: "Compass",
    title: "Digital Portfolio & Reviews",
    tone: "orange" as const,
  },
  {
    accent: <ShieldIcon />,
    decor: (
      <div className="absolute bottom-0 right-0 h-36 w-36 translate-x-10 translate-y-10 rounded-full bg-gradient-to-br from-[color:var(--tone-orange-base)] to-[color:var(--tone-orange-deep)] opacity-20" />
    ),
    description:
      "Transparent project handoff, milestone visibility, and reputation signals protect both sides of the work.",
    label: "Navigator",
    title: "Secure Commission System",
    tone: "orange" as const,
  },
  {
    accent: <UsersIcon />,
    decor: (
      <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
        <div className="absolute inset-0 rounded-[1.6rem] bg-white shadow-lg" />
        <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-12 rounded-[1.6rem] bg-[color:var(--brand-blue)]" />
      </div>
    ),
    description:
      "Support local student talent and tap into a growing network of makers, designers, and developers.",
    label: "Compass",
    title: "BU Student Community",
    tone: "teal" as const,
  },
];

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
      <section
        className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36"
        id="top"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,var(--surface)_48%,var(--tone-orange-pale)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-8">
            <div className="typo-label-sm inline-flex items-center rounded-full bg-[color:var(--tone-sky-soft)] px-4 py-2 text-[color:var(--tone-sky-deep)]">
              <span className="mr-2 text-xs uppercase tracking-[0.18em]">
                🎓
              </span>
              For BU Students, By BU Students
            </div>
            <div className="space-y-5">
              <h1 className="typo-hero max-w-xl text-foreground">
                Discover talent.
                <br />
                <span className="br-gradient-text">Unlock potential.</span>
              </h1>
              <p className="typo-body-lg max-w-2xl text-[color:var(--ink-muted)]">
                BRaket connects Bicol University students with opportunities to
                showcase their skills, build portfolios, and earn through
                commission-based projects.
              </p>
            </div>
            <div className="typo-label-sm flex items-center gap-2 text-[color:var(--ink-body)]">
              <div className="flex items-center gap-1 text-[color:var(--tone-orange-base)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
              <span>4.9/5 from 500+ reviews</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <a className={semantic.button.brandBlue} href="/browse">
                Browse Talents
                <span className="ml-3">
                  <SearchIcon />
                </span>
              </a>
              <a
                className={semantic.button.outlineNeutralStrong}
                href="/onboarding/talent"
              >
                I&apos;m a Talent
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[
                  "from-[color:var(--tone-orange-base)] to-[color:var(--brand-orange-peach)]",
                  "from-[color:var(--brand-blue)] to-[color:var(--brand-blue-light)]",
                  "from-[color:var(--brand-orange-warm)] to-[color:var(--brand-blue)]",
                  "from-[color:var(--brand-blue)] to-[color:var(--tone-orange-base)]",
                ].map((gradient, index) => (
                  <div
                    key={index}
                    className={`h-11 w-11 rounded-full border-2 border-white bg-gradient-to-br ${gradient}`}
                  />
                ))}
              </div>
              <p className="typo-meta text-[color:var(--ink-muted)]">
                <span className="typo-label-sm text-foreground">
                  500+ students
                </span>{" "}
                already earning
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-[color:var(--brand-blue)]/12 blur-2xl" />
            <div className="absolute -bottom-8 right-0 h-36 w-36 rounded-full bg-[color:var(--tone-orange-base)]/12 blur-3xl" />
            <div className="br-hero-shadow relative overflow-hidden rounded-[2rem] bg-white p-3">
              <Image
                alt="Bicol University students collaborating together"
                className="h-[28rem] w-full rounded-[1.5rem] object-cover sm:h-[34rem]"
                height={1360}
                src="/images/hero_students.png"
                width={1080}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[color:var(--surface-soft)] px-5 py-20 sm:px-6 lg:px-8"
        id="journey"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[80px] border-[color:var(--surface-ring-soft)] opacity-60" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="typo-section-title max-w-3xl leading-tight text-foreground">
                Whether you&apos;re hiring for a product, campaign, event, or a
                fresh idea,
                <span className="text-[color:var(--tone-orange-base)]">
                  {" "}
                  we provide expert guidance{" "}
                </span>
                in discovery, matching, and delivery.
              </h2>
              <a className={semantic.button.brandBlue} href="/browse">
                View Our Cases
              </a>
            </div>
            <div className="inline-block rounded-[2rem] bg-white px-8 py-8 shadow-[var(--shadow-surface-warm)]">
              <p className="typo-meta mb-3 leading-6 text-[color:var(--ink-muted)]">
                We support you through every step of
                <br />
                your relocation journey
              </p>
              <div className="typo-stat text-foreground">1378+</div>
              <p className="typo-meta mt-2 text-[color:var(--ink-muted)]">
                Clients relocated successfully
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-[var(--shadow-panel-elevated)]">
              <Image
                alt="Student speaking on a video call"
                className="aspect-square w-full rounded-[1.5rem] object-cover"
                height={1080}
                src="/images/student_video_call.png"
                width={1080}
              />
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-white p-2 pt-8 shadow-[var(--shadow-panel-elevated)]">
              <Image
                alt="Happy clients celebrating together"
                className="aspect-square w-full rounded-[1.5rem] object-cover"
                height={1080}
                src="/images/team_celebration.png"
                width={1080}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8" id="categories">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="typo-section-title text-foreground">
              Browse by{" "}
              <span className="text-[color:var(--tone-orange-base)]">
                Category
              </span>
            </h2>
            <p className="typo-body-lg mt-4 text-[color:var(--ink-muted)]">
              Find the right student talent for your project across technical,
              visual, and creative disciplines.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.title} href="/browse" {...category} />
            ))}
          </div>
        </div>
      </section>

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
            <a className={semantic.button.brandBlueMd} href="/post-project">
              Start a Project
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {!isLoggedIn && (
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
      )}
    </PageShell>
  );
}

import Image from "next/image";

import {
  SearchIcon,
  StarIcon,
} from "@/components/shared/icons/marketing-icons";
import { semantic } from "@/lib/theme/semantic";

const heroGradients = [
  "from-[color:var(--tone-orange-base)] to-[color:var(--brand-orange-peach)]",
  "from-[color:var(--brand-blue)] to-[color:var(--brand-blue-light)]",
  "from-[color:var(--brand-orange-warm)] to-[color:var(--brand-blue)]",
  "from-[color:var(--brand-blue)] to-[color:var(--tone-orange-base)]",
];

export function HomeHeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36"
      id="top"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,var(--surface)_48%,var(--tone-orange-pale)_100%)]" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="space-y-8">
          <div className="typo-label-sm inline-flex items-center rounded-full bg-[color:var(--tone-sky-soft)] px-4 py-2 text-[color:var(--tone-sky-deep)]">
            <span className="mr-2 text-xs uppercase tracking-[0.18em]">🎓</span>
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
              {heroGradients.map((gradient, index) => (
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
              loading="eager"
              src="/images/hero_students.png"
              width={1080}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

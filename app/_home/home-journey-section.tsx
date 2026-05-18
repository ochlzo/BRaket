import Image from "next/image";

import { semantic } from "@/lib/theme/semantic";

export function HomeJourneySection() {
  return (
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
                BRaket helps you find verified student talent{" "}
              </span>
              for discovery, matching, and project delivery.
            </h2>
            <a className={semantic.button.brandBlue} href="/browse">
              Browse Talent
            </a>
          </div>
          <div className="inline-block rounded-[2rem] bg-white px-8 py-8 shadow-[var(--shadow-surface-warm)]">
            <p className="typo-meta mb-3 leading-6 text-[color:var(--ink-muted)]">
              We support you through every step of
              <br />
              your project journey
            </p>
            <div className="typo-stat text-foreground">1378+</div>
            <p className="typo-meta mt-2 text-[color:var(--ink-muted)]">
              Student-led projects completed
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
  );
}

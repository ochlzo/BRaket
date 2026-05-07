import { benefitCards } from "@/app/post-project/_data";

export function PostProjectBenefitsSection() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="typo-section-title mb-3 text-center text-foreground">
          Why post on{" "}
          <span className="bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] bg-clip-text text-transparent">
            BRaket
          </span>
          ?
        </h2>
        <p className="typo-body-lg mx-auto mb-12 max-w-2xl text-center text-[color:var(--ink-muted)]">
          Access a growing pool of verified student talent ready to work on your
          projects.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefitCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-xl transition-transform group-hover:scale-110`}
              >
                {card.icon}
              </div>
              <h3 className="typo-card-title-lg text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { processSteps } from "@/app/post-project/_data";

export function PostProjectProcessSection() {
  return (
    <section className="bg-[color:var(--surface-alt)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="typo-section-title mb-3 text-foreground">
          How it{" "}
          <span className="bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] bg-clip-text text-transparent">
            works
          </span>
        </h2>
        <p className="typo-body mx-auto mb-12 max-w-lg text-[color:var(--ink-muted)]">
          From posting to delivery, we make commissioning student talent
          effortless.
        </p>

        <div className="grid gap-8 sm:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={step.num} className="group relative">
              {index < processSteps.length - 1 ? (
                <div className="absolute right-0 top-14 hidden h-px w-[calc(50%-16px)] translate-x-[calc(100%-8px)] bg-gradient-to-r from-[color:var(--brand-orange)]/20 to-[color:var(--brand-orange)]/5 sm:block" />
              ) : null}
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] text-2xl shadow-lg shadow-[color:var(--brand-orange)]/20 transition-transform group-hover:scale-110">
                  {step.emoji}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[color:var(--brand-orange)] ring-2 ring-[color:var(--brand-orange)]/20">
                    {step.num}
                  </span>
                </div>
                <h3 className="typo-card-title-lg text-foreground">
                  {step.title}
                </h3>
                <p className="max-w-[250px] text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

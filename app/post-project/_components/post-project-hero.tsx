import { BriefcaseIcon } from "@/app/post-project/_components/post-project-icons";

export function PostProjectHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[color:var(--brand-orange)] via-[color:var(--brand-orange-warm)] to-[color:var(--brand-orange-light)]" />
      <div className="absolute -bottom-10 -left-16 z-0 h-72 w-72 rounded-full bg-white/[0.07]" />
      <div className="absolute -right-12 top-16 z-0 h-64 w-64 rounded-full bg-white/[0.05]" />
      <div className="absolute left-1/2 top-1/3 z-0 h-52 w-52 -translate-x-1/2 rounded-full bg-[color:var(--brand-orange-light)]/30 blur-3xl" />
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--overlay-grid-line-medium) 1px, transparent 1px), linear-gradient(90deg, var(--overlay-grid-line-medium) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
          <BriefcaseIcon className="size-4" />
          Post a Commission
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.5rem]">
          Don&apos;t see what you&apos;re
          <br className="hidden sm:block" />
          looking for?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
          Post your project requirements and get custom proposals from talented
          BU students.
        </p>
      </div>
    </section>
  );
}

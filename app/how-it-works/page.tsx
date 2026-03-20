const clientSteps = [
  {
    title: "Browse & Search",
    description:
      "Explore our directory of verified BU student talents. Use filters to find the right match for your project.",
    bgClassName: "bg-[#DBEAFE]",
    iconClassName: "text-[#4F46E5]",
    icon: <SearchIcon />,
  },
  {
    title: "Review Profiles",
    description:
      "Check portfolios, ratings, and reviews. View previous work and client feedback before deciding.",
    bgClassName: "bg-[#FFEDD5]",
    iconClassName: "text-[#FF6B35]",
    icon: <UserCheckIcon />,
  },
  {
    title: "Hire & Collaborate",
    description:
      "Contact your chosen talent, discuss project details, and align on terms to get the work moving.",
    bgClassName: "bg-[#DCFCE7]",
    iconClassName: "text-[#22C55E]",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Review & Rate",
    description:
      "After project completion, leave a review and rating to help others discover great talents.",
    bgClassName: "bg-[#F3E8FF]",
    iconClassName: "text-[#A855F7]",
    icon: <StarOutlineIcon />,
  },
];

const talentSteps = [
  {
    title: "Create Profile",
    description:
      "Sign up with your BU email and create a professional profile showcasing your skills and experience.",
    pillClassName: "bg-[#FEF3C7] text-[#F59E0B]",
    iconClassName: "bg-[#FEF3C7] text-[#F59E0B]",
    icon: <UserCheckIcon />,
  },
  {
    title: "Build Portfolio",
    description:
      "Upload your best work, add descriptions, and highlight your achievements to attract potential clients.",
    pillClassName: "bg-[#E0E7FF] text-[#6366F1]",
    iconClassName: "bg-[#E0E7FF] text-[#6366F1]",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Get Discovered",
    description:
      "Clients find you through search and browse. Respond to inquiries and proposals promptly.",
    pillClassName: "bg-[#FCE7F3] text-[#EC4899]",
    iconClassName: "bg-[#FCE7F3] text-[#EC4899]",
    icon: <SearchIcon />,
  },
  {
    title: "Earn & Grow",
    description:
      "Complete projects, earn money, and build your reputation while growing your skills over time.",
    pillClassName: "bg-[#D1FAE5] text-[#10B981]",
    iconClassName: "bg-[#D1FAE5] text-[#10B981]",
    icon: <StarOutlineIcon />,
  },
];

const features = [
  {
    title: "Verified Students Only",
    description:
      "All users are verified BU students, ensuring a trusted and safer community.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Clear hourly rates and project costs so both sides know what to expect.",
  },
  {
    title: "Secure Payments",
    description:
      "Reliable transaction flows that protect both clients and student talents.",
  },
  {
    title: "Reputation System",
    description:
      "Build trust through ratings, reviews, and verified work history.",
  },
  {
    title: "Portfolio Showcase",
    description:
      "Display your strongest work and attract the clients you want to work with.",
  },
  {
    title: "Community Support",
    description:
      "Access resources, tips, and support from fellow students and collaborators.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F4511E] text-lg font-black text-white">
              B
            </div>
            <span className="text-xl font-extrabold tracking-[-0.02em]">BRaket</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#5B6574] md:flex">
            <a href="/">Home</a>
            <a href="/browse">Browse</a>
            <a href="/services">Services</a>
            <a className="font-semibold text-[#18212F]" href="/how-it-works">
              How it Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/#cta"
              className="hidden rounded-full border border-black/8 px-5 py-2.5 text-sm font-semibold text-[#18212F] transition hover:bg-black/5 md:inline-flex"
            >
              Sign In
            </a>
            <a
              href="/#cta"
              className="inline-flex items-center rounded-full bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F4511E]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[linear-gradient(135deg,#EFF6FF_0%,#F3E8FF_100%)] px-5 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-[#18212F] sm:text-6xl">
              How <span className="text-[#FF6B35]">BRaket</span> Works
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-[#657082]">
              A simple, transparent process for connecting BU students with real opportunities.
            </p>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-[#18212F]">
                For <span className="text-[#4F46E5]">Clients</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-[#657082]">
                Find and hire talented BU students in four simple steps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {clientSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <article className={`${step.bgClassName} h-full rounded-[1.75rem] p-8 transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,42,64,0.12)]`}>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-[#18212F]">
                      {index + 1}
                    </div>
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white ${step.iconClassName}`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold tracking-[-0.03em] text-[#18212F]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#4E5969]">
                      {step.description}
                    </p>
                  </article>
                  {index < clientSteps.length - 1 ? (
                    <div className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 xl:block">
                      <ArrowRightIcon />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="/browse"
                className="inline-flex rounded-full bg-[#4F46E5] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#4338CA]"
              >
                Start Browsing Talents
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#FFEDD5_0%,#DBEAFE_100%)] px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-[#18212F]">
                For <span className="text-[#FF6B35]">Talents</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-[#657082]">
                Start earning and building your portfolio in four easy steps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {talentSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <article className="h-full rounded-[1.75rem] bg-white p-8 shadow-[0_16px_36px_rgba(40,46,64,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,42,64,0.12)]">
                    <div
                      className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${step.pillClassName}`}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconClassName}`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold tracking-[-0.03em] text-[#18212F]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#4E5969]">
                      {step.description}
                    </p>
                  </article>
                  {index < talentSteps.length - 1 ? (
                    <div className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 xl:block">
                      <ArrowRightIcon />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="/#cta"
                className="inline-flex rounded-full bg-[#FF6B35] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#F94C10]"
              >
                Create Your Profile
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-[#18212F]">
                Platform <span className="text-[#4F46E5]">Features</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-[#657082]">
                Everything you need for successful collaboration.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-[1.5rem] border border-[#E7EBF1] bg-[linear-gradient(135deg,#F8FAFC_0%,#FFFFFF_100%)] p-6 transition duration-200 hover:shadow-[0_18px_40px_rgba(35,46,66,0.08)]"
                >
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-[#18212F]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[#657082]">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(90deg,#FF6B35_0%,#4F46E5_100%)] px-8 py-14 text-center sm:px-12 sm:py-16">
              <div className="relative z-10">
                <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-white/90">
                  Join the BRaket community today and unlock new opportunities.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a
                    href="/#cta"
                    className="inline-flex rounded-full bg-white px-8 py-4 text-lg font-bold text-[#FF6B35] transition hover:bg-[#FFF7F2]"
                  >
                    Sign Up Now
                  </a>
                  <a
                    href="/"
                    className="inline-flex rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />
            </div>
          </div>
        </section>

        <footer className="bg-[#141c27] px-5 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F94C10] text-lg font-black text-white">
                    B
                  </div>
                  <span className="text-xl font-extrabold tracking-[-0.02em]">BRaket</span>
                </div>
                <p className="max-w-sm text-sm leading-7 text-white/65">
                  Connecting Bicol University students with opportunities to showcase their talents and build meaningful work.
                </p>
              </div>

              <FooterColumn
                title="Platform"
                links={[
                  { label: "Browse Talents", href: "/browse" },
                  { label: "How It Works", href: "/how-it-works" },
                  { label: "Services", href: "/services" },
                  { label: "Pricing", href: "/#cta" },
                ]}
              />
              <FooterColumn
                title="Support"
                links={[
                  { label: "Help Center", href: "/#features" },
                  { label: "Safety", href: "/#features" },
                  { label: "Guidelines", href: "/how-it-works" },
                  { label: "Contact Us", href: "/#cta" },
                ]}
              />
              <FooterColumn
                title="Community"
                links={[
                  { label: "About Us", href: "/" },
                  { label: "Blog", href: "/how-it-works" },
                  { label: "Success Stories", href: "/browse" },
                  { label: "Events", href: "/#cta" },
                ]}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
              <p className="text-sm text-white/55">© 2026 BRaket. For Bicol University Students.</p>
              <div className="flex gap-6 text-sm text-white/55">
                <a className="transition-colors hover:text-white" href="/">
                  Privacy Policy
                </a>
                <a className="transition-colors hover:text-white" href="/">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h4 className="mb-4 text-base font-bold">{title}</h4>
      <ul className="space-y-2 text-sm text-white/60">
        {links.map((link) => (
          <li key={link.label}>
            <a className="transition-colors hover:text-white" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconBase({
  children,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

function SearchIcon() {
  return (
    <IconBase>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

function UserCheckIcon() {
  return (
    <IconBase>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18a5.5 5.5 0 0 1 11 0" />
      <path d="m16 10 2 2 3-3" />
    </IconBase>
  );
}

function BriefcaseIcon() {
  return (
    <IconBase>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12h18" />
    </IconBase>
  );
}

function StarOutlineIcon() {
  return (
    <IconBase viewBox="0 0 20 20">
      <path d="M10 1.5l2.62 5.31 5.86.85-4.24 4.13 1 5.84L10 14.88 4.76 17.63l1-5.84L1.52 7.66l5.86-.85L10 1.5Z" />
    </IconBase>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-[#9AA3B2]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

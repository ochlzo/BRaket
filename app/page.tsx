export default function Home() {
  const categories = [
    {
      title: "Web Development",
      description: "Frontend, backend, and full-stack students ready to ship real projects.",
      bgClassName: "bg-[#E1F5FE]",
      iconClassName: "bg-white text-[#4FC3F7]",
      icon: <CodeIcon />,
    },
    {
      title: "Graphic Design",
      description: "Branding, social visuals, posters, and polished creative assets.",
      bgClassName: "bg-[#FFF3E0]",
      iconClassName: "bg-white text-[#FF6B1A]",
      icon: <PaletteIcon />,
    },
    {
      title: "Photography",
      description: "Event, portrait, and product photographers for local campaigns and shoots.",
      bgClassName: "bg-[#E0F7FA]",
      iconClassName: "bg-white text-[#4FC3F7]",
      icon: <CameraIcon />,
    },
    {
      title: "Video Editing",
      description: "Editors for reels, explainers, promos, and high-retention content.",
      bgClassName: "bg-[#FFEAD5]",
      iconClassName: "bg-white text-[#FF6B1A]",
      icon: <VideoIcon />,
    },
  ];

  const featureCards = [
    {
      label: "Insulator",
      title: "Verified Student Talents",
      description:
        "Every profile is tied to real BU students, with portfolios reviewed before they are surfaced to clients.",
      bgClassName: "bg-[#E1F5FE]",
      accent: <ShieldIcon />,
      decor: (
        <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-6 translate-y-6 rounded-tl-[3.5rem] bg-gradient-to-br from-[#4FC3F7] to-[#29B6F6] opacity-25 rotate-12" />
      ),
    },
    {
      label: "Compass",
      title: "Digital Portfolio & Reviews",
      description:
        "Clients can scan work samples, compare specialties, and shortlist top students with confidence.",
      bgClassName: "bg-[#FFF3E0]",
      accent: <PaletteIcon />,
      decor: (
        <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
          <div className="absolute inset-0 -rotate-12 rounded-[1.6rem] bg-white shadow-lg" />
          <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-6 rounded-[1.6rem] bg-[#FF6B1A]" />
        </div>
      ),
    },
    {
      label: "Navigator",
      title: "Secure Commission System",
      description:
        "Transparent project handoff, milestone visibility, and reputation signals protect both sides of the work.",
      bgClassName: "bg-[#FFEAD5]",
      accent: <ShieldIcon />,
      decor: (
        <div className="absolute bottom-0 right-0 h-36 w-36 translate-x-10 translate-y-10 rounded-full bg-gradient-to-br from-[#FF6B1A] to-[#F4511E] opacity-20" />
      ),
    },
    {
      label: "Compass",
      title: "BU Student Community",
      description:
        "Support local student talent and tap into a growing network of makers, designers, and developers.",
      bgClassName: "bg-[#E0F7FA]",
      accent: <UsersIcon />,
      decor: (
        <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
          <div className="absolute inset-0 rounded-[1.6rem] bg-white shadow-lg" />
          <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-12 rounded-[1.6rem] bg-[#4FC3F7]" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line)] bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F4511E] text-lg font-black text-white">
              B
            </div>
            <span className="text-xl font-extrabold tracking-[-0.02em]">BRaket</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#5B6574] md:flex">
            <a className="font-semibold text-foreground" href="#top">Home</a>
            <a href="#categories">Browse</a>
            <a href="#features">Services</a>
            <a href="#journey">How it Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#categories"
              className="hidden rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-black/5 md:inline-flex"
            >
              Sign In
            </a>
            <a
              href="#journey"
              className="inline-flex items-center rounded-full bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F4511E]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_48%,#FFF7ED_100%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-[#E1F5FE] px-4 py-2 text-sm font-semibold text-[#2593bf]">
                <span className="mr-2 text-xs uppercase tracking-[0.18em]">BU</span>
                For BU Students, By BU Students
              </div>
              <div className="space-y-5">
                <h1 className="max-w-xl text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                  Discover talent.
                  <br />
                  <span className="br-gradient-text">Unlock potential.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[color:var(--ink-muted)] sm:text-xl">
                  BRaket connects Bicol University students with opportunities to showcase their skills, build portfolios, and earn through commission-based projects.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#354052] sm:text-base">
                <div className="flex items-center gap-1 text-[#FF6B1A]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} />
                  ))}
                </div>
                <span>4.9/5 from 500+ reviews</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#categories"
                  className="inline-flex items-center rounded-full bg-[#4FC3F7] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(79,195,247,0.28)] transition hover:bg-[#29B6F6]"
                >
                  Browse Talents
                  <span className="ml-3">
                    <SearchIcon />
                  </span>
                </a>
                <a
                  href="#journey"
                  className="inline-flex items-center rounded-full border-2 border-[#d9dde5] px-7 py-4 text-base font-semibold text-foreground transition hover:border-[#bcc6d6] hover:bg-white/70"
                >
                  I&apos;m a Talent
                </a>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {["from-[#FF6B1A] to-[#FF9C63]", "from-[#4FC3F7] to-[#8AE0FF]", "from-[#FF8E53] to-[#4FC3F7]", "from-[#4FC3F7] to-[#FF6B1A]"].map((gradient, index) => (
                    <div
                      key={index}
                      className={`h-11 w-11 rounded-full border-2 border-white bg-gradient-to-br ${gradient}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-[color:var(--ink-muted)]">
                  <span className="font-bold text-foreground">500+ students</span> already earning
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-[#4FC3F7]/12 blur-2xl" />
              <div className="absolute -bottom-8 right-0 h-36 w-36 rounded-full bg-[#FF6B1A]/12 blur-3xl" />
              <div className="br-hero-shadow relative overflow-hidden rounded-[2rem] bg-white p-3">
                <img
                  src="https://images.unsplash.com/photo-1758270705902-f50dde4add9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvbGxlZ2UlMjBzdHVkZW50cyUyMGRpdmVyc2UlMjBncm91cHxlbnwxfHx8fDE3NzM4NDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Bicol University students collaborating together"
                  className="h-[28rem] w-full rounded-[1.5rem] object-cover sm:h-[34rem]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="relative overflow-hidden bg-[#FEF5F0] px-5 py-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[80px] border-[#FFE8DC] opacity-60" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">
                  Whether you&apos;re hiring for a product, campaign, event, or a fresh idea,
                  <span className="text-[#FF6B1A]"> we provide expert guidance </span>
                  in discovery, matching, and delivery.
                </h2>
                <a
                  href="#features"
                  className="inline-flex rounded-full bg-[#4FC3F7] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#29B6F6]"
                >
                  View Our Cases
                </a>
              </div>
              <div className="inline-block rounded-[2rem] bg-white px-8 py-8 shadow-[0_18px_48px_rgba(74,57,41,0.08)]">
                <p className="mb-3 text-sm leading-6 text-[color:var(--ink-muted)]">
                  We support you through every step of
                  <br />
                  your relocation journey
                </p>
                <div className="text-6xl font-extrabold tracking-[-0.05em] text-foreground sm:text-7xl">1378+</div>
                <p className="mt-2 text-[color:var(--ink-muted)]">Clients relocated successfully</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_18px_40px_rgba(59,52,44,0.08)]">
                <img
                  src="https://images.unsplash.com/photo-1650686947677-b62e1acf99ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdmlkZW8lMjBjYWxsJTIwbGFwdG9wfGVufDF8fHx8MTc3Mzg0NDc2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Student speaking on a video call"
                  className="aspect-square w-full rounded-[1.5rem] object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] bg-white p-2 pt-8 shadow-[0_18px_40px_rgba(59,52,44,0.08)]">
                <img
                  src="https://images.unsplash.com/photo-1771923892021-e94fcc4895cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhbWlseSUyMGhhcHB5JTIwaG9tZXxlbnwxfHx8fDE3NzM4NDQ3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Happy clients celebrating together"
                  className="aspect-square w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                Browse by <span className="text-[#FF6B1A]">Category</span>
              </h2>
              <p className="mt-4 text-lg leading-8 text-[color:var(--ink-muted)]">
                Find the right student talent for your project across technical, visual, and creative disciplines.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <a
                  key={category.title}
                  href="#features"
                  className={`${category.bgClassName} group rounded-[1.75rem] p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(37,48,69,0.12)]`}
                >
                  <div className="space-y-5">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.iconClassName}`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-[-0.03em] text-foreground">{category.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#4a5565]">{category.description}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 font-semibold text-foreground transition group-hover:gap-3">
                      Explore
                      <ArrowRightIcon />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                  Everything you need to find talent with confidence
                </h2>
                <p className="mt-4 text-lg leading-8 text-[color:var(--ink-muted)]">
                  We provide end-to-end support throughout your project journey, from discovery to final delivery.
                </p>
              </div>
              <a
                href="#cta"
                className="inline-flex w-fit rounded-full bg-[#4FC3F7] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#29B6F6]"
              >
                Start a Project
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className={`${card.bgClassName} relative flex min-h-[18rem] flex-col overflow-hidden rounded-[2rem] p-8`}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                      <span className="text-[#FF6B1A]">{card.accent}</span>
                      {card.label}
                    </div>
                    <h3 className="max-w-sm text-2xl font-bold tracking-[-0.03em] text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-7 text-[#465264]">{card.description}</p>
                  </div>
                  {card.decor}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(90deg,#FF6B1A_0%,#4FC3F7_100%)] px-8 py-14 text-center sm:px-12 sm:py-16">
              <div className="relative z-10">
                <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
                  Ready to start your journey?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
                  Join hundreds of BU students already building income, experience, and stronger portfolios on BRaket.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a
                    href="#top"
                    className="inline-flex rounded-full bg-white px-7 py-4 text-base font-bold text-[#FF6B1A] transition hover:bg-[#fff5ef]"
                  >
                    Get Started Today
                  </a>
                  <a
                    href="#features"
                    className="inline-flex rounded-full border-2 border-white px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
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
                  { label: "Browse Talents", href: "#categories" },
                  { label: "How It Works", href: "#journey" },
                  { label: "Services", href: "#features" },
                  { label: "Pricing", href: "#cta" },
                ]}
              />
              <FooterColumn
                title="Support"
                links={[
                  { label: "Help Center", href: "#features" },
                  { label: "Safety", href: "#features" },
                  { label: "Guidelines", href: "#journey" },
                  { label: "Contact Us", href: "#cta" },
                ]}
              />
              <FooterColumn
                title="Community"
                links={[
                  { label: "About Us", href: "#top" },
                  { label: "Blog", href: "#journey" },
                  { label: "Success Stories", href: "#categories" },
                  { label: "Events", href: "#cta" },
                ]}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
              <p className="text-sm text-white/55">© 2026 BRaket. For Bicol University Students.</p>
              <div className="flex gap-6 text-sm text-white/55">
                <a className="transition-colors hover:text-white" href="#top">
                  Privacy Policy
                </a>
                <a className="transition-colors hover:text-white" href="#top">
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
      className="h-6 w-6"
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

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
      <path d="M10 1.5l2.62 5.31 5.86.85-4.24 4.13 1 5.84L10 14.88 4.76 17.63l1-5.84L1.52 7.66l5.86-.85L10 1.5Z" />
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

function ArrowRightIcon() {
  return (
    <IconBase>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

function CodeIcon() {
  return (
    <IconBase>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14 4-4 16" />
    </IconBase>
  );
}

function PaletteIcon() {
  return (
    <IconBase>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.6-.2-1.1-.5-1.5a2 2 0 0 1 1.5-3.3H16a5 5 0 0 0 0-10Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14" cy="8" r="1" />
    </IconBase>
  );
}

function CameraIcon() {
  return (
    <IconBase>
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="m9 8 1.5-3h3L15 8" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  );
}

function VideoIcon() {
  return (
    <IconBase>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-3v10l-6-3Z" />
    </IconBase>
  );
}

function ShieldIcon() {
  return (
    <IconBase>
      <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </IconBase>
  );
}

function UsersIcon() {
  return (
    <IconBase>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.5 18a4.5 4.5 0 0 1 5 0" />
    </IconBase>
  );
}

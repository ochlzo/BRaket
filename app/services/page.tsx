const services = [
  {
    title: "Web & App Development",
    description:
      "Custom websites, web applications, and mobile apps built by talented BU developers.",
    features: [
      "Frontend Development",
      "Backend Development",
      "Full-stack Solutions",
      "Mobile Apps",
    ],
    bgClassName: "bg-[#DBEAFE]",
    iconClassName: "text-[#4F46E5]",
    icon: <CodeIcon />,
  },
  {
    title: "Graphic Design",
    description:
      "Professional design services for branding, marketing, and digital content.",
    features: ["Logo Design", "Brand Identity", "Social Media Graphics", "Print Design"],
    bgClassName: "bg-[#FFEDD5]",
    iconClassName: "text-[#FF6B35]",
    icon: <PaletteIcon />,
  },
  {
    title: "Photography",
    description:
      "High-quality photography for events, products, portraits, and more.",
    features: ["Event Photography", "Product Shoots", "Portrait Sessions", "Photo Editing"],
    bgClassName: "bg-[#DCFCE7]",
    iconClassName: "text-[#22C55E]",
    icon: <CameraIcon />,
  },
  {
    title: "Video Production",
    description:
      "Professional video editing and production for any project or platform.",
    features: ["Video Editing", "Motion Graphics", "Color Grading", "YouTube Content"],
    bgClassName: "bg-[#F3E8FF]",
    iconClassName: "text-[#A855F7]",
    icon: <VideoIcon />,
  },
  {
    title: "Content Writing",
    description:
      "Engaging written content for blogs, websites, and marketing materials.",
    features: ["Blog Writing", "Copywriting", "SEO Content", "Technical Writing"],
    bgClassName: "bg-[#FEE2E2]",
    iconClassName: "text-[#EF4444]",
    icon: <PencilIcon />,
  },
  {
    title: "Music & Audio",
    description:
      "Audio production, mixing, and sound design for various projects.",
    features: ["Music Production", "Audio Mixing", "Sound Design", "Voiceover"],
    bgClassName: "bg-[#FEF3C7]",
    iconClassName: "text-[#F59E0B]",
    icon: <MusicIcon />,
  },
  {
    title: "Digital Marketing",
    description:
      "Strategic marketing services to grow your online presence and reach.",
    features: [
      "Social Media Management",
      "SEO Optimization",
      "Email Marketing",
      "Analytics",
    ],
    bgClassName: "bg-[#E0E7FF]",
    iconClassName: "text-[#6366F1]",
    icon: <MegaphoneIcon />,
  },
  {
    title: "Business Consulting",
    description:
      "Strategic advice and consulting for startups and small businesses.",
    features: [
      "Business Planning",
      "Market Research",
      "Strategy Development",
      "Financial Planning",
    ],
    bgClassName: "bg-[#FCE7F3]",
    iconClassName: "text-[#EC4899]",
    icon: <TrendingUpIcon />,
  },
];

export default function ServicesPage() {
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
            <a className="font-semibold text-[#18212F]" href="/services">
              Services
            </a>
            <a href="/#journey">How it Works</a>
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
        <section className="bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_50%,#FFEDD5_100%)] px-5 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-[#18212F] sm:text-6xl">
              Our <span className="text-[#FF6B35]">Services</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-[#657082]">
              Discover the wide range of professional services offered by talented
              Bicol University students. From web development to creative design,
              find the right match for your project.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className={`${service.bgClassName} group rounded-[1.75rem] p-8 transition duration-200 hover:-translate-y-2 hover:shadow-[0_28px_54px_rgba(31,44,65,0.12)]`}
                >
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white transition-transform group-hover:scale-110 ${service.iconClassName}`}
                  >
                    {service.icon}
                  </div>

                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#18212F]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[#4E5969]">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-[#465264]"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${service.iconClassName.replace("text-", "bg-")}`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/browse"
                    className="mt-7 inline-flex w-full items-center justify-center rounded-full border-2 border-[#18212F] bg-white px-5 py-3.5 text-sm font-semibold text-[#18212F] transition hover:bg-[#18212F] hover:text-white"
                  >
                    Find Talents
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(90deg,#4F46E5_0%,#7C3AED_100%)] px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
              Don&apos;t see what you&apos;re looking for?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/90">
              Post your project requirements and get custom proposals from talented BU students.
            </p>
            <a
              href="/#cta"
              className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-lg font-bold text-[#4F46E5] transition hover:bg-[#F7F7FB]"
            >
              Post a Project
            </a>
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
                  { label: "How It Works", href: "/#journey" },
                  { label: "Services", href: "/services" },
                  { label: "Pricing", href: "/#cta" },
                ]}
              />
              <FooterColumn
                title="Support"
                links={[
                  { label: "Help Center", href: "/#features" },
                  { label: "Safety", href: "/#features" },
                  { label: "Guidelines", href: "/#journey" },
                  { label: "Contact Us", href: "/#cta" },
                ]}
              />
              <FooterColumn
                title="Community"
                links={[
                  { label: "About Us", href: "/" },
                  { label: "Blog", href: "/#journey" },
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
      className="h-8 w-8"
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

function PencilIcon() {
  return (
    <IconBase>
      <path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </IconBase>
  );
}

function MusicIcon() {
  return (
    <IconBase>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </IconBase>
  );
}

function MegaphoneIcon() {
  return (
    <IconBase>
      <path d="M3 11v2a2 2 0 0 0 2 2h2l3 5h2l-1.4-5H13l6 3V6l-6 3H5a2 2 0 0 0-2 2Z" />
    </IconBase>
  );
}

function TrendingUpIcon() {
  return (
    <IconBase>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </IconBase>
  );
}

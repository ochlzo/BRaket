const talents = [
  {
    id: 1,
    name: "Maria Santos",
    role: "UI/UX Designer",
    rating: 4.9,
    reviews: 87,
    hourlyRate: "PHP 500-800",
    location: "Legazpi City",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "John Reyes",
    role: "Full Stack Developer",
    rating: 5,
    reviews: 124,
    hourlyRate: "PHP 800-1200",
    location: "Daraga",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Ana Cruz",
    role: "Content Writer",
    rating: 4.8,
    reviews: 65,
    hourlyRate: "PHP 400-600",
    location: "Legazpi City",
    skills: ["SEO Writing", "Copywriting", "Blog Posts", "Social Media"],
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop",
    available: false,
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    role: "Video Editor",
    rating: 4.7,
    reviews: 52,
    hourlyRate: "PHP 600-900",
    location: "Tabaco City",
    skills: ["Premiere Pro", "After Effects", "Color Grading", "Motion Graphics"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Sofia Reyes",
    role: "Graphic Designer",
    rating: 4.9,
    reviews: 98,
    hourlyRate: "PHP 500-750",
    location: "Legazpi City",
    skills: ["Illustrator", "Photoshop", "Branding", "Print Design"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "Miguel Torres",
    role: "Photographer",
    rating: 5,
    reviews: 76,
    hourlyRate: "PHP 1000-1500",
    location: "Daraga",
    skills: ["Portrait", "Event", "Product", "Editing"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop",
    available: true,
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Graphic Design",
  "Writing",
  "Photography",
  "Video Editing",
  "Music & Audio",
];

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_44%)] text-[#18212F]">
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
            <a className="font-semibold text-[#18212F]" href="/browse">
              Browse
            </a>
            <a href="/#features">Services</a>
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
        <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-5xl font-extrabold tracking-[-0.05em] text-[#18212F] sm:text-6xl">
                Find Your Perfect <span className="text-[#FF6B35]">Talent</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-8 text-[#657082]">
                Browse through verified BU student professionals ready to bring your projects to life.
              </p>
            </div>

            <div className="mx-auto mb-8 max-w-3xl">
              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#9BA3B2]">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, skill, or service..."
                  className="w-full rounded-full border-2 border-[#E3E8EF] bg-white py-5 pl-14 pr-5 text-lg text-[#18212F] outline-none transition placeholder:text-[#9BA3B2] focus:border-[#4FC3F7]"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => {
                const active = index === 0;
                return (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-[#4FC3F7] bg-[#4FC3F7] text-white"
                        : "border-[#E0E5EC] bg-white text-[#465264] hover:border-[#4FC3F7] hover:text-[#18212F]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-[1.75rem] border border-[#E6EAF0] bg-white p-6 shadow-[0_16px_36px_rgba(34,46,69,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FilterIcon />
                  <span className="font-semibold text-[#18212F]">Filters</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <FilterChip label="All Ratings" />
                  <FilterChip label="All Locations" />
                  <button
                    type="button"
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#657082] transition hover:bg-[#F5F7FA] hover:text-[#18212F]"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[#657082]">
                Showing <span className="font-bold text-[#18212F]">{talents.length}</span> talents
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {talents.map((talent) => (
                <article
                  key={talent.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#E7EBF1] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(28,43,67,0.12)]"
                >
                  <div className="relative h-56 bg-[linear-gradient(135deg,#DBEAFE_0%,#FFEDD5_100%)]">
                    <img
                      src={talent.image}
                      alt={talent.name}
                      className="h-full w-full object-cover"
                    />
                    {talent.available ? (
                      <div className="absolute right-4 top-4 rounded-full bg-[#22C55E] px-3 py-1 text-xs font-semibold text-white">
                        Available
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-[#18212F]">
                        {talent.name}
                      </h2>
                      <p className="mt-1 text-[#657082]">{talent.role}</p>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-[#FF6B35]">
                        <StarIcon />
                      </span>
                      <span className="font-bold text-[#18212F]">{talent.rating.toFixed(1)}</span>
                      <span className="text-sm text-[#8C96A8]">({talent.reviews} reviews)</span>
                    </div>

                    <div className="mb-4 space-y-2 text-sm text-[#657082]">
                      <div className="flex items-center gap-2">
                        <MapPinIcon />
                        <span>{talent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon />
                        <span>{talent.hourlyRate}/hour</span>
                      </div>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {talent.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#4A5565]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full rounded-full bg-[#4FC3F7] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#29B6F6]"
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                type="button"
                className="rounded-full border-2 border-[#D6DCE5] bg-white px-8 py-4 font-semibold text-[#18212F] transition hover:border-[#4FC3F7] hover:bg-[#F9FCFF]"
              >
                Load More Talents
              </button>
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
                  { label: "How It Works", href: "/#journey" },
                  { label: "Services", href: "/#features" },
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

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-full border border-[#E1E6ED] bg-white px-4 py-2.5 text-sm font-medium text-[#465264] transition hover:border-[#4FC3F7] hover:text-[#18212F]"
    >
      {label}
    </button>
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
      className="h-5 w-5"
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

function FilterIcon() {
  return (
    <IconBase>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </IconBase>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
      <path d="M10 1.5l2.62 5.31 5.86.85-4.24 4.13 1 5.84L10 14.88 4.76 17.63l1-5.84L1.52 7.66l5.86-.85L10 1.5Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <IconBase>
      <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
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

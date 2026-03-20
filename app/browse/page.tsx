import { FilterIcon } from "@/components/icons/marketing-icons";
import { PageShell } from "@/components/layout/page-shell";
import { FilterChip } from "@/components/marketing/filter-chip";
import { SearchField } from "@/components/marketing/search-field";
import { TalentCard } from "@/components/marketing/talent-card";
import { appNavigation } from "@/content/navigation";
import { semantic } from "@/theme/semantic";

const talents = [
  {
    available: true,
    hourlyRate: "PHP 500-800",
    id: 1,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
    location: "Legazpi City",
    name: "Maria Santos",
    rating: 4.9,
    reviews: 87,
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
  },
  {
    available: true,
    hourlyRate: "PHP 800-1200",
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    location: "Daraga",
    name: "John Reyes",
    rating: 5,
    reviews: 124,
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
  },
  {
    available: false,
    hourlyRate: "PHP 400-600",
    id: 3,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop",
    location: "Legazpi City",
    name: "Ana Cruz",
    rating: 4.8,
    reviews: 65,
    role: "Content Writer",
    skills: ["SEO Writing", "Copywriting", "Blog Posts", "Social Media"],
  },
  {
    available: true,
    hourlyRate: "PHP 600-900",
    id: 4,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop",
    location: "Tabaco City",
    name: "Carlos Mendoza",
    rating: 4.7,
    reviews: 52,
    role: "Video Editor",
    skills: ["Premiere Pro", "After Effects", "Color Grading", "Motion Graphics"],
  },
  {
    available: true,
    hourlyRate: "PHP 500-750",
    id: 5,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop",
    location: "Legazpi City",
    name: "Sofia Reyes",
    rating: 4.9,
    reviews: 98,
    role: "Graphic Designer",
    skills: ["Illustrator", "Photoshop", "Branding", "Print Design"],
  },
  {
    available: true,
    hourlyRate: "PHP 1000-1500",
    id: 6,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop",
    location: "Daraga",
    name: "Miguel Torres",
    rating: 5,
    reviews: 76,
    role: "Photographer",
    skills: ["Portrait", "Event", "Product", "Editing"],
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
    <PageShell
      activeHref="/browse"
      className="bg-[linear-gradient(180deg,var(--tone-sky-pale)_0%,#FFFFFF_44%)]"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">
              Find Your Perfect <span className="text-[color:var(--brand-orange)]">Talent</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-8 text-[color:var(--ink-soft)]">
              Browse through verified BU student professionals ready to bring your projects to life.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-3xl">
            <SearchField placeholder="Search by name, skill, or service..." />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <FilterChip key={category} active={index === 0} label={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-[1.75rem] border border-[color:var(--line-strong)] bg-white p-6 shadow-[0_16px_36px_rgba(34,46,69,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FilterIcon />
                <span className="font-semibold text-foreground">Filters</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <FilterChip label="All Ratings" />
                <FilterChip label="All Locations" />
                <button
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-[color:var(--ink-soft)] transition hover:bg-[#F5F7FA] hover:text-foreground"
                  type="button"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[color:var(--ink-soft)]">
              Showing <span className="font-bold text-foreground">{talents.length}</span> talents
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {talents.map((talent) => (
              <TalentCard key={talent.id} {...talent} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className={semantic.button.outlineNeutralStrong} type="button">
              Load More Talents
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import {
  CameraIcon,
  CodeIcon,
  MegaphoneIcon,
  MusicIcon,
  PaletteIcon,
  PencilIcon,
  TrendingUpIcon,
  VideoIcon,
} from "@/components/icons/marketing-icons";
import { PageShell } from "@/components/layout/page-shell";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { ServiceCard } from "@/components/marketing/service-card";
import { appNavigation } from "@/content/navigation";

const services = [
  {
    description:
      "Custom websites, web applications, and mobile apps built by talented BU developers.",
    features: [
      "Frontend Development",
      "Backend Development",
      "Full-stack Solutions",
      "Mobile Apps",
    ],
    icon: <CodeIcon className="h-8 w-8" />,
    title: "Web & App Development",
    tone: "indigo" as const,
  },
  {
    description:
      "Professional design services for branding, marketing, and digital content.",
    features: ["Logo Design", "Brand Identity", "Social Media Graphics", "Print Design"],
    icon: <PaletteIcon className="h-8 w-8" />,
    title: "Graphic Design",
    tone: "orange" as const,
  },
  {
    description:
      "High-quality photography for events, products, portraits, and more.",
    features: ["Event Photography", "Product Shoots", "Portrait Sessions", "Photo Editing"],
    icon: <CameraIcon className="h-8 w-8" />,
    title: "Photography",
    tone: "green" as const,
  },
  {
    description:
      "Professional video editing and production for any project or platform.",
    features: ["Video Editing", "Motion Graphics", "Color Grading", "YouTube Content"],
    icon: <VideoIcon className="h-8 w-8" />,
    title: "Video Production",
    tone: "purple" as const,
  },
  {
    description:
      "Engaging written content for blogs, websites, and marketing materials.",
    features: ["Blog Writing", "Copywriting", "SEO Content", "Technical Writing"],
    icon: <PencilIcon />,
    title: "Content Writing",
    tone: "red" as const,
  },
  {
    description:
      "Audio production, mixing, and sound design for various projects.",
    features: ["Music Production", "Audio Mixing", "Sound Design", "Voiceover"],
    icon: <MusicIcon />,
    title: "Music & Audio",
    tone: "amber" as const,
  },
  {
    description:
      "Strategic marketing services to grow your online presence and reach.",
    features: [
      "Social Media Management",
      "SEO Optimization",
      "Email Marketing",
      "Analytics",
    ],
    icon: <MegaphoneIcon />,
    title: "Digital Marketing",
    tone: "indigo" as const,
  },
  {
    description:
      "Strategic advice and consulting for startups and small businesses.",
    features: [
      "Business Planning",
      "Market Research",
      "Strategy Development",
      "Financial Planning",
    ],
    icon: <TrendingUpIcon />,
    title: "Business Consulting",
    tone: "pink" as const,
  },
];

export default function ServicesPage() {
  return (
    <PageShell
      activeHref="/services"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <section className="bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,#FFFFFF_50%,var(--tone-orange-soft)_100%)] px-5 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">
            Our <span className="text-[color:var(--brand-orange)]">Services</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-[color:var(--ink-soft)]">
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
              <ServiceCard
                key={service.title}
                actionHref="/browse"
                actionLabel="Find Talents"
                description={service.description}
                features={service.features}
                icon={service.icon}
                title={service.title}
                tone={service.tone}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <CtaBanner
            description="Post your project requirements and get custom proposals from talented BU students."
            gradientClassName="bg-[linear-gradient(90deg,var(--brand-indigo)_0%,#7C3AED_100%)]"
            primaryAction={{ href: "/#cta", label: "Post a Project", variant: "whiteIndigo" }}
            title="Don&apos;t see what you&apos;re looking for?"
          />
        </div>
      </section>
    </PageShell>
  );
}

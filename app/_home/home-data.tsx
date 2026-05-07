import type { ComponentProps } from "react";

import { CategoryCard } from "@/components/shared/marketing/category-card";
import { FeatureCard } from "@/components/shared/marketing/feature-card";
import {
  CameraIcon,
  CodeIcon,
  PaletteIcon,
  ShieldIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/shared/icons/marketing-icons";

export type HomeCategory = ComponentProps<typeof CategoryCard>;
export type HomeFeatureCard = ComponentProps<typeof FeatureCard>;

export const homeCategories: HomeCategory[] = [
  {
    description:
      "Frontend, backend, and full-stack students ready to ship real projects.",
    href: "/browse",
    icon: <CodeIcon />,
    title: "Web Development",
    tone: "sky",
  },
  {
    description:
      "Branding, social visuals, posters, and polished creative assets.",
    href: "/browse",
    icon: <PaletteIcon />,
    title: "Graphic Design",
    tone: "orange",
  },
  {
    description:
      "Event, portrait, and product photographers for local campaigns and shoots.",
    href: "/browse",
    icon: <CameraIcon />,
    title: "Photography",
    tone: "teal",
  },
  {
    description:
      "Editors for reels, explainers, promos, and high-retention content.",
    href: "/browse",
    icon: <VideoIcon />,
    title: "Video Editing",
    tone: "orange",
  },
];

export const homeFeatureCards: HomeFeatureCard[] = [
  {
    accent: <ShieldIcon />,
    decor: (
      <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-6 translate-y-6 rotate-12 rounded-tl-[3.5rem] bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-blue-strong)] opacity-25" />
    ),
    description:
      "Every profile is tied to real BU students, with portfolios reviewed before they are surfaced to clients.",
    label: "Insulator",
    title: "Verified Student Talents",
    tone: "sky",
  },
  {
    accent: <PaletteIcon />,
    decor: (
      <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
        <div className="absolute inset-0 -rotate-12 rounded-[1.6rem] bg-white shadow-lg" />
        <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-6 rounded-[1.6rem] bg-[color:var(--tone-orange-base)]" />
      </div>
    ),
    description:
      "Clients can scan work samples, compare specialties, and shortlist top students with confidence.",
    label: "Compass",
    title: "Digital Portfolio & Reviews",
    tone: "orange",
  },
  {
    accent: <ShieldIcon />,
    decor: (
      <div className="absolute bottom-0 right-0 h-36 w-36 translate-x-10 translate-y-10 rounded-full bg-gradient-to-br from-[color:var(--tone-orange-base)] to-[color:var(--tone-orange-deep)] opacity-20" />
    ),
    description:
      "Transparent project handoff, milestone visibility, and reputation signals protect both sides of the work.",
    label: "Navigator",
    title: "Secure Commission System",
    tone: "orange",
  },
  {
    accent: <UsersIcon />,
    decor: (
      <div className="absolute bottom-7 right-7 h-24 w-24 opacity-40">
        <div className="absolute inset-0 rounded-[1.6rem] bg-white shadow-lg" />
        <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-12 rounded-[1.6rem] bg-[color:var(--brand-blue)]" />
      </div>
    ),
    description:
      "Support local student talent and tap into a growing network of makers, designers, and developers.",
    label: "Compass",
    title: "BU Student Community",
    tone: "teal",
  },
];

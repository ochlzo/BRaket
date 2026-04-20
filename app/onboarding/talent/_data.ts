import type { SkillLevel } from "@/lib/types";

export const availableSkills = [
  "HTML/CSS",
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Canva",
  "Premiere Pro",
  "After Effects",
  "Lightroom",
  "SEO Writing",
  "Copywriting",
  "Blog Posts",
  "Social Media Management",
  "Content Strategy",
  "Photography",
  "Video Editing",
  "Motion Graphics",
  "Branding",
  "Logo Design",
  "Web Design",
  "Mobile Design",
  "Python",
  "PHP",
  "WordPress",
  "MongoDB",
  "Tailwind CSS",
];

export const proficiencyLevels: {
  color: string;
  label: string;
  value: SkillLevel;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    color: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    color:
      "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  },
  {
    value: "expert",
    label: "Expert",
    color:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  },
];

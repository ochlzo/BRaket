import type { SkillLevel } from "@/lib/types";

export const proficiencyLevels: {
  color: string;
  label: string;
  optionColor: string;
  value: SkillLevel;
}[] = [
  {
    value: "BEGINNER",
    label: "Beginner",
    color: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
    optionColor:
      "hover:bg-[color:var(--tone-sky-soft)] hover:text-[color:var(--tone-sky-deep)] focus:bg-[color:var(--tone-sky-soft)] focus:text-[color:var(--tone-sky-deep)] data-[selected]:bg-[color:var(--tone-sky-soft)] data-[selected]:text-[color:var(--tone-sky-deep)]",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    color:
      "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
    optionColor:
      "hover:bg-[color:var(--tone-amber-soft)] hover:text-[color:var(--tone-amber-deep)] focus:bg-[color:var(--tone-amber-soft)] focus:text-[color:var(--tone-amber-deep)] data-[selected]:bg-[color:var(--tone-amber-soft)] data-[selected]:text-[color:var(--tone-amber-deep)]",
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    color:
      "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
    optionColor:
      "hover:bg-[color:var(--tone-indigo-soft)] hover:text-[color:var(--tone-indigo-deep)] focus:bg-[color:var(--tone-indigo-soft)] focus:text-[color:var(--tone-indigo-deep)] data-[selected]:bg-[color:var(--tone-indigo-soft)] data-[selected]:text-[color:var(--tone-indigo-deep)]",
  },
  {
    value: "EXPERT",
    label: "Expert",
    color:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
    optionColor:
      "hover:bg-[color:var(--tone-green-soft)] hover:text-[color:var(--tone-green-deep)] focus:bg-[color:var(--tone-green-soft)] focus:text-[color:var(--tone-green-deep)] data-[selected]:bg-[color:var(--tone-green-soft)] data-[selected]:text-[color:var(--tone-green-deep)]",
  },
];

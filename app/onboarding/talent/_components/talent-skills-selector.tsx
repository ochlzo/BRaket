import { Input } from "@/components/ui/input";
import type { SkillLevel } from "@/lib/types";

import { proficiencyLevels } from "@/app/onboarding/talent/_data";

export type SelectedSkill = { level: SkillLevel; name: string };

type TalentSkillsSelectorProps = {
  addSkill: (name: string) => void;
  filteredSkills: string[];
  removeSkill: (name: string) => void;
  selectedSkills: SelectedSkill[];
  setSkillLevel: (name: string, level: SkillLevel) => void;
  setSkillSearch: (value: string) => void;
  skillSearch: string;
};

export function TalentSkillsSelector({
  addSkill,
  filteredSkills,
  removeSkill,
  selectedSkills,
  setSkillLevel,
  setSkillSearch,
  skillSearch,
}: TalentSkillsSelectorProps) {
  return (
    <div>
      <h2 className="mb-3 flex flex-wrap items-center gap-2 text-base font-bold text-foreground sm:mb-4 sm:text-lg">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-orange)] text-[0.7rem] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs">
          3
        </span>
        Skills
        <span className="basis-full text-xs font-normal text-[color:var(--ink-muted)] sm:ml-1 sm:basis-auto sm:text-sm">
          ({selectedSkills.length}/10 selected, minimum 3)
        </span>
      </h2>

      {selectedSkills.length > 0 ? (
        <div className="mb-4 space-y-2">
          {selectedSkills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-2xl border border-[color:var(--line-strong)] bg-white px-3 py-3 sm:flex sm:items-center sm:justify-between sm:rounded-xl sm:px-4"
            >
              <span className="block text-sm font-semibold text-foreground">
                {skill.name}
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-0 sm:gap-2">
                {proficiencyLevels.map((level) => (
                  <button
                    key={level.value}
                    className={`min-h-9 rounded-full px-3 py-1 text-xs font-bold transition sm:min-h-0 sm:rounded-lg ${
                      skill.level === level.value
                        ? level.color
                        : "text-[color:var(--ink-soft)] hover:bg-[color:var(--surface-alt)]"
                    }`}
                    onClick={() => setSkillLevel(skill.name, level.value)}
                    type="button"
                  >
                    {level.label}
                  </button>
                ))}
                <button
                  aria-label={`Remove ${skill.name}`}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--tone-red-base)] sm:ml-2 sm:h-auto sm:w-auto sm:rounded-none"
                  onClick={() => removeSkill(skill.name)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Input
        className="mb-3 h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
        onChange={(event) => setSkillSearch(event.target.value)}
        placeholder="Search skills to add..."
        type="text"
        value={skillSearch}
      />

      <div className="flex flex-wrap gap-1.5">
        {filteredSkills.slice(0, 12).map((skill) => (
          <button
            key={skill}
            className="min-h-9 rounded-full border border-dashed border-[color:var(--line-strong)] px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)] transition hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange)] disabled:opacity-40"
            disabled={selectedSkills.length >= 10}
            onClick={() => addSkill(skill)}
            type="button"
          >
            + {skill}
          </button>
        ))}
      </div>
    </div>
  );
}

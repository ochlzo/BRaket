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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">
          3
        </span>
        Skills
        <span className="ml-1 text-sm font-normal text-[color:var(--ink-muted)]">
          ({selectedSkills.length}/10 selected, minimum 3)
        </span>
      </h2>

      {selectedSkills.length > 0 ? (
        <div className="mb-4 space-y-2">
          {selectedSkills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3"
            >
              <span className="text-sm font-semibold text-foreground">
                {skill.name}
              </span>
              <div className="flex items-center gap-2">
                {proficiencyLevels.map((level) => (
                  <button
                    key={level.value}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
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
                  className="ml-2 text-[color:var(--ink-soft)] transition hover:text-[color:var(--tone-red-base)]"
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
        className="mb-3 h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
        onChange={(event) => setSkillSearch(event.target.value)}
        placeholder="Search skills to add..."
        type="text"
        value={skillSearch}
      />

      <div className="flex flex-wrap gap-1.5">
        {filteredSkills.slice(0, 12).map((skill) => (
          <button
            key={skill}
            className="rounded-full border border-dashed border-[color:var(--line-strong)] px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)] transition hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange)] disabled:opacity-40"
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

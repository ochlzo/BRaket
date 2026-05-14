import { useState, type KeyboardEvent } from "react";

import { proficiencyLevels } from "@/app/onboarding/talent/_data";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SkillLevel } from "@/lib/types";

export type SelectedSkill = { level: SkillLevel; name: string };

const MIN_SKILL_NAME_LENGTH = 3;
const skillsSubtitleClassName = "text-xs font-normal leading-none sm:text-sm";

type TalentSkillsSelectorProps = {
  addSkill: (name: string) => void;
  availableSkills: string[];
  clearSkills: () => void;
  filteredSkills: string[];
  removeSkill: (name: string) => void;
  selectedSkills: SelectedSkill[];
  setSkillLevel: (name: string, level: SkillLevel) => void;
  setSkillSearch: (value: string) => void;
  skillSearch: string;
};

export function TalentSkillsSelector({
  addSkill,
  availableSkills,
  clearSkills,
  filteredSkills,
  removeSkill,
  selectedSkills,
  setSkillLevel,
  setSkillSearch,
  skillSearch,
}: TalentSkillsSelectorProps) {
  const [skillError, setSkillError] = useState("");
  const hasReachedSkillLimit = selectedSkills.length >= 10;
  const hasSkillSearchValue = skillSearch.trim().length > 0;

  function getSkillToAdd(value: string) {
    const trimmedValue = value.trim();
    const matchingSkill = availableSkills.find(
      (skill) => skill.toLowerCase() === trimmedValue.toLowerCase(),
    );

    return matchingSkill ?? trimmedValue;
  }

  function tryAddSkill(value: string) {
    const trimmedValue = value.trim();

    if (trimmedValue.length < MIN_SKILL_NAME_LENGTH) {
      setSkillError(
        `Enter at least ${MIN_SKILL_NAME_LENGTH} characters to add a skill.`,
      );
      return;
    }

    addSkill(getSkillToAdd(trimmedValue));
    setSkillError("");
    setSkillSearch("");
  }

  function handleSkillSearchChange(value: string) {
    setSkillSearch(value);

    if (value.trim().length >= MIN_SKILL_NAME_LENGTH) {
      setSkillError("");
    }
  }

  function handleSkillSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    tryAddSkill(skillSearch);
  }

  function handleSkillLevelChange(name: string, value: string | null) {
    const skillLevel = proficiencyLevels.find((level) => level.value === value);

    if (!skillLevel) {
      return;
    }

    setSkillLevel(name, skillLevel.value);
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-orange)] text-[0.7rem] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs">
            3
          </span>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Skills
          </h2>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className={`${skillsSubtitleClassName} text-[color:var(--ink-muted)]`}>
            ({selectedSkills.length}/10 selected, minimum 3)
          </p>
          {selectedSkills.length > 0 ? (
            <button
              className={`${skillsSubtitleClassName} shrink-0 text-[color:var(--brand-orange)] transition hover:text-[color:var(--brand-orange-strong)]`}
              onClick={clearSkills}
              type="button"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      {selectedSkills.length > 0 ? (
        <div className="mb-4 space-y-2">
          {selectedSkills.map((skill) => (
            <SelectedSkillItem
              key={skill.name}
              removeSkill={removeSkill}
              setSkillLevel={handleSkillLevelChange}
              skill={skill}
            />
          ))}
        </div>
      ) : null}

      <Combobox
        disabled={hasReachedSkillLimit}
        onInputValueChange={handleSkillSearchChange}
        onValueChange={(value) => {
          if (typeof value !== "string") {
            return;
          }

          tryAddSkill(value);
        }}
        value={null}
      >
        <ComboboxInput
          className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 text-sm sm:h-11 sm:rounded-xl"
          disabled={hasReachedSkillLimit}
          onKeyDown={handleSkillSearchKeyDown}
          placeholder={
            hasReachedSkillLimit
              ? "Maximum of 10 skills selected"
              : "Find or add your skills..."
          }
          showTrigger={false}
          value={skillSearch}
        >
          <InputGroupAddon align="inline-end" className="gap-1 pr-2">
            {hasSkillSearchValue ? (
              <InputGroupButton
                className="rounded-full px-2.5 text-xs font-semibold text-[color:var(--brand-orange)] hover:bg-[color:var(--surface-alt)] sm:px-3"
                disabled={hasReachedSkillLimit}
                onClick={() => tryAddSkill(skillSearch)}
                type="button"
                variant="ghost"
              >
                Add
              </InputGroupButton>
            ) : null}
            <InputGroupButton
              className="data-pressed:bg-transparent"
              data-slot="input-group-button"
              disabled={hasReachedSkillLimit}
              render={<ComboboxTrigger />}
              size="icon-xs"
              variant="ghost"
            />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
          <ComboboxList>
            {filteredSkills.slice(0, 12).map((skill) => (
              <ComboboxItem key={skill} value={skill}>
                {skill}
              </ComboboxItem>
            ))}
            <ComboboxEmpty>
              Can&apos;t find the skill? Use Add to include it.
            </ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {skillError ? (
        <p className="mt-2 text-xs text-[color:var(--tone-red-base)]">
          {skillError}
        </p>
      ) : null}
    </div>
  );
}

type SelectedSkillItemProps = {
  removeSkill: (name: string) => void;
  setSkillLevel: (name: string, value: string | null) => void;
  skill: SelectedSkill;
};

function SelectedSkillItem({
  removeSkill,
  setSkillLevel,
  skill,
}: SelectedSkillItemProps) {
  const selectedLevel = proficiencyLevels.find(
    (level) => level.value === skill.level,
  );

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--line-strong)] bg-white px-3 py-3 sm:justify-between sm:rounded-xl sm:px-4">
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
        {skill.name}
      </span>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Select
          items={proficiencyLevels}
          onValueChange={(value) => setSkillLevel(skill.name, value)}
          value={skill.level}
        >
          <SelectTrigger
            aria-label={`${skill.name} proficiency level`}
            className={`h-9 w-[7.5rem] rounded-full border-[color:var(--line-strong)] px-3 text-xs font-semibold sm:h-8 sm:w-36 sm:rounded-xl ${selectedLevel?.color ?? "bg-[color:var(--surface-alt)]"}`}
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
            {proficiencyLevels.map((level) => (
              <SelectItem
                className={level.optionColor}
                key={level.value}
                value={level.value}
              >
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          aria-label={`Remove ${skill.name}`}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--tone-red-base)] sm:ml-2 sm:h-auto sm:w-auto sm:rounded-none"
          onClick={() => removeSkill(skill.name)}
          type="button"
        >
          x
        </button>
      </div>
    </div>
  );
}

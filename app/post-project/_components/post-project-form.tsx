"use client";

import { useState } from "react";

import { skillSuggestions } from "@/app/post-project/_data";
import { PostProjectBasicFields } from "@/app/post-project/_components/post-project-basic-fields";
import { ClipboardIcon } from "@/app/post-project/_components/post-project-icons";
import { PostProjectLogisticsFields } from "@/app/post-project/_components/post-project-logistics-fields";
import { Separator } from "@/components/ui/separator";

export function PostProjectForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const suggestions = skillSuggestions[selectedCategory] ?? [];

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }

    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((selectedSkill) => selectedSkill !== skill));
  }

  return (
    <section className="relative px-5 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto -mt-14 max-w-[780px]">
        <div className="rounded-[2rem] border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-panel-strong)] sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] text-white">
              <ClipboardIcon />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">
                Project Details
              </h2>
              <p className="text-xs text-[color:var(--ink-muted)]">
                Fill in the details below and students will start sending
                proposals
              </p>
            </div>
          </div>

          <form
            className="space-y-7"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <PostProjectBasicFields
              addSkill={addSkill}
              removeSkill={removeSkill}
              selectedCategory={selectedCategory}
              selectedSkills={selectedSkills}
              setSelectedCategory={setSelectedCategory}
              setSelectedSkills={setSelectedSkills}
              setSkillInput={setSkillInput}
              skillInput={skillInput}
              suggestions={suggestions}
            />
            <Separator />
            <PostProjectLogisticsFields
              selectedBudget={selectedBudget}
              selectedTimeline={selectedTimeline}
              selectedUrgency={selectedUrgency}
              setSelectedBudget={setSelectedBudget}
              setSelectedTimeline={setSelectedTimeline}
              setSelectedUrgency={setSelectedUrgency}
            />
          </form>
        </div>
      </div>
    </section>
  );
}

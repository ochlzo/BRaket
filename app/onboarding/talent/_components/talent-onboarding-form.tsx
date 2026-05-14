"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { saveTalentProfileStepAction } from "@/app/onboarding/talent/_actions/save-talent-profile-step-action";
import {
  TalentSkillsSelector,
  type SelectedSkill,
} from "@/app/onboarding/talent/_components/talent-skills-selector";
import { TalentFormFooter } from "@/app/onboarding/talent/_components/talent-form-footer";
import { TalentFormSectionHeading } from "@/app/onboarding/talent/_components/talent-form-section-heading";
import {
  TalentBasicInfoFields,
  TalentStudentDetailsFields,
} from "@/app/onboarding/talent/_components/talent-profile-form-fields";
import {
  type TalentProfileStepInitialValues,
  validateTalentProfileStepInput,
} from "@/app/onboarding/talent/_lib/talent-profile-step";
import { Separator } from "@/components/ui/separator";
import type { SkillLevel } from "@/lib/types";

type TalentOnboardingFormProps = {
  availableSkills: string[];
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
  initialValues: TalentProfileStepInitialValues;
  onComplete: () => void;
};

export function TalentOnboardingForm({
  availableSkills,
  currentUser,
  initialValues,
  onComplete,
}: TalentOnboardingFormProps) {
  const [headline, setHeadline] = useState(initialValues.headline);
  const [website, setWebsite] = useState(initialValues.website);
  const [bio, setBio] = useState(initialValues.bio);
  const [college, setCollege] = useState(initialValues.college);
  const [course, setCourse] = useState(initialValues.course);
  const [yearLevel, setYearLevel] = useState(initialValues.yearLevel);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>(
    initialValues.skills,
  );
  const [skillSearch, setSkillSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.some(
        (selectedSkill) =>
          selectedSkill.name.toLowerCase() === skill.toLowerCase(),
      ),
  );

  function addSkill(name: string) {
    if (selectedSkills.length >= 10) {
      return;
    }
    const trimmedName = name.trim();
    if (
      trimmedName.length === 0 ||
      selectedSkills.some(
        (skill) => skill.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return;
    }
    setSelectedSkills((prev) => [
      ...prev,
      { level: "INTERMEDIATE", name: trimmedName },
    ]);
    setSkillSearch("");
  }

  function removeSkill(name: string) {
    setSelectedSkills((prev) => prev.filter((skill) => skill.name !== name));
  }
  function clearSkills() {
    setSelectedSkills([]);
  }
  function setSkillLevel(name: string, level: SkillLevel) {
    setSelectedSkills((prev) =>
      prev.map((skill) => (skill.name === name ? { ...skill, level } : skill)),
    );
  }

  function showValidationToast(message: string) {
    const toastId = toast.error(message, {
      action: {
        label: "x",
        onClick: () => toast.dismiss(toastId),
      },
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const input = {
      bio,
      college,
      course,
      headline,
      skills: selectedSkills,
      website,
      yearLevel,
    };
    const validation = validateTalentProfileStepInput(input);

    if (!validation.ok) {
      if (validation.fieldErrors?.yearLevel) {
        showValidationToast("Select your year level before continuing.");
        return;
      }

      if (validation.fieldErrors?.skills) {
        showValidationToast("Select at least 3 skills before continuing.");
        return;
      }

      showValidationToast(validation.message);
      return;
    }

    const formData = new FormData();
    formData.set("headline", headline);
    formData.set("website", website);
    formData.set("bio", bio);
    formData.set("college", college);
    formData.set("course", course);
    formData.set("yearLevel", yearLevel);
    formData.set("skills", JSON.stringify(selectedSkills));

    try {
      setIsSubmitting(true);
      const result = await saveTalentProfileStepAction(formData);

      if (!result.ok) {
        showValidationToast(result.message);
        return;
      }

      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <form className="space-y-5 sm:space-y-7" onSubmit={handleSubmit}>
        <div>
          <TalentFormSectionHeading step={1} title="Basic Information" />
          <TalentBasicInfoFields
            bio={bio}
            currentUser={currentUser}
            headline={headline}
            setBio={setBio}
            setHeadline={setHeadline}
            setWebsite={setWebsite}
            website={website}
          />
        </div>

        <Separator />

        <div>
          <TalentFormSectionHeading step={2} title="Student Details" />
          <TalentStudentDetailsFields
            college={college}
            course={course}
            setCollege={setCollege}
            setCourse={setCourse}
            setYearLevel={setYearLevel}
            yearLevel={yearLevel}
          />
        </div>

        <Separator />

        <TalentSkillsSelector
          addSkill={addSkill}
          availableSkills={availableSkills}
          clearSkills={clearSkills}
          filteredSkills={filteredSkills}
          removeSkill={removeSkill}
          selectedSkills={selectedSkills}
          setSkillLevel={setSkillLevel}
          setSkillSearch={setSkillSearch}
          skillSearch={skillSearch}
        />

        <Separator />

        <TalentFormFooter isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}

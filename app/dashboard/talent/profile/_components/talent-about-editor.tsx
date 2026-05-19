"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { toast } from "sonner";

import { saveTalentProfileStepAction } from "@/app/onboarding/talent/_actions/save-talent-profile-step-action";
import {
  TalentSkillsSelector,
  type SelectedSkill,
} from "@/app/onboarding/talent/_components/talent-skills-selector";
import {
  getTalentProfileStepDirtyFields,
  type TalentProfileStepInitialValues,
  validateTalentProfileStepInput,
} from "@/app/onboarding/talent/_lib/talent-profile-step";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { TalentProfilePageData } from "@/lib/talent-profile/types";
import type { SkillLevel } from "@/lib/types";

import { TalentDialogFrame } from "./talent-dialog-frame";
import { TalentProfileSectionAction } from "./talent-profile-section-action";

type TalentAboutEditorProps = {
  availableSkills: string[];
  profile: TalentProfilePageData;
};

function buildInitialValues(
  profile: TalentProfilePageData,
): TalentProfileStepInitialValues {
  return {
    bio: profile.bio,
    college: profile.college,
    course: profile.course,
    headline: profile.headline,
    skills: profile.skills.map((skill) => ({
      level: skill.level,
      name: skill.name,
    })),
    website: profile.website,
    yearLevel: profile.yearLevel ? String(profile.yearLevel) : "",
  };
}

export function TalentAboutEditor({
  availableSkills,
  profile,
}: TalentAboutEditorProps) {
  const router = useRouter();
  const initialValues = buildInitialValues(profile);
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(initialValues.bio);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>(
    initialValues.skills,
  );
  const [skillSearch, setSkillSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.some(
        (selected) => selected.name.toLowerCase() === skill.toLowerCase(),
      ),
  );

  function resetDraft() {
    setBio(initialValues.bio);
    setSelectedSkills(initialValues.skills);
    setSkillSearch("");
  }

  function showValidationToast(message: string) {
    const toastId = toast.error(message, {
      action: { label: "x", onClick: () => toast.dismiss(toastId) },
    });
  }

  function addSkill(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName || selectedSkills.length >= 10) return;
    if (
      selectedSkills.some(
        (skill) => skill.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return;
    }
    setSelectedSkills((current) => [
      ...current,
      { level: "INTERMEDIATE", name: trimmedName },
    ]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !event.currentTarget.reportValidity()) return;

    const input = { ...initialValues, bio, skills: selectedSkills };
    const validation = validateTalentProfileStepInput(input);
    if (!validation.ok) {
      showValidationToast(validation.fieldErrors?.skills ?? validation.message);
      return;
    }

    const dirtyFields = getTalentProfileStepDirtyFields(initialValues, input);
    if (dirtyFields.length === 0) {
      setOpen(false);
      return;
    }

    const formData = new FormData();
    formData.set("headline", input.headline);
    formData.set("website", input.website);
    formData.set("bio", input.bio);
    formData.set("college", input.college);
    formData.set("course", input.course);
    formData.set("yearLevel", input.yearLevel);
    formData.set("skills", JSON.stringify(input.skills));
    formData.set("dirtyFields", JSON.stringify(dirtyFields));

    try {
      setIsSubmitting(true);
      const result = await saveTalentProfileStepAction(formData);
      if (!result.ok) {
        showValidationToast(result.message);
        return;
      }
      toast.success("About and skills updated.");
      router.refresh();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <TalentProfileSectionAction
        label="Edit about and skills"
        onClick={() => {
          resetDraft();
          setOpen(true);
        }}
      >
        <PencilLine className="size-4" />
      </TalentProfileSectionAction>
      <TalentDialogFrame
        description="Update the bio and skill tags shown on your talent profile."
        open={open}
        onOpenChange={setOpen}
        title="Edit about and skills"
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold" htmlFor="talent-bio">
                Bio <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                className="min-h-40 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm sm:rounded-xl"
                id="talent-bio"
                onChange={(event) => setBio(event.currentTarget.value)}
                required
                value={bio}
              />
            </div>
            <Separator />
            <TalentSkillsSelector
              addSkill={addSkill}
              availableSkills={availableSkills}
              clearSkills={() => setSelectedSkills([])}
              filteredSkills={filteredSkills}
              removeSkill={(name) =>
                setSelectedSkills((current) =>
                  current.filter((skill) => skill.name !== name),
                )
              }
              selectedSkills={selectedSkills}
              setSkillLevel={(name, level: SkillLevel) =>
                setSelectedSkills((current) =>
                  current.map((skill) =>
                    skill.name === name ? { ...skill, level } : skill,
                  ),
                )
              }
              setSkillSearch={setSkillSearch}
              skillSearch={skillSearch}
            />
          </div>
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                className="rounded-xl"
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="rounded-xl" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </TalentDialogFrame>
    </>
  );
}

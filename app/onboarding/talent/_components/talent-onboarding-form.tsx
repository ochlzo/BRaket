"use client";
import { useState } from "react";
import {
  TalentSkillsSelector,
  type SelectedSkill,
} from "@/app/onboarding/talent/_components/talent-skills-selector";
import { TalentFormFooter } from "@/app/onboarding/talent/_components/talent-form-footer";
import { TalentFormSectionHeading } from "@/app/onboarding/talent/_components/talent-form-section-heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SkillLevel } from "@/lib/types";

const isTesting =
  process.env._TESTING === "true" ||
  process.env.NEXT_PUBLIC__TESTING === "true" ||
  process.env.NEXT_PUBLIC_TESTING === "true";
const yearLevelOptions = [
  { label: "1st year", value: "1" },
  { label: "2nd year", value: "2" },
  { label: "3rd year", value: "3" },
  { label: "4th year", value: "4" },
];

type TalentOnboardingFormProps = {
  availableSkills: string[];
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
};

export function TalentOnboardingForm({
  availableSkills,
  currentUser,
}: TalentOnboardingFormProps) {
  const [headline, setHeadline] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [notice, setNotice] = useState("");

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.some(
        (selectedSkill) =>
          selectedSkill.name.toLowerCase() === skill.toLowerCase(),
      ),
  );

  const bioLength = bio.length;
  const bioLengthClassName =
    bioLength < 150 || bioLength > 500
      ? "text-[color:var(--tone-red-base)]"
      : "text-[color:var(--ink-soft)]";
  const headlineLength = headline.length;
  const headlineLengthClassName =
    headlineLength < 25 || headlineLength > 70
      ? "text-[color:var(--tone-red-base)]"
      : "text-[color:var(--ink-soft)]";
  const fullName = [currentUser.firstName, currentUser.lastName]
    .filter(Boolean)
    .join(" ");

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

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <form
        className="space-y-5 sm:space-y-7"
        onSubmit={(event) => {
          event.preventDefault();
          setNotice("Talent onboarding is UI-only for now.");
        }}
      >
        <div>
          <TalentFormSectionHeading step={1} title="Basic Information" />

          <div className="space-y-4 sm:space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-username">
                  Username{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm text-[color:var(--ink-muted)] sm:h-11 sm:rounded-xl"
                  id="ob-username"
                  placeholder="e.g. maria-santos"
                  readOnly
                  required
                  value={currentUser.username}
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-fullname">
                  Full Name{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm text-[color:var(--ink-muted)] sm:h-11 sm:rounded-xl"
                  id="ob-fullname"
                  placeholder="Maria Santos"
                  readOnly
                  required
                  value={fullName}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-website">
                Website
              </Label>
              <Input
                className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                id="ob-website"
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://yourportfolio.com"
                type="url"
                value={website}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-headline">
                Headline{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                id="ob-headline"
                maxLength={70}
                minLength={25}
                onChange={(event) => setHeadline(event.target.value)}
                placeholder="e.g. UI/UX Designer & Prototyping Specialist"
                required
                value={headline}
              />
              {!isTesting ? (
                <p className={`text-xs ${headlineLengthClassName}`}>
                  {headlineLength}/70 characters (minimum 25)
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-bio">
                Bio <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                className="min-h-28 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm sm:rounded-xl"
                id="ob-bio"
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                required
                rows={4}
                value={bio}
              />
              {!isTesting ? (
                <p className={`text-xs ${bioLengthClassName}`}>
                  {bioLength}/500 characters (minimum 150)
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <TalentFormSectionHeading step={2} title="Student Details" />

          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-college">
                College{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                id="ob-college"
                onChange={(event) => setCollege(event.target.value)}
                placeholder="e.g. College of Science"
                required
                value={college}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-course">
                  Course{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                  id="ob-course"
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="e.g. BS Information Technology"
                  required
                  value={course}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-year">
                  Year Level{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Select
                  id="ob-year"
                  items={yearLevelOptions}
                  name="yearLevel"
                  onValueChange={(value) => setYearLevel(value ?? "")}
                  required
                  value={yearLevel || null}
                >
                  <SelectTrigger className="h-10 w-full rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
                    {yearLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <TalentSkillsSelector
          addSkill={addSkill}
          clearSkills={clearSkills}
          filteredSkills={filteredSkills}
          removeSkill={removeSkill}
          selectedSkills={selectedSkills}
          setSkillLevel={setSkillLevel}
          setSkillSearch={setSkillSearch}
          skillSearch={skillSearch}
        />

        <Separator />

        <TalentFormFooter notice={notice} />
      </form>
    </div>
  );
}

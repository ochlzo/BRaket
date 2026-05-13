"use client";

import { useState } from "react";

import {
  TalentSkillsSelector,
  type SelectedSkill,
} from "@/app/onboarding/talent/_components/talent-skills-selector";
import { availableSkills } from "@/app/onboarding/talent/_data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { SkillLevel } from "@/lib/types";

const isTesting =
  process.env._TESTING === "true" ||
  process.env.NEXT_PUBLIC__TESTING === "true" ||
  process.env.NEXT_PUBLIC_TESTING === "true";

type TalentOnboardingFormProps = {
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
};

export function TalentOnboardingForm({
  currentUser,
}: TalentOnboardingFormProps) {
  const [headline, setHeadline] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [notice, setNotice] = useState("");

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.some((selectedSkill) => selectedSkill.name === skill),
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

    setSelectedSkills((prev) => [...prev, { level: "intermediate", name }]);
    setSkillSearch("");
  }

  function removeSkill(name: string) {
    setSelectedSkills((prev) => prev.filter((skill) => skill.name !== name));
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
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground sm:mb-4 sm:text-lg">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-orange)] text-[0.7rem] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs">
              1
            </span>
            Basic Information
          </h2>

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
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground sm:mb-4 sm:text-lg">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-orange)] text-[0.7rem] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs">
              2
            </span>
            Hourly Rates
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-min">
                Min Rate (PHP/hr){" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
                  PHP
                </span>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-12 text-sm sm:h-11 sm:rounded-xl"
                  id="ob-min"
                  min="1"
                  onChange={(event) => setMinRate(event.target.value)}
                  placeholder="500"
                  required
                  type="number"
                  value={minRate}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-max">
                Max Rate (PHP/hr){" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
                  PHP
                </span>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-12 text-sm sm:h-11 sm:rounded-xl"
                  id="ob-max"
                  min="1"
                  onChange={(event) => setMaxRate(event.target.value)}
                  placeholder="1000"
                  required
                  type="number"
                  value={maxRate}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <TalentSkillsSelector
          addSkill={addSkill}
          filteredSkills={filteredSkills}
          removeSkill={removeSkill}
          selectedSkills={selectedSkills}
          setSkillLevel={setSkillLevel}
          setSkillSearch={setSkillSearch}
          skillSearch={skillSearch}
        />

        <Separator />

        {notice ? (
          <p
            className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-soft)]"
            role="status"
          >
            {notice}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            className="min-h-11 rounded-full bg-[color:var(--brand-orange)] px-5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] sm:h-12 sm:rounded-xl sm:px-8"
            type="submit"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

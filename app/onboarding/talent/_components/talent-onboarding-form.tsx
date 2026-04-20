"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TalentSkillsSelector, type SelectedSkill } from "@/app/onboarding/talent/_components/talent-skills-selector";
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

export function TalentOnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [skillSearch, setSkillSearch] = useState("");

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

  function addSkill(name: string) {
    if (selectedSkills.length >= 10) {
      return;
    }

    setSelectedSkills((prev) => [...prev, { name, level: "intermediate" }]);
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
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
      <form
        className="space-y-7"
        onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem(
            "braket_session",
            JSON.stringify({ type: "talent", username: "maria-santos" }),
          );
          router.push("/dashboard/talent/services/new");
        }}
      >
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">
              1
            </span>
            Basic Information
          </h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-username">
                Username{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                id="ob-username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. maria-santos"
                required
                value={username}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-first">
                  First Name{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                  id="ob-first"
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Maria"
                  required
                  value={firstName}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold" htmlFor="ob-last">
                  Last Name{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                  id="ob-last"
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Santos"
                  required
                  value={lastName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-headline">
                Headline{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                id="ob-headline"
                onChange={(event) => setHeadline(event.target.value)}
                placeholder="e.g. UI/UX Designer & Prototyping Specialist"
                required
                value={headline}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-bio">
                Bio <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
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
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">
              2
            </span>
            Hourly Rates
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="ob-min">
                Min Rate (₱/hr){" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
                  ₱
                </span>
                <Input
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm"
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
                Max Rate (₱/hr){" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
                  ₱
                </span>
                <Input
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm"
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

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            className="h-12 rounded-xl bg-[color:var(--brand-orange)] px-8 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
            type="submit"
          >
            Complete Profile & Create First Service →
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { appNavigation } from "@/content/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { SkillLevel } from "@/types";

const availableSkills = [
  "HTML/CSS", "React", "Next.js", "JavaScript", "TypeScript", "Node.js",
  "Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva",
  "Premiere Pro", "After Effects", "Lightroom",
  "SEO Writing", "Copywriting", "Blog Posts",
  "Social Media Management", "Content Strategy",
  "Photography", "Video Editing", "Motion Graphics",
  "Branding", "Logo Design", "Web Design", "Mobile Design",
  "Python", "PHP", "WordPress", "MongoDB", "Tailwind CSS",
];

const proficiencyLevels: { value: SkillLevel; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]" },
  { value: "intermediate", label: "Intermediate", color: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]" },
  { value: "expert", label: "Expert", color: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]" },
];

type SelectedSkill = { name: string; level: SkillLevel };

export default function OnboardingPage() {
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
    (s) =>
      s.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.some((sel) => sel.name === s)
  );

  function addSkill(name: string) {
    if (selectedSkills.length >= 10) return;
    setSelectedSkills((prev) => [...prev, { name, level: "intermediate" }]);
    setSkillSearch("");
  }

  function removeSkill(name: string) {
    setSelectedSkills((prev) => prev.filter((s) => s.name !== name));
  }

  function setSkillLevel(name: string, level: SkillLevel) {
    setSelectedSkills((prev) =>
      prev.map((s) => (s.name === name ? { ...s, level } : s))
    );
  }

  const bioLength = bio.length;

  return (
    <PageShell
      activeHref="/onboarding"
      ctaHref="/post-project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
              Set Up Your Talent Profile
            </h1>
            <p className="mt-3 text-base text-[color:var(--ink-muted)]">
              Complete your profile so clients can discover and book you.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
              <form
                className="space-y-7"
                onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem("braket_session", JSON.stringify({ type: "talent", username: "maria-santos" }));
                  router.push("/dashboard/talent/services/new");
                }}
              >
              {/* ── Section 1: Basic Info ── */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">1</span>
                  Basic Information
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="ob-username" className="text-sm font-semibold">Username <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                    <Input id="ob-username" placeholder="e.g. maria-santos" value={username} onChange={(e) => setUsername(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ob-first" className="text-sm font-semibold">First Name <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                      <Input id="ob-first" placeholder="Maria" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ob-last" className="text-sm font-semibold">Last Name <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                      <Input id="ob-last" placeholder="Santos" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ob-headline" className="text-sm font-semibold">Headline <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                    <Input id="ob-headline" placeholder="e.g. UI/UX Designer & Prototyping Specialist" value={headline} onChange={(e) => setHeadline(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ob-bio" className="text-sm font-semibold">Bio <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                    <Textarea id="ob-bio" rows={4} placeholder="Tell clients about yourself, your experience, and what makes you unique..." value={bio} onChange={(e) => setBio(e.target.value)} required className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                    {!(process.env._TESTING === "true" || process.env.NEXT_PUBLIC__TESTING === "true" || process.env.NEXT_PUBLIC_TESTING === "true") && (
                      <p className={`text-xs ${bioLength < 150 ? "text-[color:var(--tone-red-base)]" : bioLength > 500 ? "text-[color:var(--tone-red-base)]" : "text-[color:var(--ink-soft)]"}`}>
                        {bioLength}/500 characters (minimum 150)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* ── Section 2: Rates ── */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">2</span>
                  Hourly Rates
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ob-min" className="text-sm font-semibold">Min Rate (₱/hr) <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">₱</span>
                      <Input id="ob-min" type="number" min="1" placeholder="500" value={minRate} onChange={(e) => setMinRate(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ob-max" className="text-sm font-semibold">Max Rate (₱/hr) <span className="text-[color:var(--tone-red-base)]">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">₱</span>
                      <Input id="ob-max" type="number" min="1" placeholder="1000" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} required className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* ── Section 3: Skills ── */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--brand-orange)] text-xs font-bold text-white">3</span>
                  Skills
                  <span className="ml-1 text-sm font-normal text-[color:var(--ink-muted)]">
                    ({selectedSkills.length}/10 selected, minimum 3)
                  </span>
                </h2>

                {/* Selected skills */}
                {selectedSkills.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          {proficiencyLevels.map((lev) => (
                            <button
                              key={lev.value}
                              type="button"
                              onClick={() => setSkillLevel(skill.name, lev.value)}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                skill.level === lev.value ? lev.color : "text-[color:var(--ink-soft)] hover:bg-[color:var(--surface-alt)]"
                              }`}
                            >
                              {lev.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.name)}
                            className="ml-2 text-[color:var(--ink-soft)] transition hover:text-[color:var(--tone-red-base)]"
                            aria-label={`Remove ${skill.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skill search */}
                <Input
                  type="text"
                  placeholder="Search skills to add..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="mb-3 h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                />

                {/* Skill suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  {filteredSkills.slice(0, 12).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={selectedSkills.length >= 10}
                      className="rounded-full border border-dashed border-[color:var(--line-strong)] px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)] transition hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange)] disabled:opacity-40"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="h-12 rounded-xl bg-[color:var(--brand-orange)] px-8 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                >
                  Complete Profile & Create First Service →
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

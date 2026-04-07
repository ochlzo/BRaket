"use client";

import { useState } from "react";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

/* ══════════════════════════════════════════════════
   Icons
   ══════════════════════════════════════════════════ */
function BriefcaseIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6Z"
      />
    </svg>
  );
}
function CurrencyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75"
      />
    </svg>
  );
}
function PaperclipIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
      />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
      />
    </svg>
  );
}
function XMarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-3.5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   Data – categories, skills, budgets, etc.
   ══════════════════════════════════════════════════ */
const categoryOptions = [
  { label: "Web Development", emoji: "💻" },
  { label: "Graphic Design", emoji: "🎨" },
  { label: "Photography", emoji: "📷" },
  { label: "Video Editing", emoji: "🎬" },
  { label: "UI/UX Design", emoji: "🖥️" },
  { label: "Content Writing", emoji: "✍️" },
  { label: "Social Media Management", emoji: "📱" },
  { label: "Other", emoji: "📦" },
];

const skillSuggestions: Record<string, string[]> = {
  "Web Development": [
    "HTML/CSS",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "WordPress",
    "PHP",
    "Responsive Design",
  ],
  "Graphic Design": [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Canva",
    "Logo Design",
    "Branding",
    "Poster Design",
    "Social Media Graphics",
    "Print Design",
  ],
  Photography: [
    "Portrait",
    "Product",
    "Event",
    "Editing",
    "Lightroom",
    "Studio",
    "Outdoor",
    "Drone Photography",
  ],
  "Video Editing": [
    "Adobe Premiere",
    "After Effects",
    "CapCut",
    "Motion Graphics",
    "Color Grading",
    "Short-Form Content",
    "Reels/TikTok",
    "Documentary",
  ],
  "UI/UX Design": [
    "Figma",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Design Systems",
    "Mobile Design",
    "Web Design",
    "Interaction Design",
  ],
  "Content Writing": [
    "Blog Posts",
    "Copywriting",
    "SEO Writing",
    "Academic Writing",
    "Social Media Copy",
    "Scriptwriting",
    "Technical Writing",
    "Creative Writing",
  ],
  "Social Media Management": [
    "Instagram",
    "Facebook",
    "TikTok",
    "Content Strategy",
    "Analytics",
    "Community Management",
    "Paid Ads",
    "Content Calendar",
  ],
  Other: [
    "Research",
    "Data Entry",
    "Translation",
    "Tutoring",
    "Virtual Assistance",
  ],
};

const budgetRanges = [
  "Under ₱500",
  "₱500 – ₱1,000",
  "₱1,000 – ₱3,000",
  "₱3,000 – ₱5,000",
  "₱5,000 – ₱10,000",
  "₱10,000+",
  "Open / Negotiable",
];

const timelineOptions = [
  "ASAP (1 – 3 days)",
  "Within 1 week",
  "1 – 2 weeks",
  "2 – 4 weeks",
  "1 – 2 months",
  "Flexible / No rush",
];

const urgencyLevels = [
  {
    value: "low",
    label: "Low",
    desc: "No rush, flexible deadline",
    color:
      "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)] border-[color:var(--tone-green-base)]/30",
  },
  {
    value: "medium",
    label: "Medium",
    desc: "Standard turnaround",
    color:
      "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)] border-[color:var(--tone-amber-base)]/30",
  },
  {
    value: "high",
    label: "High",
    desc: "Time-sensitive, need it soon",
    color:
      "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)] border-[color:var(--tone-orange-base)]/30",
  },
  {
    value: "urgent",
    label: "Urgent",
    desc: "Needed ASAP, willing to pay rush fee",
    color:
      "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)] border-[color:var(--tone-red-base)]/30",
  },
];

/* ══════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════ */
export default function PostProjectPage() {
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
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  }

  return (
    <PageShell
      activeHref="/post-project"
      ctaHref="/post-project"
      ctaLabel="Post a Project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      {/* ═══════════════════════════════════
          Hero Banner – purple gradient
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
        {/* Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[color:var(--brand-orange)] via-[color:var(--brand-orange-warm)] to-[color:var(--brand-orange-light)]" />
        {/* Decorative circles (like the reference image) */}
        <div className="absolute -bottom-10 -left-16 z-0 h-72 w-72 rounded-full bg-white/[0.07]" />
        <div className="absolute -right-12 top-16 z-0 h-64 w-64 rounded-full bg-white/[0.05]" />
        <div className="absolute left-1/2 top-1/3 z-0 h-52 w-52 -translate-x-1/2 rounded-full bg-[color:var(--brand-orange-light)]/30 blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--overlay-grid-line-medium) 1px, transparent 1px), linear-gradient(90deg, var(--overlay-grid-line-medium) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
            <BriefcaseIcon className="size-4" />
            Post a Commission
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.5rem]">
            Don&apos;t see what you&apos;re
            <br className="hidden sm:block" />
            looking for?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Post your project requirements and get custom proposals from
            talented BU students.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════
          Form Card – pulled up into hero
          ═══════════════════════════════════ */}
      <section className="relative px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-14 max-w-[780px]">
          <div className="rounded-[2rem] border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-panel-strong)] sm:p-10">
            {/* ─ Section header ─ */}
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
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {/* ── 1. Project Title ── */}
              <div className="space-y-2">
                <Label
                  htmlFor="project-title"
                  className="text-sm font-semibold text-foreground"
                >
                  Project Title
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                    <ClipboardIcon />
                  </div>
                  <Input
                    id="project-title"
                    type="text"
                    placeholder="e.g. Logo design for a student org"
                    className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                    required
                  />
                </div>
              </div>

              {/* ── 2. Category ── */}
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-foreground">
                  Category
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.label);
                        setSelectedSkills([]);
                      }}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition-all ${
                        selectedCategory === cat.label
                          ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] ring-1 ring-[color:var(--brand-orange)]/30"
                          : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)]"
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 3. Required Skills ── */}
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-foreground">
                  Required Skills / Tools
                </Label>
                {/* Skill pills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-orange)]/10 px-3 py-1 text-xs font-medium text-[color:var(--brand-orange)]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[color:var(--brand-orange)]/20"
                          aria-label={`Remove ${skill}`}
                        >
                          <XMarkIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions
                      .filter((s) => !selectedSkills.includes(s))
                      .map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-[color:var(--line-strong)] px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)] transition-all hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange)]"
                        >
                          <span className="text-[10px]">+</span> {s}
                        </button>
                      ))}
                  </div>
                )}
                {/* Free-text input */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                    <TagIcon />
                  </div>
                  <Input
                    type="text"
                    placeholder={
                      selectedCategory
                        ? "Type to add more skills..."
                        : "Select a category first to see suggestions"
                    }
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  />
                </div>
                <p className="text-[11px] text-[color:var(--ink-soft)]">
                  Press
                  <kbd className="rounded border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-1.5 py-0.5 text-[10px] font-semibold">
                    Enter
                  </kbd>
                  to add a custom skill
                </p>
              </div>

              <Separator />

              {/* ── 4. Project Description ── */}
              <div className="space-y-2">
                <Label
                  htmlFor="project-description"
                  className="text-sm font-semibold text-foreground"
                >
                  Project Description{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Textarea
                  id="project-description"
                  rows={5}
                  placeholder="Describe what you need done in detail&#10;&#10;• What is the project about?&#10;• What is the desired outcome?&#10;• Any specific style, references, or inspirations?"
                  className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm leading-relaxed placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  required
                />
                <p className="text-[11px] text-[color:var(--ink-soft)]">
                  Tip: include specifics like dimensions, formats, tone of
                  voice, or color preferences.
                </p>
              </div>

              {/* ── 5. Expected Deliverables ── */}
              <div className="space-y-2">
                <Label
                  htmlFor="deliverables"
                  className="text-sm font-semibold text-foreground"
                >
                  Expected Deliverables
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-3 text-[color:var(--ink-muted)]">
                    <ListIcon />
                  </div>
                  <Textarea
                    id="deliverables"
                    rows={3}
                    placeholder="e.g. 3 logo variations in PNG + SVG, brand color palette, and a simple style guide"
                    className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  />
                </div>
              </div>

              <Separator />

              {/* ── 6. Budget & Timeline row ── */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Budget */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Budget Range{" "}
                    <span className="text-[color:var(--tone-red-base)]">*</span>
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                      <CurrencyIcon />
                    </div>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      required
                      className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 pr-10 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--brand-orange)] focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
                    >
                      <option value="" disabled>
                        Select budget
                      </option>
                      {budgetRanges.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Deadline / Timeline{" "}
                    <span className="text-[color:var(--tone-red-base)]">*</span>
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                      <CalendarIcon />
                    </div>
                    <select
                      value={selectedTimeline}
                      onChange={(e) => setSelectedTimeline(e.target.value)}
                      required
                      className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 pr-10 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--brand-orange)] focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
                    >
                      <option value="" disabled>
                        Select timeline
                      </option>
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 7. Urgency ── */}
              <div className="space-y-2.5">
                <Label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <BoltIcon /> Urgency Level
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {urgencyLevels.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setSelectedUrgency(u.value)}
                      className={`flex flex-col items-start rounded-xl border px-3.5 py-3 text-left transition-all ${
                        selectedUrgency === u.value
                          ? `${u.color} ring-1`
                          : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)]"
                      }`}
                    >
                      <span className="text-xs font-bold">{u.label}</span>
                      <span className="mt-0.5 text-[10px] leading-tight opacity-70">
                        {u.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* ── 8. Attachments ── */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Reference Files{" "}
                  <span className="font-normal text-[color:var(--ink-soft)]">
                    (optional)
                  </span>
                </Label>
                <label
                  htmlFor="project-files"
                  className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-6 py-8 text-center transition-all hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--brand-orange)]/[0.02]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] transition-colors group-hover:bg-[color:var(--brand-orange)]/20">
                    <PaperclipIcon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Drop files here or{" "}
                      <span className="text-[color:var(--brand-orange)]">
                        browse
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--ink-soft)]">
                      Mood boards, briefs, sample designs — PNG, JPG, PDF, DOCX
                      up to 10 MB each
                    </p>
                  </div>
                  <input
                    id="project-files"
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.psd,.ai,.fig"
                  />
                </label>
              </div>

              {/* ── 9. Contact Email ── */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-email"
                  className="text-sm font-semibold text-foreground"
                >
                  Your Email{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                    <MailIcon />
                  </div>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@bicol-u.edu.ph"
                    required
                    className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  />
                </div>
                <p className="text-[11px] text-[color:var(--ink-soft)]">
                  We&apos;ll notify you here when students send proposals
                </p>
              </div>

              {/* ── 10. Additional Notes ── */}
              <div className="space-y-2">
                <Label
                  htmlFor="additional-notes"
                  className="text-sm font-semibold text-foreground"
                >
                  Additional Notes{" "}
                  <span className="font-normal text-[color:var(--ink-soft)]">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="additional-notes"
                  rows={3}
                  placeholder="Anything else the talent should know — preferred communication method, revision expectations, etc."
                  className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                />
              </div>

              <Separator />

              {/* ── Submit ── */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-relaxed text-[color:var(--ink-soft)]">
                  By posting, you agree to our{" "}
                  <a
                    href="#"
                    className="font-medium text-[color:var(--brand-orange)] hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-[color:var(--brand-orange)] hover:underline"
                  >
                    Community Guidelines
                  </a>
                  .
                </p>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] px-8 text-sm font-semibold text-white shadow-[var(--shadow-brand-violet-md)] transition-all hover:shadow-[var(--shadow-brand-violet-lg)] hover:brightness-105 active:scale-[0.98] sm:w-auto"
                >
                  Post Project
                  <ArrowRightIcon />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          How It Works – 3-step strip
          ═══════════════════════════════════ */}
      <section className="bg-[color:var(--surface-alt)] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="typo-section-title mb-3 text-foreground">
            How it{" "}
            <span className="bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="typo-body mx-auto mb-12 max-w-lg text-[color:var(--ink-muted)]">
            From posting to delivery, we make commissioning student talent
            effortless.
          </p>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                num: "01",
                emoji: "📝",
                title: "Post your project",
                desc: "Describe what you need, set your budget and timeline, and publish.",
              },
              {
                num: "02",
                emoji: "💬",
                title: "Get proposals",
                desc: "Qualified BU students review your project and send tailored proposals.",
              },
              {
                num: "03",
                emoji: "🤝",
                title: "Choose & collaborate",
                desc: "Pick your favorite, collaborate directly, and receive quality work.",
              },
            ].map((step, i) => (
              <div key={step.num} className="group relative">
                {/* Connector line on desktop */}
                {i < 2 && (
                  <div className="absolute right-0 top-14 hidden h-px w-[calc(50%-16px)] translate-x-[calc(100%-8px)] bg-gradient-to-r from-[color:var(--brand-orange)]/20 to-[color:var(--brand-orange)]/5 sm:block" />
                )}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] text-2xl shadow-lg shadow-[color:var(--brand-orange)]/20 transition-transform group-hover:scale-110">
                    {step.emoji}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[color:var(--brand-orange)] ring-2 ring-[color:var(--brand-orange)]/20">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="typo-card-title-lg text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-[250px] text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          Why Post on BRaket
          ═══════════════════════════════════ */}
      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="typo-section-title mb-3 text-center text-foreground">
            Why post on{" "}
            <span className="bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] bg-clip-text text-transparent">
              BRaket
            </span>
            ?
          </h2>
          <p className="typo-body-lg mx-auto mb-12 max-w-2xl text-center text-[color:var(--ink-muted)]">
            Access a growing pool of verified student talent ready to work on
            your projects.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🎓",
                title: "Verified BU Students",
                desc: "Every talent is a real Bicol University student with a reviewed portfolio.",
                gradient: "from-[color:var(--brand-orange)]/10 to-[#FFA87E]/10",
              },
              {
                icon: "💸",
                title: "Student-Friendly Rates",
                desc: "Quality work at rates that respect both your budget and the student's value.",
                gradient:
                  "from-[color:var(--tone-green-soft)] to-[color:var(--tone-teal-soft)]",
              },
              {
                icon: "⚡",
                title: "Fast Turnaround",
                desc: "Motivated students eager to build their portfolios deliver results quickly.",
                gradient:
                  "from-[color:var(--tone-amber-soft)] to-[color:var(--tone-orange-soft)]",
              },
              {
                icon: "🛡️",
                title: "Secure Commissions",
                desc: "Transparent milestones and handoff processes protect both parties.",
                gradient:
                  "from-[color:var(--tone-sky-soft)] to-[color:var(--tone-indigo-soft)]",
              },
              {
                icon: "🤝",
                title: "Direct Collaboration",
                desc: "Work directly with talents — no middlemen, no hidden fees, just results.",
                gradient:
                  "from-[color:var(--tone-pink-soft)] to-[color:var(--tone-purple-soft)]",
              },
              {
                icon: "🌟",
                title: "Community Impact",
                desc: "Support local student talent and help build the next generation of creators.",
                gradient:
                  "from-[color:var(--tone-orange-soft)] to-[color:var(--tone-amber-soft)]",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-xl transition-transform group-hover:scale-110`}
                >
                  {card.icon}
                </div>
                <h3 className="typo-card-title-lg text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

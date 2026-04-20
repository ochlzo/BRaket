import { categoryOptions } from "@/app/post-project/_data";
import {
  ClipboardIcon,
  ListIcon,
  TagIcon,
  XMarkIcon,
} from "@/app/post-project/_components/post-project-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostProjectBasicFieldsProps = {
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  selectedCategory: string;
  selectedSkills: string[];
  setSelectedCategory: (value: string) => void;
  setSelectedSkills: (value: string[]) => void;
  setSkillInput: (value: string) => void;
  skillInput: string;
  suggestions: string[];
};

export function PostProjectBasicFields({
  addSkill,
  removeSkill,
  selectedCategory,
  selectedSkills,
  setSelectedCategory,
  setSelectedSkills,
  setSkillInput,
  skillInput,
  suggestions,
}: PostProjectBasicFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="project-title">
          Project Title
          <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <ClipboardIcon />
          </div>
          <Input
            className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
            id="project-title"
            placeholder="e.g. Logo design for a student org"
            required
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">
          Category
          <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categoryOptions.map((category) => (
            <button
              key={category.label}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition-all ${
                selectedCategory === category.label
                  ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] ring-1 ring-[color:var(--brand-orange)]/30"
                  : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)]"
              }`}
              onClick={() => {
                setSelectedCategory(category.label);
                setSelectedSkills([]);
              }}
              type="button"
            >
              <span className="text-base">{category.emoji}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">
          Required Skills / Tools
        </Label>
        {selectedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-orange)]/10 px-3 py-1 text-xs font-medium text-[color:var(--brand-orange)]"
              >
                {skill}
                <button
                  aria-label={`Remove ${skill}`}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[color:var(--brand-orange)]/20"
                  onClick={() => removeSkill(skill)}
                  type="button"
                >
                  <XMarkIcon />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        {suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter((suggestion) => !selectedSkills.includes(suggestion))
              .map((suggestion) => (
                <button
                  key={suggestion}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-[color:var(--line-strong)] px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)] transition-all hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange)]"
                  onClick={() => addSkill(suggestion)}
                  type="button"
                >
                  <span className="text-[10px]">+</span> {suggestion}
                </button>
              ))}
          </div>
        ) : null}
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <TagIcon />
          </div>
          <Input
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
            onChange={(event) => setSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill(skillInput);
              }
            }}
            placeholder={
              selectedCategory
                ? "Type to add more skills..."
                : "Select a category first to see suggestions"
            }
            type="text"
            value={skillInput}
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

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="project-description">
          Project Description{" "}
          <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <Textarea
          className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm leading-relaxed placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
          id="project-description"
          placeholder="Describe what you need done in detail&#10;&#10;• What is the project about?&#10;• What is the desired outcome?&#10;• Any specific style, references, or inspirations?"
          required
          rows={5}
        />
        <p className="text-[11px] text-[color:var(--ink-soft)]">
          Tip: include specifics like dimensions, formats, tone of voice, or
          color preferences.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="deliverables">
          Expected Deliverables
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-3 text-[color:var(--ink-muted)]">
            <ListIcon />
          </div>
          <Textarea
            className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
            id="deliverables"
            placeholder="e.g. 3 logo variations in PNG + SVG, brand color palette, and a simple style guide"
            rows={3}
          />
        </div>
      </div>
    </>
  );
}

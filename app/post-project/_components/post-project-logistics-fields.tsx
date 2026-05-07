import { budgetRanges, timelineOptions, urgencyLevels } from "@/app/post-project/_data";
import {
  ArrowRightIcon,
  BoltIcon,
  CalendarIcon,
  ChevronDownIcon,
  CurrencyIcon,
  MailIcon,
  PaperclipIcon,
} from "@/app/post-project/_components/post-project-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostProjectLogisticsFieldsProps = {
  selectedBudget: string;
  selectedTimeline: string;
  selectedUrgency: string;
  setSelectedBudget: (value: string) => void;
  setSelectedTimeline: (value: string) => void;
  setSelectedUrgency: (value: string) => void;
};

export function PostProjectLogisticsFields({
  selectedBudget,
  selectedTimeline,
  selectedUrgency,
  setSelectedBudget,
  setSelectedTimeline,
  setSelectedUrgency,
}: PostProjectLogisticsFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Budget Range <span className="text-[color:var(--tone-red-base)]">*</span>
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <CurrencyIcon />
            </div>
            <select
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 pr-10 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--brand-orange)] focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
              onChange={(event) => setSelectedBudget(event.target.value)}
              required
              value={selectedBudget}
            >
              <option disabled value="">
                Select budget
              </option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

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
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 pr-10 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--brand-orange)] focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
              onChange={(event) => setSelectedTimeline(event.target.value)}
              required
              value={selectedTimeline}
            >
              <option disabled value="">
                Select timeline
              </option>
              {timelineOptions.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {timeline}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <BoltIcon /> Urgency Level
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {urgencyLevels.map((urgency) => (
            <button
              key={urgency.value}
              className={`flex flex-col items-start rounded-xl border px-3.5 py-3 text-left transition-all ${
                selectedUrgency === urgency.value
                  ? `${urgency.color} ring-1`
                  : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)]"
              }`}
              onClick={() => setSelectedUrgency(urgency.value)}
              type="button"
            >
              <span className="text-xs font-bold">{urgency.label}</span>
              <span className="mt-0.5 text-[10px] leading-tight opacity-70">
                {urgency.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Reference Files{" "}
          <span className="font-normal text-[color:var(--ink-soft)]">
            (optional)
          </span>
        </Label>
        <label
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-6 py-8 text-center transition-all hover:border-[color:var(--brand-orange)]/40 hover:bg-[color:var(--brand-orange)]/[0.02]"
          htmlFor="project-files"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] transition-colors group-hover:bg-[color:var(--brand-orange)]/20">
            <PaperclipIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Drop files here or{" "}
              <span className="text-[color:var(--brand-orange)]">browse</span>
            </p>
            <p className="mt-1 text-xs text-[color:var(--ink-soft)]">
              Mood boards, briefs, sample designs — PNG, JPG, PDF, DOCX up to
              10 MB each
            </p>
          </div>
          <input
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.psd,.ai,.fig"
            className="sr-only"
            id="project-files"
            multiple
            type="file"
          />
        </label>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="contact-email">
          Your Email <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-11 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
            id="contact-email"
            placeholder="you@bicol-u.edu.ph"
            required
            type="email"
          />
        </div>
        <p className="text-[11px] text-[color:var(--ink-soft)]">
          We&apos;ll notify you here when students send proposals
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="additional-notes">
          Additional Notes{" "}
          <span className="font-normal text-[color:var(--ink-soft)]">
            (optional)
          </span>
        </Label>
        <Textarea
          className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
          id="additional-notes"
          placeholder="Anything else the talent should know — preferred communication method, revision expectations, etc."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-[color:var(--ink-soft)]">
          By posting, you agree to our{" "}
          <a
            className="font-medium text-[color:var(--brand-orange)] hover:underline"
            href="#"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="font-medium text-[color:var(--brand-orange)] hover:underline"
            href="#"
          >
            Community Guidelines
          </a>
          .
        </p>
        <Button
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-light)] px-8 text-sm font-semibold text-white shadow-[var(--shadow-brand-violet-md)] transition-all hover:brightness-105 hover:shadow-[var(--shadow-brand-violet-lg)] active:scale-[0.98] sm:w-auto"
          type="submit"
        >
          Post Project
          <ArrowRightIcon />
        </Button>
      </div>
    </>
  );
}

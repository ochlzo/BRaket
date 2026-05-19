import { Button } from "@/components/ui/button";

type TalentServiceFormHeaderProps = {
  isSubmitting: boolean;
  onSkip: () => void;
  showSkipButton?: boolean;
};

export function TalentServiceFormHeader({
  isSubmitting,
  onSkip,
  showSkipButton = true,
}: TalentServiceFormHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground sm:text-2xl">
          Create Your First Service
        </h2>
        {showSkipButton ? (
          <Button
            className="mt-0.5 rounded-full text-xs font-semibold text-[color:var(--brand-orange)] sm:rounded-xl sm:text-sm"
            disabled={isSubmitting}
            onClick={onSkip}
            size="xs"
            type="button"
            variant="ghost"
          >
            <span className="sm:hidden">Skip</span>
            <span className="hidden sm:inline">Skip for now</span>
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
        Define a service clients can book from your talent profile.
      </p>
    </div>
  );
}

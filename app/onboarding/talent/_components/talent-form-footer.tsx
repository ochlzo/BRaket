import { Button } from "@/components/ui/button";

type TalentFormFooterProps = {
  isSubmitting?: boolean;
  onCancel?: () => void;
};

export function TalentFormFooter({
  isSubmitting = false,
  onCancel,
}: TalentFormFooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      {onCancel ? (
        <Button
          className="min-h-11 rounded-full px-5 text-sm font-semibold sm:h-12 sm:rounded-xl sm:px-8"
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
      ) : null}
      <Button
        className="min-h-11 rounded-full bg-[color:var(--brand-orange)] px-5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] sm:h-12 sm:rounded-xl sm:px-8"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Saving..." : "Next"}
      </Button>
    </div>
  );
}

import { Button } from "@/components/ui/button";

export function TalentFormFooter() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        className="min-h-11 rounded-full bg-[color:var(--brand-orange)] px-5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] sm:h-12 sm:rounded-xl sm:px-8"
        type="submit"
      >
        Next
      </Button>
    </div>
  );
}

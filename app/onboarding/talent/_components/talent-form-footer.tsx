import { Button } from "@/components/ui/button";

type TalentFormFooterProps = {
  notice: string;
};

export function TalentFormFooter({ notice }: TalentFormFooterProps) {
  return (
    <>
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
    </>
  );
}

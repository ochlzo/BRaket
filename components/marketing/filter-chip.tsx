type FilterChipProps = {
  active?: boolean;
  label: string;
};

export function FilterChip({ active = false, label }: FilterChipProps) {
  return (
    <button
      type="button"
      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] text-white"
          : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-blue)] hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

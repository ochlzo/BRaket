import { Input } from "@/components/ui/input";

const currencyInputClassName =
  "h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pr-4 text-sm sm:h-11 sm:rounded-xl";

type TalentServiceCurrencyFieldProps = {
  ariaLabel: string;
  describedBy?: string;
  id: string;
  isInvalid: boolean;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function TalentServiceCurrencyField({
  ariaLabel,
  describedBy,
  id,
  isInvalid,
  name,
  onChange,
  placeholder,
  value,
}: TalentServiceCurrencyFieldProps) {
  return (
    <div className="relative min-w-0">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[color:var(--ink-muted)] sm:left-4 sm:text-sm">
        PHP
      </span>
      <Input
        aria-describedby={describedBy}
        aria-invalid={isInvalid}
        aria-label={ariaLabel}
        className={`${currencyInputClassName} pl-12 sm:pl-14`}
        id={id}
        min="1"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        step="0.01"
        type="number"
        value={value}
      />
    </div>
  );
}


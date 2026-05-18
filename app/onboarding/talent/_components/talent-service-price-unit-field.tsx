import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priceUnitOptions = [
  { label: "Fixed", value: "FIXED" },
  { label: "Hourly", value: "HOURLY" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Per project", value: "PER_PROJECT" },
  { label: "Per task", value: "PER_TASK" },
  { label: "Per session", value: "PER_SESSION" },
];

type TalentServicePriceUnitFieldProps = {
  onChange: (value: string) => void;
  value: string;
};

export function TalentServicePriceUnitField({
  onChange,
  value,
}: TalentServicePriceUnitFieldProps) {
  return (
    <Select
      id="service-unit"
      items={priceUnitOptions}
      name="priceUnit"
      onValueChange={(nextValue) => onChange(nextValue ?? "")}
      required
      value={value || null}
    >
      <SelectTrigger className="!h-10 w-full rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:!h-11 sm:rounded-xl">
        <SelectValue placeholder="Select pricing basis" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
        {priceUnitOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

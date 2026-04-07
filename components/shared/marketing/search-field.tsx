import { SearchIcon } from "@/components/shared/icons/marketing-icons";

type SearchFieldProps = {
  defaultValue?: string;
  name?: string;
  placeholder: string;
};

export function SearchField({ defaultValue, name, placeholder }: SearchFieldProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]">
        <SearchIcon className="h-5 w-5" />
      </span>
      <input
        className="text-base w-full rounded-full border-2 border-[color:var(--line-strong)] bg-white py-3.5 pl-12 pr-4 text-foreground outline-none transition placeholder:text-[color:var(--ink-soft)] focus:border-[color:var(--brand-blue)]"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}


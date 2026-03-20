import { SearchIcon } from "@/components/icons/marketing-icons";

type SearchFieldProps = {
  defaultValue?: string;
  name?: string;
  placeholder: string;
};

export function SearchField({ defaultValue, name, placeholder }: SearchFieldProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#9BA3B2]">
        <SearchIcon className="h-5 w-5" />
      </span>
      <input
        className="typo-body-lg w-full rounded-full border-2 border-[color:var(--line-strong)] bg-white py-5 pl-14 pr-5 text-foreground outline-none transition placeholder:text-[#9BA3B2] focus:border-[color:var(--brand-blue)]"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}

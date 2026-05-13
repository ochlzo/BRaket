type TalentFormSectionHeadingProps = {
  step: number;
  title: string;
};

export function TalentFormSectionHeading({
  step,
  title,
}: TalentFormSectionHeadingProps) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground sm:mb-4 sm:text-lg">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-orange)] text-[0.7rem] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs">
        {step}
      </span>
      {title}
    </h2>
  );
}

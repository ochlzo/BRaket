import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons/marketing-icons";
import { toneStyles, type ToneName } from "@/theme/tailwind";

type CategoryCardProps = {
  description: string;
  href: string;
  icon: ReactNode;
  title: string;
  tone: Extract<ToneName, "sky" | "orange" | "teal">;
};

export function CategoryCard({ description, href, icon, title, tone }: CategoryCardProps) {
  const styles = toneStyles[tone];

  return (
    <a
      className={`${styles.card} group rounded-[1.75rem] p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(37,48,69,0.12)]`}
      href={href}
    >
      <div className="space-y-5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}>{icon}</div>
        <div>
          <h3 className="text-xl font-bold tracking-[-0.03em] text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#4a5565]">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 font-semibold text-foreground transition group-hover:gap-3">
          Explore
          <ArrowRightIcon />
        </div>
      </div>
    </a>
  );
}

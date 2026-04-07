import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/shared/icons/marketing-icons";
import { semantic } from "@/lib/theme/semantic";
import { toneStyles, type ToneName } from "@/lib/theme/tailwind";

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
      className={`${styles.card} group rounded-[1.75rem] p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]`}
      href={href}
    >
      <div className="space-y-5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}>{icon}</div>
        <div>
          <h3 className="typo-card-title-xl text-foreground">{title}</h3>
          <p className={`typo-body-sm mt-2 ${semantic.text.body}`}>{description}</p>
        </div>
        <div className="typo-label-sm inline-flex items-center gap-2 text-foreground transition group-hover:gap-3">
          Explore
          <ArrowRightIcon />
        </div>
      </div>
    </a>
  );
}


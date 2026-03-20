import type { ReactNode } from "react";

import { toneStyles, type ToneName } from "@/theme/tailwind";

type FeatureCardProps = {
  accent: ReactNode;
  decor?: ReactNode;
  description: string;
  label: string;
  title: string;
  tone: Extract<ToneName, "sky" | "orange" | "teal">;
};

export function FeatureCard({
  accent,
  decor,
  description,
  label,
  title,
  tone,
}: FeatureCardProps) {
  const styles = toneStyles[tone];

  return (
    <article className={`${styles.card} relative flex min-h-[18rem] flex-col overflow-hidden rounded-[2rem] p-8`}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="typo-caption mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-foreground">
          <span className={styles.text}>{accent}</span>
          {label}
        </div>
        <h3 className="typo-card-title-2xl max-w-sm text-foreground">{title}</h3>
        <p className="typo-body mt-3 max-w-md text-[color:var(--ink-body)]">{description}</p>
      </div>
      {decor}
    </article>
  );
}

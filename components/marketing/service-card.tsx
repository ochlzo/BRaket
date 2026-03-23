import type { ReactNode } from "react";

import { toneStyles, type ToneName } from "@/theme/tailwind";

type ServiceCardProps = {
  actionHref: string;
  actionLabel: string;
  description: string;
  features: string[];
  icon: ReactNode;
  title: string;
  tone: ToneName;
};

export function ServiceCard({
  actionHref,
  actionLabel,
  description,
  features,
  icon,
  title,
  tone,
}: ServiceCardProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={`${styles.card} group rounded-[1.75rem] p-8 transition duration-200`}
    >
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white transition-transform group-hover:scale-110 ${styles.text}`}
      >
        {icon}
      </div>

      <h2 className="typo-card-title-2xl text-foreground">{title}</h2>
      <p className="typo-body mt-3 text-[color:var(--ink-body)]">{description}</p>

      <ul className="mt-6 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="typo-meta flex items-center gap-3 text-[color:var(--ink-body)]">
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a className="typo-label-sm mt-7 inline-flex w-full items-center justify-center rounded-full border-2 border-[color:var(--line-strong)] bg-white px-5 py-3.5 text-foreground transition hover:bg-[color:var(--surface-alt)]" href={actionHref}>
        {actionLabel}
      </a>
    </article>
  );
}

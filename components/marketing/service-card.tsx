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
      className={`${styles.card} group rounded-[1.75rem] p-8 transition duration-200 hover:-translate-y-2 hover:shadow-[0_28px_54px_rgba(31,44,65,0.12)]`}
    >
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white transition-transform group-hover:scale-110 ${styles.text}`}
      >
        {icon}
      </div>

      <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">{title}</h2>
      <p className="mt-3 text-base leading-7 text-[color:var(--ink-body)]">{description}</p>

      <ul className="mt-6 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-[color:var(--ink-body)]">
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a className="mt-7 inline-flex w-full items-center justify-center rounded-full border-2 border-foreground bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-white" href={actionHref}>
        {actionLabel}
      </a>
    </article>
  );
}

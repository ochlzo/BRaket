import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/shared/icons/marketing-icons";
import { semantic } from "@/lib/theme/semantic";
import { toneStyles, type ToneName } from "@/lib/theme/tailwind";

type ProcessStepCardProps = {
  description: string;
  icon: ReactNode;
  showConnector?: boolean;
  step: number;
  title: string;
  tone: ToneName;
  variant: "filled" | "surface";
};

export function ProcessStepCard({
  description,
  icon,
  showConnector = false,
  step,
  title,
  tone,
  variant,
}: ProcessStepCardProps) {
  const styles = toneStyles[tone];
  const surfaceClassName =
    variant === "filled"
      ? styles.card
      : "bg-white shadow-[var(--shadow-step-base)]";
  const stepClassName =
    variant === "filled" ? "bg-white text-foreground" : `${styles.card} ${styles.text}`;

  return (
    <div className="relative">
      <article
        className={`${surfaceClassName} h-full rounded-[1.75rem] p-8 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-step-hover)]`}
      >
        <div className={`typo-card-title-xl mb-6 flex h-12 w-12 items-center justify-center rounded-full ${stepClassName}`}>
          {step}
        </div>
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}>
          {icon}
        </div>
        <h3 className="typo-card-title-xl text-foreground">{title}</h3>
        <p className={`typo-body mt-3 ${semantic.text.body}`}>{description}</p>
      </article>
      {showConnector ? (
        <div className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 xl:block">
          <ArrowRightIcon className={`h-6 w-6 ${semantic.text.subtle}`} />
        </div>
      ) : null}
    </div>
  );
}


import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons/marketing-icons";
import { toneStyles, type ToneName } from "@/theme/tailwind";

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
      : "bg-white shadow-[0_16px_36px_rgba(40,46,64,0.06)]";
  const stepClassName =
    variant === "filled" ? "bg-white text-foreground" : `${styles.card} ${styles.text}`;

  return (
    <div className="relative">
      <article
        className={`${surfaceClassName} h-full rounded-[1.75rem] p-8 transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,42,64,0.12)]`}
      >
        <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${stepClassName}`}>
          {step}
        </div>
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold tracking-[-0.03em] text-foreground">{title}</h3>
        <p className="mt-3 text-base leading-7 text-[#4E5969]">{description}</p>
      </article>
      {showConnector ? (
        <div className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 xl:block">
          <ArrowRightIcon className="h-6 w-6 text-[#9AA3B2]" />
        </div>
      ) : null}
    </div>
  );
}

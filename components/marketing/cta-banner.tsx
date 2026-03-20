import Link from "next/link";

import { semantic } from "@/theme/semantic";

type Action = {
  href: string;
  label: string;
  variant?: "whiteOrange" | "whiteIndigo" | "outlineWhite";
};

type CtaBannerProps = {
  description: string;
  gradientClassName: string;
  primaryAction: Action;
  secondaryAction?: Action;
  title: string;
};

const actionClassNames = {
  outlineWhite: semantic.button.outlineWhite,
  whiteIndigo: semantic.button.whiteIndigo,
  whiteOrange: semantic.button.whiteOrange,
} as const;

export function CtaBanner({
  description,
  gradientClassName,
  primaryAction,
  secondaryAction,
  title,
}: CtaBannerProps) {
  const renderAction = ({ href, label, variant }: Action) => {
    const className = actionClassNames[variant ?? "whiteOrange"];

    if (href.startsWith("/")) {
      return (
        <Link className={className} href={href}>
          {label}
        </Link>
      );
    }

    return (
      <a className={className} href={href}>
        {label}
      </a>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-[2rem] px-8 py-14 text-center sm:px-12 sm:py-16 ${gradientClassName}`}>
      <div className="relative z-10">
        <h2 className="typo-section-title-heavy text-white">{title}</h2>
        <p className="typo-body-lg mx-auto mt-5 max-w-2xl text-white/90">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {renderAction(primaryAction)}
          {secondaryAction ? renderAction(secondaryAction) : null}
        </div>
      </div>
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />
    </div>
  );
}

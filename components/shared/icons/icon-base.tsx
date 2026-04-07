import type { ReactNode } from "react";

type IconBaseProps = {
  children: ReactNode;
  className?: string;
  viewBox?: string;
};

export function IconBase({
  children,
  className = "h-6 w-6",
  viewBox = "0 0 24 24",
}: IconBaseProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

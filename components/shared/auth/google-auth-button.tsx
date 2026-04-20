"use client";

import { Button } from "@/components/ui/button";

type GoogleAuthButtonProps = {
  disabled?: boolean;
  isSignup: boolean;
  onClick: () => void;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.39 3.61v2.99h3.86c2.26-2.08 3.57-5.14 3.57-8.63Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.86-2.99c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.95H1.27v3.08A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.26 14.31A7.22 7.22 0 0 1 4.89 12c0-.8.14-1.58.37-2.31V6.61H1.27A12 12 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l3.99-3.08Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.59 1.79l3.44-3.44C17.95 1.08 15.24 0 12 0A12 12 0 0 0 1.27 6.61l3.99 3.08C6.21 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  disabled = false,
  isSignup,
  onClick,
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon />
      {isSignup ? "Continue with Google" : "Sign in with Google"}
    </Button>
  );
}

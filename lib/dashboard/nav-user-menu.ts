import type { UserRole } from "@/lib/types";

type NavUserProfileMenuInput = {
  isTalent: boolean;
  role: UserRole;
};

export type NavUserProfileMenu = {
  icon: "user" | "user-plus";
  label: "Client Profile" | "Talent Profile" | "Register Talent";
  href: "/dashboard/client" | null;
  resolvesTalentRegistration: boolean;
};

export function getNavUserProfileMenu({
  isTalent,
  role,
}: NavUserProfileMenuInput): NavUserProfileMenu {
  if (role === "talent") {
    return {
      icon: "user",
      label: "Client Profile",
      href: "/dashboard/client",
      resolvesTalentRegistration: false,
    };
  }

  return {
    icon: isTalent ? "user" : "user-plus",
    label: isTalent ? "Talent Profile" : "Register Talent",
    href: null,
    resolvesTalentRegistration: true,
  };
}

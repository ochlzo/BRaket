export type AdminTab = "overview" | "approvals" | "users";

export const adminStatusColors: Record<string, string> = {
  approved:
    "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  pending:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  rejected: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

export const adminTabs: { emoji: string; label: string; value: AdminTab }[] = [
  { value: "overview", label: "Overview", emoji: "📊" },
  { value: "approvals", label: "Pending Approvals", emoji: "✅" },
  { value: "users", label: "All Users", emoji: "👥" },
];

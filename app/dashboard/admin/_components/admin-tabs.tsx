import { adminTabs, type AdminTab } from "@/app/dashboard/admin/_data";

type AdminTabsProps = {
  activeTab: AdminTab;
  pendingApprovals: number;
  setActiveTab: (tab: AdminTab) => void;
};

export function AdminTabs({
  activeTab,
  pendingApprovals,
  setActiveTab,
}: AdminTabsProps) {
  return (
    <div className="mb-6 flex gap-2">
      {adminTabs.map((tab) => (
        <button
          key={tab.value}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === tab.value
              ? "bg-[color:var(--brand-orange)] !text-white shadow-md"
              : "border border-[color:var(--line-strong)] bg-white text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)]"
          }`}
          onClick={() => setActiveTab(tab.value)}
          type="button"
        >
          <span>{tab.emoji}</span>
          {tab.label}
          {tab.value === "approvals" && pendingApprovals > 0 ? (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {pendingApprovals}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

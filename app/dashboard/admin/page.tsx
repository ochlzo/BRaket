import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";

import { AdminDashboardContent } from "./_components/admin-dashboard-content";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      role="client"
      subtitle="Platform management and moderation"
      title="Operations Dashboard"
    >
      <AdminDashboardContent />
    </DashboardLayout>
  );
}

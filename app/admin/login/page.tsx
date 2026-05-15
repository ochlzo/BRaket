import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/app/admin/login/_components/admin-login-form";
import { BrandMark } from "@/components/shared/branding/brand-mark";
import { isUserAdminSession } from "@/server/admin/access";

export const metadata: Metadata = {
  title: "Admin Login - BRaket",
  description: "Sign in to the BRaket admin review console.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  if (await isUserAdminSession()) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const initialError =
    error === "not-admin"
      ? "That account is signed in, but it is not allowed to access admin."
      : "";

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-8">
          <BrandMark href="/" subtitle="Admin" />
        </div>

        <section className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 shadow-[var(--shadow-surface-soft)] sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-orange)]">
              Admin access
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.03em]">
              Sign in to BRaket Admin
            </h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
              Use an approved admin account to review BU student verification
              requests.
            </p>
          </div>

          <AdminLoginForm initialError={initialError} />
        </section>
      </div>
    </main>
  );
}

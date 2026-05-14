import { TalentBuVerificationIntro } from "@/app/onboarding/talent/_components/talent-bu-verification-intro";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function TalentVerificationPage() {
  await requireCurrentAppUser();

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] px-3 py-6 text-foreground sm:px-6 sm:py-12 lg:px-8">
      <section>
        <div className="mx-auto max-w-2xl">
          <TalentBuVerificationIntro />
        </div>
      </section>
    </main>
  );
}

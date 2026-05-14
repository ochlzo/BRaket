import { TalentBuVerificationIntro } from "@/app/onboarding/talent/_components/talent-bu-verification-intro";
import { requireCurrentAppUser } from "@/server/users/current-user";

type TalentVerificationPageProps = {
  searchParams: Promise<{
    step?: string;
  }>;
};

export default async function TalentVerificationPage({
  searchParams,
}: TalentVerificationPageProps) {
  await requireCurrentAppUser();
  const { step } = await searchParams;

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-foreground sm:px-6 sm:py-14 lg:px-8">
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <TalentBuVerificationIntro step={step} />
        </div>
      </section>
    </main>
  );
}

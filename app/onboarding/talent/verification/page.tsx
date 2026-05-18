import { TalentBuVerificationIntro } from "@/app/onboarding/talent/_components/talent-bu-verification-intro";
import { getApplicantVerificationState } from "@/server/talent-verification/get-applicant-state";
import { requireCurrentAppUser } from "@/server/users/current-user";

type TalentVerificationPageProps = {
  searchParams: Promise<{
    source?: string;
    step?: string;
  }>;
};

export default async function TalentVerificationPage({
  searchParams,
}: TalentVerificationPageProps) {
  const currentUser = await requireCurrentAppUser();
  const verification = await getApplicantVerificationState(
    currentUser.id,
    currentUser.isVerified,
  );
  const { source, step } = await searchParams;

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-foreground sm:px-6 sm:py-14 lg:px-8">
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <TalentBuVerificationIntro
            email={currentUser.email}
            isTalent={currentUser.isTalent}
            source={source}
            step={step}
            verification={verification}
            verificationBasePath="/onboarding/talent/verification"
          />
        </div>
      </section>
    </main>
  );
}

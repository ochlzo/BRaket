import { PostProjectBenefitsSection } from "@/app/post-project/_components/post-project-benefits-section";
import { PostProjectForm } from "@/app/post-project/_components/post-project-form";
import { PostProjectHero } from "@/app/post-project/_components/post-project-hero";
import { PostProjectProcessSection } from "@/app/post-project/_components/post-project-process-section";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";

export default function PostProjectPage() {
  return (
    <PageShell
      activeHref="/post-project"
      ctaHref="/post-project"
      ctaLabel="Post a Project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <PostProjectHero />
      <PostProjectForm />
      <PostProjectProcessSection />
      <PostProjectBenefitsSection />
    </PageShell>
  );
}

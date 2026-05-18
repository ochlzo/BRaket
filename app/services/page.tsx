import { BookableServicesBrowser } from "@/app/services/_components/bookable-services-browser";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getBookableServices } from "@/server/bookings/data";

export default async function ServicesPage() {
  const services = await getBookableServices();

  return (
    <PageShell
      activeHref="/services"
      className="bg-[linear-gradient(180deg,var(--tone-sky-pale)_0%,var(--surface)_44%)]"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <BookableServicesBrowser services={services} />
    </PageShell>
  );
}

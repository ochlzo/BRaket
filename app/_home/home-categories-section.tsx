import { CategoryCard } from "@/components/shared/marketing/category-card";

import { homeCategories } from "@/app/_home/home-data";

export function HomeCategoriesSection() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8" id="categories">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="typo-section-title text-foreground">
            Browse by <span className="text-[color:var(--tone-orange-base)]">Category</span>
          </h2>
          <p className="typo-body-lg mt-4 text-[color:var(--ink-muted)]">
            Find the right student talent for your project across technical,
            visual, and creative disciplines.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {homeCategories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}

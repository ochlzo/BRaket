import type { TalentProfilePortfolioItem } from "@/lib/talent-profile/types";

import { TalentMediaCollage } from "./talent-media-collage";

type TalentPortfolioSectionProps = {
  portfolio: TalentProfilePortfolioItem[];
};

function TalentPortfolioPost({ item }: { item: TalentProfilePortfolioItem }) {
  return (
    <article className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-surface-soft)]">
      <h3 className="text-base font-extrabold tracking-normal text-[color:var(--foreground)]">
        {item.title}
      </h3>
      {item.media.length > 0 ? (
        <div className="mt-3">
          <TalentMediaCollage
            dialogTitle="Portfolio images"
            frameClassName="h-[220px]"
            media={item.media}
            title={item.title}
          />
        </div>
      ) : null}
      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-body)]">
        {item.description}
      </p>
    </article>
  );
}

export function TalentPortfolioSection({
  portfolio,
}: TalentPortfolioSectionProps) {
  return (
    <section className="rounded-[1.2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-panel-soft)]">
      <div className="border-b border-[color:var(--line-strong)] px-5 py-4">
        <h2 className="typo-card-title-xl">Portfolio Posts</h2>
      </div>
      <div className="space-y-4 p-4">
        {portfolio.length > 0 ? (
          portfolio.map((item) => (
            <TalentPortfolioPost item={item} key={item.id} />
          ))
        ) : (
          <div className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-5 py-8 text-center">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              No portfolio posts yet
            </p>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Portfolio examples will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

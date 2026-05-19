import type { TalentProfilePageData } from "@/lib/talent-profile/types";

import { TalentAboutEditor } from "./talent-about-editor";

type TalentAboutPanelProps = {
  availableSkills?: string[];
  profile: TalentProfilePageData;
  showEditAction?: boolean;
};

export function TalentAboutPanel({
  availableSkills = [],
  profile,
  showEditAction = false,
}: TalentAboutPanelProps) {
  return (
    <section className="overflow-hidden rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">About</h2>
        {showEditAction ? (
          <TalentAboutEditor
            availableSkills={availableSkills}
            profile={profile}
          />
        ) : null}
      </div>
      <div className="px-4 py-4 sm:px-5">
        <p className="text-sm leading-7 text-[color:var(--ink-body)]">
          {profile.bio || "No bio added yet."}
        </p>
      </div>

      <div className="border-t border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">Skills</h2>
        {profile.skills.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                className="inline-flex items-center rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-semibold text-[color:var(--tone-orange-deep)]"
                key={skill.name}
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            No skills added yet.
          </p>
        )}
      </div>
    </section>
  );
}

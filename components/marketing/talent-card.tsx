import Image from "next/image";

import { BriefcaseIcon, MapPinIcon, StarIcon } from "@/components/icons/marketing-icons";

type TalentCardProps = {
  available: boolean;
  hourlyRate: string;
  image: string;
  location: string;
  name: string;
  rating: number;
  reviews: number;
  role: string;
  skills: string[];
};

export function TalentCard({
  available,
  hourlyRate,
  image,
  location,
  name,
  rating,
  reviews,
  role,
  skills,
}: TalentCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[color:var(--line-strong)] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(28,43,67,0.12)]">
      <div className="relative h-56 bg-[linear-gradient(135deg,var(--tone-indigo-soft)_0%,var(--tone-orange-soft)_100%)]">
        <Image alt={name} className="h-full w-full object-cover" fill sizes="(max-width: 1280px) 50vw, 33vw" src={image} />
        {available ? (
          <div className="absolute right-4 top-4 rounded-full bg-[color:var(--tone-green-base)] px-3 py-1 text-xs font-semibold text-white">
            Available
          </div>
        ) : null}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">{name}</h2>
          <p className="mt-1 text-[color:var(--ink-soft)]">{role}</p>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-[color:var(--brand-orange)]">
            <StarIcon className="h-4 w-4 fill-current" />
          </span>
          <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-sm text-[#8C96A8]">({reviews} reviews)</span>
        </div>

        <div className="mb-4 space-y-2 text-sm text-[color:var(--ink-soft)]">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" />
            <span>{hourlyRate}/hour</span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink-body)]"
            >
              {skill}
            </span>
          ))}
        </div>

        <button
          className="w-full rounded-full bg-[color:var(--brand-blue)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
          type="button"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}

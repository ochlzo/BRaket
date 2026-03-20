import { IconBase } from "./icon-base";

export function StarIcon({ className = "h-5 w-5 fill-current" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20">
      <path d="M10 1.5l2.62 5.31 5.86.85-4.24 4.13 1 5.84L10 14.88 4.76 17.63l1-5.84L1.52 7.66l5.86-.85L10 1.5Z" />
    </svg>
  );
}

export function SearchIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

export function ArrowRightIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

export function CodeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14 4-4 16" />
    </IconBase>
  );
}

export function PaletteIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.6-.2-1.1-.5-1.5a2 2 0 0 1 1.5-3.3H16a5 5 0 0 0 0-10Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14" cy="8" r="1" />
    </IconBase>
  );
}

export function CameraIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="m9 8 1.5-3h3L15 8" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  );
}

export function VideoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-3v10l-6-3Z" />
    </IconBase>
  );
}

export function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </IconBase>
  );
}

export function UsersIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.5 18a4.5 4.5 0 0 1 5 0" />
    </IconBase>
  );
}

export function FilterIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </IconBase>
  );
}

export function MapPinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

export function BriefcaseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12h18" />
    </IconBase>
  );
}

export function UserCheckIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18a5.5 5.5 0 0 1 11 0" />
      <path d="m16 10 2 2 3-3" />
    </IconBase>
  );
}

export function StarOutlineIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <IconBase className={className} viewBox="0 0 20 20">
      <path d="M10 1.5l2.62 5.31 5.86.85-4.24 4.13 1 5.84L10 14.88 4.76 17.63l1-5.84L1.52 7.66l5.86-.85L10 1.5Z" />
    </IconBase>
  );
}

export function PencilIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </IconBase>
  );
}

export function MusicIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </IconBase>
  );
}

export function MegaphoneIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 11v2a2 2 0 0 0 2 2h2l3 5h2l-1.4-5H13l6 3V6l-6 3H5a2 2 0 0 0-2 2Z" />
    </IconBase>
  );
}

export function TrendingUpIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </IconBase>
  );
}

import type { FooterColumn as FooterColumnType } from "@/content/footer";

type FooterColumnProps = FooterColumnType;

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="typo-card-title-lg mb-4">{title}</h4>
      <ul className="typo-body-sm space-y-2 text-white/60">
        {links.map((link) => (
          <li key={link.label}>
            <a className="transition-colors hover:text-white" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import {
  footerBrandDescription,
  footerColumns,
  legalLinks,
  type FooterColumn as FooterColumnType,
  type FooterLink,
} from "@/content/footer";

import { BrandMark } from "../branding/brand-mark";
import { FooterColumn } from "./footer-column";

type SiteFooterProps = {
  brandDescription?: string;
  columns?: FooterColumnType[];
  legal?: FooterLink[];
};

export function SiteFooter({
  brandDescription = footerBrandDescription,
  columns = footerColumns,
  legal = legalLinks,
}: SiteFooterProps) {
  return (
    <footer className="bg-[color:var(--footer-bg)] px-5 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-4">
              <BrandMark href="/" variant="light" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/65">{brandDescription}</p>
          </div>
          {columns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-sm text-white/55">© 2026 BRaket. For Bicol University Students.</p>
          <div className="flex gap-6 text-sm text-white/55">
            {legal.map((link) => (
              <a key={link.label} className="transition-colors hover:text-white" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Browse Talents", href: "/browse" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/#cta" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/#features" },
      { label: "Safety", href: "/#features" },
      { label: "Guidelines", href: "/how-it-works" },
      { label: "Contact Us", href: "/#cta" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "About Us", href: "/" },
      { label: "Blog", href: "/how-it-works" },
      { label: "Success Stories", href: "/browse" },
      { label: "Events", href: "/#cta" },
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
];

export const footerBrandDescription =
  "Connecting Bicol University students with opportunities to showcase their talents and build meaningful work.";

export type NavItem = {
  href: string;
  label: string;
};

export const homeNavigation: NavItem[] = [
  { href: "#top", label: "Home" },
  { href: "#categories", label: "Talents" },
  { href: "#features", label: "Services" },
  { href: "#journey", label: "How it Works" },
];

export const appNavigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Talents" },
  { href: "/services", label: "Services" },
  { href: "/boost", label: "Boost" },
  { href: "/how-it-works", label: "How it Works" },
];

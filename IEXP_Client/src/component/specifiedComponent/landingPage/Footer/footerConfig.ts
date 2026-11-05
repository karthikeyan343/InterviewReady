export interface FooterLinkItem {
  label: string;
  href: string;
}

export const productLinks: FooterLinkItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#" },
  { label: "Updates", href: "#" },
];

export const companyLinks: FooterLinkItem[] = [
  { label: "About", href: "#about-us" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

export const legalLinks: FooterLinkItem[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

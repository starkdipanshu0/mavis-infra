/**
 * Brand-wide constants. Single source of truth for contact info, nav, social.
 * Sourced from CLIENT-BRIEF.md — keep in sync if business details change.
 */

export const BRAND = {
  name: "Mavis Infra Solutions",
  shortName: "Mavis",
  legalEntity: "Partnership Firm",
  foundedYear: 2019,
  tagline: "Sale is not the end. It's the beginning of our service.",

  phone: {
    display: "+91 97170 81930",
    numeric: "919717081930",
  },
  phoneAlt: {
    display: "+91 96252 85001",
    numeric: "919625285001",
  },
  whatsapp: {
    display: "+91 96252 85001",
    numeric: "919625285001",
  },

  email: "info@mavisinfra.in",
  domain: "mavisinfra.in",

  office: {
    bangalore: "1st Main, Nrupatunga Nagar Phase 7, JP Nagar, Bangalore 560076",
    headquarters: "601 Solitarian City Centre, Knowledge Park 3, Greater Noida",
  },

  metrics: {
    yearsInBusiness: 6,
    familiesHelped: 200,
    repeatClients: 37,
    highestDeal: "₹25 Cr",
    activeProjects: 100,
  },

  social: {
    instagram: "", // TBC from client
    facebook: "", // TBC from client
  },
} as const;

/**
 * Top-level nav. Only routes that ship in v1 are listed here — broken links
 * are worse than a smaller menu. Add entries back as routes come online.
 * The "Contact" item deep-links into the homepage lead-form section.
 */
export const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#concierge" },
] as const;

export const ZONES = [
  { label: "East Bangalore", slug: "east" },
  { label: "North Bangalore", slug: "north" },
  { label: "South Bangalore", slug: "south" },
  { label: "Outstation", slug: "outstation" },
] as const;

export const BUDGET_BRACKETS = [
  { label: "Under ₹1 Cr", slug: "under-1cr", max: 10_000_000 },
  { label: "₹1 – 2 Cr", slug: "1-2cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2 – 5 Cr", slug: "2-5cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5 Cr+", slug: "5cr-plus", min: 50_000_000 },
] as const;

const DEFAULT_WA_MESSAGE =
  "Hi, I'd like to know more about your projects.";

/**
 * Build a wa.me link with prefilled text. Pass a project/locality context where possible.
 */
export function buildWhatsAppLink(message: string = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${BRAND.whatsapp.numeric}?text=${encodeURIComponent(message)}`;
}

export const TEL_LINK = `tel:+${BRAND.phone.numeric}`;

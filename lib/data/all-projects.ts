/**
 * All Projects — homepage Section 6 card strip.
 *
 * Curated subset of 12 projects from the 46+ inventory, chosen for variety
 * across zones (east/north/south), status (pre-launch/under-construction/
 * ready), and category (luxury/premium/affordable). Drives the homepage
 * strip and seeds the /projects listing.
 *
 * The full 46 will live in Sanity CMS — `lib/sanity/queries.ts` will replace
 * this static export. The shape of `ProjectCardItem` matches the planned
 * Sanity schema (architecture.md §3) for a 1:1 swap.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §6, PROJECTS-PAGE-PLAN.md.
 */

export type ProjectStatus = "pre-launch" | "under-construction" | "ready";
export type ProjectType = "apartment" | "villa" | "plot" | "townhouse";
export type ProjectCategory = "luxury" | "premium" | "affordable" | "plots";
export type ProjectZone = "east" | "north" | "south" | "outstation";

export interface ProjectCardItem {
  slug: string;
  builder: string;
  name: string;
  locality: string;
  zone: ProjectZone;
  /** "3, 4 BHK" — short configuration label */
  bhkRange: string;
  /** "From ₹95 L" / "Enquire" / "EOI Open" — display price */
  priceFrom: string;
  status: ProjectStatus;
  type: ProjectType;
  category: ProjectCategory;
  /** Image path or null (falls back to tone gradient card) */
  image: string | null;
  imageAlt: string;
  /** Tone hex for fallback gradient + image background colour */
  tone: string;
  /** "RERA ✓" / "RERA Filed" — short trust signal */
  reraDisplay: string;
}

export const ALL_PROJECTS: readonly ProjectCardItem[] = [
  // ── Featured (have real Higgsfield exteriors) ──
  {
    slug: "sobha-hoskote",
    builder: "SOBHA",
    name: "Sobha Hoskote",
    locality: "East Bangalore",
    zone: "east",
    bhkRange: "1–4 BHK",
    priceFrom: "EOI Open",
    status: "pre-launch",
    type: "apartment",
    category: "luxury",
    image: "/images/featured/sobha-hoskote.jpg",
    imageAlt: "Sobha Hoskote — 90-acre township at dusk",
    tone: "#241608",
    reraDisplay: "RERA Filed",
  },
  {
    slug: "sobha-oneworld",
    builder: "SOBHA",
    name: "Sobha OneWorld",
    locality: "Greater Whitefield",
    zone: "east",
    bhkRange: "1–4 BHK",
    priceFrom: "EOI Open",
    status: "pre-launch",
    type: "apartment",
    category: "luxury",
    image: "/images/featured/sobha-oneworld.jpg",
    imageAlt: "Sobha OneWorld — 48-acre integrated township",
    tone: "#1c1310",
    reraDisplay: "RERA Filed",
  },
  {
    slug: "provident-sunworth-city",
    builder: "PROVIDENT",
    name: "Provident Sunworth",
    locality: "South Bangalore",
    zone: "south",
    bhkRange: "2, 3 BHK",
    priceFrom: "Enquire",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: "/images/featured/sunworth.jpg",
    imageAlt: "Provident Sunworth — elevation with metro line",
    tone: "#1a1410",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "birla-trimaya",
    builder: "BIRLA",
    name: "Birla Trimaya",
    locality: "Devanahalli",
    zone: "north",
    bhkRange: "1–4 BHK",
    priceFrom: "From ₹65 L",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: "/images/featured/birla-trimaya.jpg",
    imageAlt: "Birla Trimaya — Devanahalli greens at golden hour",
    tone: "#16201c",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "brigade-insignia",
    builder: "BRIGADE",
    name: "Brigade Insignia",
    locality: "Yelahanka",
    zone: "north",
    bhkRange: "3–5 BHK",
    priceFrom: "From ₹3.49 Cr",
    status: "under-construction",
    type: "apartment",
    category: "luxury",
    image: "/images/featured/brigade-insignia.jpg",
    imageAlt: "Brigade Insignia — luxury tower at dusk",
    tone: "#15181f",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "purva-silversky",
    builder: "PURAVANKARA",
    name: "Purva Silversky",
    locality: "Electronic City",
    zone: "south",
    bhkRange: "1–3 BHK",
    priceFrom: "Enquire",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: "/images/featured/silversky.jpg",
    imageAlt: "Purva Silversky — Electronic City elevation",
    tone: "#181a1f",
    reraDisplay: "RERA ✓",
  },

  // ── Secondary (tone-gradient cards until kits arrive) ──
  {
    slug: "provident-deansgate",
    builder: "PROVIDENT",
    name: "Provident Deansgate",
    locality: "IVC Road",
    zone: "north",
    bhkRange: "Townhouses",
    priceFrom: "From ₹1.95 Cr",
    status: "under-construction",
    type: "townhouse",
    category: "luxury",
    image: null,
    imageAlt: "Provident Deansgate — IVC Road townhouses",
    tone: "#1f1a14",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "provident-botanico",
    builder: "PROVIDENT",
    name: "Provident Botanico",
    locality: "East Bangalore",
    zone: "east",
    bhkRange: "2, 3 BHK",
    priceFrom: "Enquire",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: null,
    imageAlt: "Provident Botanico — East Bangalore community",
    tone: "#16201a",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "provident-ecopolitan",
    builder: "PROVIDENT",
    name: "Provident Ecopolitan",
    locality: "Bagaluru",
    zone: "north",
    bhkRange: "2, 3 BHK",
    priceFrom: "Enquire",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: null,
    imageAlt: "Provident Ecopolitan — Bagaluru North Bangalore",
    tone: "#171a20",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "purva-park-hills",
    builder: "PURAVANKARA",
    name: "Purva Park Hills",
    locality: "South Bangalore",
    zone: "south",
    bhkRange: "3, 4 BHK",
    priceFrom: "Enquire",
    status: "under-construction",
    type: "apartment",
    category: "premium",
    image: null,
    imageAlt: "Purva Park Hills — South Bangalore",
    tone: "#1a1715",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "purva-atmosphere",
    builder: "PURAVANKARA",
    name: "Purva Atmosphere",
    locality: "Thanisandra",
    zone: "north",
    bhkRange: "2, 3 BHK",
    priceFrom: "Enquire",
    status: "ready",
    type: "apartment",
    category: "premium",
    image: null,
    imageAlt: "Purva Atmosphere — Thanisandra Vida residences",
    tone: "#181f1a",
    reraDisplay: "RERA ✓",
  },
  {
    slug: "provident-park-square",
    builder: "PROVIDENT",
    name: "Provident Park Square",
    locality: "South Bangalore",
    zone: "south",
    bhkRange: "2, 3 BHK",
    priceFrom: "Enquire",
    status: "ready",
    type: "apartment",
    category: "affordable",
    image: null,
    imageAlt: "Provident Park Square — Kanakapura Road",
    tone: "#1b1815",
    reraDisplay: "RERA ✓",
  },
];

/** Filter chip definitions for the homepage strip */
export const PROJECT_FILTERS = [
  {
    slug: "all",
    label: "ALL",
    match: () => true,
  },
  {
    slug: "pre-launch",
    label: "PRE-LAUNCH",
    match: (p: ProjectCardItem) => p.status === "pre-launch",
  },
  {
    slug: "ready",
    label: "READY",
    match: (p: ProjectCardItem) => p.status === "ready",
  },
  {
    slug: "luxury",
    label: "LUXURY",
    match: (p: ProjectCardItem) => p.category === "luxury",
  },
] as const;

/** Total live inventory — informs the "View All N Projects" CTA */
export const TOTAL_PROJECT_COUNT = 46;

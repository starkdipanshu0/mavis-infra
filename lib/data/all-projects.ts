/**
 * All Projects — homepage Section 6 card strip + /projects listing source.
 *
 * Curated subset of 12 projects from the 46+ inventory, chosen for variety
 * across zones (east/north/south), status (pre-launch/under-construction/
 * ready), and category (luxury/premium/affordable). Drives the homepage
 * strip and the /projects deep-browse listing.
 *
 * The full 46 will live in Sanity CMS — `lib/sanity/queries.ts` will replace
 * this static export. The shape of `ProjectCardItem` matches the planned
 * Sanity schema (architecture.md §3) for a 1:1 swap.
 *
 * Display vs. filter fields: `priceFrom` / `bhkRange` are the *display*
 * strings the card shows (often "Enquire" / "EOI Open"). The numeric
 * `priceMin` / `priceMax` / `bhk` / `possession` fields exist ONLY to power
 * the /projects filter bar + sort — they are never rendered. They carry
 * approximate public price bands for real projects so the Budget/BHK filters
 * and price/possession sorts are meaningful even when the card hides the
 * price. `priceMin` is null only when no reasonable band is known.
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
  /** "3, 4 BHK" — short configuration label (display only) */
  bhkRange: string;
  /** "From ₹95 L" / "Enquire" / "EOI Open" — display price (display only) */
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

  // ── Filter/sort-only fields (never rendered) ───────────────────────────
  /** Approx starting price in INR. null when no band is known. */
  priceMin: number | null;
  /** Approx top price in INR. null when no band is known. */
  priceMax: number | null;
  /** Bedroom counts offered. Empty for plot/townhouse (filter via `type`). */
  bhk: number[];
  /** "YYYY-MM" expected possession; null for ready-to-move / unknown. */
  possession: string | null;
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
    priceMin: 12_000_000,
    priceMax: 35_000_000,
    bhk: [1, 2, 3, 4],
    possession: "2029-06",
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
    priceMin: 15_000_000,
    priceMax: 40_000_000,
    bhk: [1, 2, 3, 4],
    possession: "2029-12",
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
    priceMin: 6_000_000,
    priceMax: 10_000_000,
    bhk: [2, 3],
    possession: "2026-12",
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
    priceMin: 6_500_000,
    priceMax: 18_000_000,
    bhk: [1, 2, 3, 4],
    possession: "2027-12",
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
    priceMin: 34_900_000,
    priceMax: 60_000_000,
    bhk: [3, 4, 5],
    possession: "2027-06",
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
    priceMin: 7_000_000,
    priceMax: 15_000_000,
    bhk: [1, 2, 3],
    possession: "2027-03",
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
    priceMin: 19_500_000,
    priceMax: 30_000_000,
    bhk: [],
    possession: "2027-09",
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
    priceMin: 6_500_000,
    priceMax: 11_000_000,
    bhk: [2, 3],
    possession: "2027-12",
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
    priceMin: 6_000_000,
    priceMax: 10_000_000,
    bhk: [2, 3],
    possession: "2028-06",
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
    priceMin: 15_000_000,
    priceMax: 25_000_000,
    bhk: [3, 4],
    possession: "2026-06",
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
    priceMin: 9_000_000,
    priceMax: 14_000_000,
    bhk: [2, 3],
    possession: null,
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
    priceMin: 5_000_000,
    priceMax: 8_000_000,
    bhk: [2, 3],
    possession: null,
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

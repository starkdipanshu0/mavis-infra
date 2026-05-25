/**
 * Localities — homepage Section 7 (Browse by Locality).
 *
 * 8 Bangalore localities ordered by current project density. Counts and
 * starting prices reflect the active inventory as of 2026-05-21, recounted
 * against CLIENT-BRIEF.md §12B + the flagship pre-launches.
 *
 * Each entry carries the editorial fields the redesign uses: a `signature`
 * flagship project, a one-line `tagline`, and a `size` hint that drives the
 * bento grid layout on desktop (hero = 2×2, wide = 2×1, standard = 1×1).
 *
 * The full list will move to Sanity CMS — counts/prices should recompute
 * from project documents, not stay hardcoded. The shape below matches the
 * planned schema for a clean swap.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §7.
 */

export type LocalityZone = "north" | "east" | "south" | "west";
export type LocalityCardSize = "hero" | "wide" | "standard";

export interface Locality {
  slug: string;
  /** Display name on the card */
  name: string;
  zone: LocalityZone;
  /** Number of active Mavis projects in this locality */
  projectCount: number;
  /** "From ₹65 L" / "EOI Open" / "₹8,500 / sqft" — display string */
  priceFrom: string;
  /** Flagship / signature project shown as eyebrow on the card */
  signature: string;
  /** One-line editorial tagline that captures the locality's identity */
  tagline: string;
  /** Aerial / landmark image. Null falls back to a tone gradient. */
  image: string | null;
  imageAlt: string;
  /** Fallback tone when image is missing — also tints the image background */
  tone: string;
  /** Bento layout footprint (desktop only — mobile/sm collapse to 1×1) */
  size: LocalityCardSize;
}

export const LOCALITIES: readonly Locality[] = [
  {
    slug: "devanahalli",
    name: "Devanahalli",
    zone: "north",
    projectCount: 6,
    priceFrom: "From ₹65 L",
    signature: "Birla Trimaya",
    tagline: "The airport corridor — where Bangalore's next decade is being built.",
    // TEMP: reuse flagship-project shot until aerial photo lands.
    image: "/images/featured/birla-trimaya.jpg",
    imageAlt: "Devanahalli — airport corridor skyline at dusk",
    tone: "#1b1a17",
    size: "hero",
  },
  {
    slug: "yelahanka",
    name: "Yelahanka",
    zone: "north",
    projectCount: 6,
    priceFrom: "From ₹2.15 Cr",
    signature: "Vajram Vivera",
    tagline: "Leafy, low-rise, lived-in.",
    // TEMP: residence interior stands in for the Yelahanka boulevard shot.
    image: "/images/premium/sobha-residence.jpg",
    imageAlt: "Yelahanka — leafy boulevards and low-rise residences",
    tone: "#181b16",
    size: "standard",
  },
  {
    slug: "ivc-road",
    name: "IVC Road",
    zone: "north",
    projectCount: 5,
    priceFrom: "Plots ₹8,500 / sqft",
    signature: "Address Maker",
    tagline: "Plotted land along the international corridor.",
    // TEMP: Silversky elevation stands in for the IVC plot-land shot.
    image: "/images/featured/silversky.jpg",
    imageAlt: "IVC Road — plotted developments along the international corridor",
    tone: "#1c1813",
    size: "standard",
  },
  {
    slug: "hennur",
    name: "Hennur",
    zone: "north",
    projectCount: 4,
    priceFrom: "From ₹1.30 Cr",
    signature: "Purva Palm Beach",
    tagline: "Quiet luxury, ten minutes from Manyata.",
    // TEMP: Brigade penthouse stands in for the Hennur skyline shot.
    image: "/images/premium/brigade-penthouse.jpg",
    imageAlt: "Hennur — gated towers viewed from Manyata side",
    tone: "#171612",
    size: "standard",
  },
  {
    slug: "hoskote",
    name: "Hoskote",
    zone: "east",
    projectCount: 4,
    priceFrom: "EOI Open",
    signature: "Sobha Hoskote",
    tagline: "NH-75. 48 acres. The biggest pre-launch of the year.",
    image: "/images/featured/sobha-hoskote.jpg",
    imageAlt: "Hoskote — NH-75 corridor near the toll plaza",
    tone: "#1f1810",
    size: "standard",
  },
  {
    slug: "thanisandra",
    name: "Thanisandra",
    zone: "north",
    projectCount: 4,
    priceFrom: "From ₹92 L",
    signature: "Prestige Windgates",
    tagline: "The high-rise corridor north of Manyata.",
    // TEMP: Brigade Insignia elevation stands in for the Thanisandra shot.
    image: "/images/featured/brigade-insignia.jpg",
    imageAlt: "Thanisandra — premium high-rises along the main road",
    tone: "#181612",
    size: "standard",
  },
  {
    slug: "whitefield",
    name: "Greater Whitefield",
    zone: "east",
    projectCount: 3,
    priceFrom: "EOI Open",
    signature: "Sobha OneWorld",
    tagline: "Tech-belt residences for the people building it.",
    image: "/images/featured/sobha-oneworld.jpg",
    imageAlt: "Greater Whitefield — tech-belt residential cluster",
    tone: "#1a1612",
    size: "standard",
  },
  {
    slug: "south-bangalore",
    name: "South Bangalore",
    zone: "south",
    projectCount: 3,
    priceFrom: "Enquire",
    signature: "Provident Sunworth",
    tagline: "Old-money zip codes, modern keys.",
    image: "/images/featured/sunworth.jpg",
    imageAlt: "South Bangalore — Kanakapura corridor green belt",
    tone: "#151814",
    size: "wide",
  },
];

export const TOTAL_LOCALITY_COUNT = LOCALITIES.length;

export const TOTAL_PROJECTS_IN_LOCALITIES = LOCALITIES.reduce(
  (sum, l) => sum + l.projectCount,
  0,
);

/** Distinct zones present in the current locality set */
export const LOCALITY_ZONE_COUNT = new Set(LOCALITIES.map((l) => l.zone)).size;

/**
 * Resolve a locality slug from the homepage bento grid into the matching
 * project locality label used in ALL_PROJECTS. Falls back to a slugify match
 * for resilience.
 */
export function findLocalityBySlug(slug: string): Locality | undefined {
  return LOCALITIES.find((l) => l.slug === slug);
}

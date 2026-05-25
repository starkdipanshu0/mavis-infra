/**
 * Featured Projects — homepage Section 2 carousel.
 *
 * Hand-curated, refreshed monthly. Selection rule:
 *   commission impact × asset richness × pre-launch urgency.
 *
 * Current slate (2026-05): see MAVIS-HOMEPAGE-PLAN.md §2.
 *
 * When the CMS comes online, swap this static array for a Sanity GROQ query
 * filtered by `featured == true`, ordered by `featuredOrder`.
 */

export type ProjectStatus = "pre-launch" | "under-construction" | "ready";

export interface FeaturedProject {
  /** URL slug — links to /projects/[slug] */
  slug: string;
  /** Builder name (uppercase preferred — rendered as eyebrow) */
  builder: string;
  /** Project name (BOLD line — top of slide) */
  name: string;
  /** Structural location label (still used by SEO / metadata / filters) */
  location: string;
  /** Editorial italic one-liner — what carries the slide's voice */
  descriptor: string;
  /** Public path to background image. Falls back to tone if null. */
  image: string | null;
  /** Brief alt-text for the image (or descriptor when image is null) */
  imageAlt: string;
  /** Hex tone — fallback layer + atmospheric overlay */
  tone: string;
  /** Short RERA status string shown bottom-left of slide */
  reraDisplay: string;
  /** Short price hint shown bottom-right (e.g. "From ₹1.85 Cr", "EOI Open") */
  priceFrom: string;
  status: ProjectStatus;
}

export const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    slug: "sobha-hoskote",
    builder: "SOBHA",
    name: "SOBHA HOSKOTE",
    location: "EAST BANGALORE",
    descriptor: "A 90-acre township rising along the Hoskote–NH-75 corridor.",
    image: "/images/featured/sobha-hoskote.jpg",
    imageAlt:
      "Sobha Hoskote — pre-launch township at dusk, towers against indigo sky with amber horizon",
    tone: "#241608",
    reraDisplay: "RERA Filed",
    priceFrom: "EOI Open",
    status: "pre-launch",
  },
  {
    slug: "sobha-oneworld",
    builder: "SOBHA",
    name: "SOBHA ONEWORLD",
    location: "GREATER WHITEFIELD",
    descriptor: "An integrated 48-acre world inside Greater Whitefield.",
    image: "/images/featured/sobha-oneworld.jpg",
    imageAlt:
      "Sobha OneWorld — 48-acre integrated township aerial at blue hour",
    tone: "#1c1310",
    reraDisplay: "RERA Filed",
    priceFrom: "EOI Open",
    status: "pre-launch",
  },
  {
    slug: "provident-sunworth-city",
    builder: "PROVIDENT",
    name: "PROVIDENT SUNWORTH",
    location: "SOUTH BANGALORE",
    descriptor: "Living, set beside the Mysore Road metro line.",
    image: "/images/featured/sunworth.jpg",
    imageAlt: "Provident Sunworth City — elevation with metro line",
    tone: "#1a1410",
    reraDisplay: "RERA ✓",
    priceFrom: "Enquire",
    status: "under-construction",
  },
  {
    slug: "birla-trimaya",
    builder: "BIRLA",
    name: "BIRLA TRIMAYA",
    location: "DEVANAHALLI",
    descriptor: "Acres of green at the airport's gateway.",
    image: "/images/featured/birla-trimaya.jpg",
    imageAlt:
      "Birla Trimaya — Devanahalli low-rise community at golden hour with extensive landscaped greens",
    tone: "#16201c",
    reraDisplay: "RERA ✓",
    priceFrom: "From ₹65 L",
    status: "under-construction",
  },
  {
    slug: "brigade-insignia",
    builder: "BRIGADE",
    name: "BRIGADE INSIGNIA",
    location: "YELAHANKA",
    descriptor: "A landmark address rising in Yelahanka.",
    image: "/images/featured/brigade-insignia.jpg",
    imageAlt:
      "Brigade Insignia — singular luxury tower at dusk, glass facade with warm interior lights",
    tone: "#15181f",
    reraDisplay: "RERA ✓",
    priceFrom: "From ₹3.49 Cr",
    status: "under-construction",
  },
  {
    slug: "purva-silversky",
    builder: "PURAVANKARA",
    name: "PURVA SILVERSKY",
    location: "ELECTRONIC CITY",
    descriptor: "Above the rooftops of Electronic City.",
    image: "/images/featured/silversky.jpg",
    imageAlt: "Purva Silversky — front elevation render, Electronic City",
    tone: "#181a1f",
    reraDisplay: "RERA ✓",
    priceFrom: "Enquire",
    status: "under-construction",
  },
] as const;

/**
 * Builder Partners — homepage Section 5 data.
 *
 * The 10 most strategic builder relationships from the 21+ Mavis works with.
 * Source: CLIENT-BRIEF.md §12B "Builders present" line.
 *
 * Text wordmarks are used until the client supplies official builder SVG
 * logos. When those land, swap `name` for an `<Image src="..." dark:invert>`
 * and the layout doesn't need to change.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §5.
 */

export interface BuilderPartner {
  /** Display wordmark — short, recognised brand name */
  name: string;
  /** Internal slug — for future /builders/[slug] routing */
  slug: string;
}

export const BUILDER_PARTNERS: readonly BuilderPartner[] = [
  { name: "Sobha", slug: "sobha" },
  { name: "Prestige", slug: "prestige" },
  { name: "Brigade", slug: "brigade" },
  { name: "Godrej", slug: "godrej" },
  { name: "Tata", slug: "tata-housing" },
  { name: "Birla", slug: "birla-estates" },
  { name: "Puravankara", slug: "puravankara" },
  { name: "DNR", slug: "dnr" },
  { name: "Sattva", slug: "sattva" },
  { name: "Bhartiya", slug: "bhartiya" },
];

/** Footer note — count of additional partners not shown in the strip */
export const ADDITIONAL_PARTNER_COUNT = 11;

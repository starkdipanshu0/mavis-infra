/**
 * The Mavis Difference — homepage Section 4 data.
 *
 * The most important emotional moment of the page. The brand truth is
 * "the sale is not the end" — we put concrete numbers and three "we [verb]"
 * pillars behind it.
 *
 * Stats sourced from CLIENT-BRIEF.md §9. Pillars derived from the after-sales
 * services described in §7 and the "why they choose Mavis" lines in §4.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §4.
 */

export interface MavisStat {
  /** Numeric target the counter animates to */
  end: number;
  /** Suffix appended after the number (e.g. "+" for 200+) */
  suffix?: string;
  /** Counter duration in seconds */
  duration: number;
  /** Tracked uppercase label below the number */
  label: string;
  /** When true, renders in gold — used to highlight the proof stat */
  emphasize?: boolean;
}

export const MAVIS_STATS: readonly MavisStat[] = [
  {
    end: 6,
    duration: 1.4,
    label: "YEARS IN BANGALORE",
  },
  {
    end: 200,
    suffix: "+",
    duration: 2.2,
    label: "FAMILIES HELPED",
  },
  {
    end: 37,
    duration: 1.8,
    label: "CAME BACK FOR MORE",
    emphasize: true,
  },
];

export interface MavisPillar {
  /** Short italic headline — "We [verb]." */
  headline: string;
  /** One-sentence body explaining how */
  body: string;
}

export const MAVIS_PILLARS: readonly MavisPillar[] = [
  {
    headline: "We escalate.",
    body: "When the builder goes silent, we knock until they answer.",
  },
  {
    headline: "We document.",
    body: "NOCs, verifications, registration — we manage every page.",
  },
  {
    headline: "We show up.",
    body: "When you can't make it to site, our team is there in your place.",
  },
];

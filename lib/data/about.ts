/**
 * About page (/about) copy + placeholder data.
 *
 * Narrative copy condensed from CONTENT.md §3.1 ("Our Story") and the
 * client brief. Factual numbers are NOT duplicated here — pull those from
 * `BRAND.metrics` (lib/constants) and `MAVIS_STATS` / `MAVIS_PILLARS`
 * (lib/data/mavis-difference). Founder portraits are placeholders (tone
 * gradient + initials) until real photography arrives.
 *
 * Spec: design.md §19.4, CONTENT.md §3.1.
 */

export interface StoryChapter {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
}

/** Prose chapters of the scroll-pinned narrative spine (problem → origin). */
export const STORY_CHAPTERS: readonly StoryChapter[] = [
  {
    id: "problem",
    eyebrow: "The problem",
    heading: "Most brokers vanish the moment the booking clears.",
    body: "A buyer closes the deal, pays the booking amount — and suddenly no one answers. Builder emails bounce. Paperwork stalls. The person who sold you the flat has already moved on to the next deal.",
  },
  {
    id: "origin",
    eyebrow: "Since 2019",
    heading: "So we built the firm that stays.",
    body: "Mavis Infra was founded in 2019 by Manvendra Singh and Vivek Shukla on one belief: buying a home shouldn't cost you your peace of mind afterward. Today, across Bangalore, Delhi NCR and Bhubaneswar, our advisors manage everything from the first site visit to the final possession letter — and well beyond.",
  },
];

/** The emotional peak — the one number that proves the promise. */
export const PROOF = {
  eyebrow: "The proof",
  count: 37,
  outOf: 200,
  lead: "came back for their second.",
  body: "An 18.5% repeat rate — in an industry where most brokers are forgotten the moment the deal closes. We are the channel partner who picks up the call. Before the sale, during the sale, and long after.",
} as const;

export interface Founder {
  name: string;
  role: string;
  initials: string;
  /** Tone hex for the portrait gradient (fallback when `image` is null). */
  tone: string;
  /**
   * Portrait image path. PLACEHOLDER — currently points at existing repo
   * imagery so the layout reads with real photos; swap for real founder
   * portraits (4:5) when supplied, or set to null to fall back to the
   * tone-gradient + initials card.
   */
  image: string | null;
}

export const FOUNDERS: readonly Founder[] = [
  {
    name: "Manvendra Singh",
    role: "Founder · Your single point of contact",
    initials: "MS",
    tone: "#1f1a14",
    image: "/images/premium/sobha-residence.jpg", // placeholder — swap
  },
  {
    name: "Vivek Shukla",
    role: "Co-founder",
    initials: "VS",
    tone: "#15181f",
    image: "/images/premium/oneworld-suite.jpg", // placeholder — swap
  },
];

/** Honesty as a feature — what Mavis does, and what it deliberately won't. */
export const COMMITMENTS = {
  does: [
    "New project sales",
    "Resale — 1% only",
    "Home loans, every bank — free to you",
    "Legal & documentation",
    "Interior services",
    "NRI services — POA, virtual tours, remote registration",
    "After-sales support — always",
  ],
  doesnt: [
    "Rental management",
    "Commercial projects outside Delhi NCR",
    "Promise returns no one can guarantee",
    "Push you toward a project that doesn't fit",
  ],
} as const;

export const COMMITMENT_NOTE =
  "We earn from builders. Our service to you costs nothing for new project purchases.";

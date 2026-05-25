/**
 * Premium Collection — homepage Section 3.
 *
 * 4 signature residences from our portfolio. Rendered as scroll-driven
 * editorial panels (not a carousel) — each gets a full 100vh moment with
 * cinematic interior photography and Cormorant italic editorial copy.
 *
 * Images generated via Higgsfield `soul_cinematic` 2k 16:9 — see
 * HIGGSFIELD-PROMPTS.md for prompts. When real builder interior renders land,
 * just swap the `image` paths.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §3.
 */

export interface PremiumCollectionItem {
  slug: string;
  /** Unit/residence label rendered as eyebrow above the headline (uppercase tracked) */
  label: string;
  /** Editorial italic headline — the main voice of the panel */
  headline: string;
  /** Project name + locality (tracked uppercase) */
  meta: string;
  /** Path to interior photograph (16:9 landscape). */
  image: string;
  /** Concise alt text */
  imageAlt: string;
  /** Tone hex for fallback layer / under image */
  tone: string;
  /** Where the CTA points */
  href: string;
}

export const PREMIUM_COLLECTION: readonly PremiumCollectionItem[] = [
  {
    slug: "sobha-hoskote",
    label: "THE SOBHA RESIDENCE",
    headline: "Mornings unfold with grace.",
    meta: "SOBHA HOSKOTE  ·  EAST BANGALORE",
    image: "/images/premium/sobha-residence.jpg",
    imageAlt:
      "Sobha Hoskote — open-plan living area with marble flooring and city view at golden hour",
    tone: "#1c1308",
    href: "/projects/sobha-hoskote",
  },
  {
    slug: "sobha-oneworld",
    label: "THE ONEWORLD SUITE",
    headline: "A quiet centre, above the city.",
    meta: "SOBHA ONEWORLD  ·  GREATER WHITEFIELD",
    image: "/images/premium/oneworld-suite.jpg",
    imageAlt:
      "Sobha OneWorld — master bedroom with floor-to-ceiling glass overlooking Bangalore at night",
    tone: "#161210",
    href: "/projects/sobha-oneworld",
  },
  {
    slug: "brigade-insignia",
    label: "THE BRIGADE PENTHOUSE",
    headline: "The skyline is your window.",
    meta: "BRIGADE INSIGNIA  ·  YELAHANKA",
    image: "/images/premium/brigade-penthouse.jpg",
    imageAlt:
      "Brigade Insignia — penthouse balcony view across Bangalore skyline at blue hour",
    tone: "#11141a",
    href: "/projects/brigade-insignia",
  },
  {
    slug: "provident-sunworth",
    label: "THE SUNWORTH HOME",
    headline: "Modern living, set beside the metro.",
    meta: "PROVIDENT SUNWORTH  ·  SOUTH BANGALORE",
    image: "/images/premium/sunworth-home.jpg",
    imageAlt:
      "Provident Sunworth — contemporary open-plan kitchen and dining with diffused morning light",
    tone: "#141210",
    href: "/projects/provident-sunworth-city",
  },
];

import dynamic from "next/dynamic";
import { HeroReel } from "@/components/home/HeroReel";
import { MavisDifference } from "@/components/home/MavisDifference";
import { BuilderPartners } from "@/components/home/BuilderPartners";
import { AllProjectsStrip } from "@/components/home/AllProjectsStrip";
import { BrowseByLocality } from "@/components/home/BrowseByLocality";
import { LeadForm } from "@/components/home/LeadForm";

// GSAP-heavy, below-the-fold sections — split into their own chunks with a
// reserved-height fallback so there's no layout shift while they load.
const FeaturedCarousel = dynamic(
  () =>
    import("@/components/home/FeaturedCarousel").then(
      (m) => m.FeaturedCarousel,
    ),
  { loading: () => <div className="min-h-screen bg-mavis-bg" /> },
);
const PremiumCollection = dynamic(
  () =>
    import("@/components/home/PremiumCollection").then(
      (m) => m.PremiumCollection,
    ),
  { loading: () => <div className="min-h-screen bg-mavis-bg" /> },
);

/**
 * Mavis Infra homepage. 8-section composition.
 * Each section is a self-contained component under components/home/.
 * Section specs live in MAVIS-HOMEPAGE-PLAN.md (project root).
 */
export default function HomePage() {
  return (
    <>
      <HeroReel />
      <FeaturedCarousel />
      <PremiumCollection />
      <MavisDifference />
      <BuilderPartners />
      <AllProjectsStrip />
      <BrowseByLocality />
      <LeadForm />
    </>
  );
}

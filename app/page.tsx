import { HeroReel } from "@/components/home/HeroReel";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { PremiumCollection } from "@/components/home/PremiumCollection";
import { MavisDifference } from "@/components/home/MavisDifference";
import { BuilderPartners } from "@/components/home/BuilderPartners";
import { AllProjectsStrip } from "@/components/home/AllProjectsStrip";
import { BrowseByLocality } from "@/components/home/BrowseByLocality";
import { LeadForm } from "@/components/home/LeadForm";

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

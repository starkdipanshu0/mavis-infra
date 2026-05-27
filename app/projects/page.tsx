import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { FrostedButton } from "@/components/shared/FrostedButton";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";
import { ALL_PROJECTS, TOTAL_PROJECT_COUNT } from "@/lib/data/all-projects";
import { BRAND } from "@/lib/constants";
import {
  parseSearchParams,
  objectToSearchParams,
  describeFilters,
  activeFilterCount,
} from "@/lib/projects/filters";

/**
 * `/projects` — the deep-browse listing. Utility-first, filterable.
 *
 * Server component: renders the static hero + footer CTA and hands the
 * interactive filter/grid experience to the client `ProjectsBrowser` (wrapped
 * in Suspense, required by Next 16 for useSearchParams on a static route).
 *
 * Filter state lives entirely in the URL query string — see
 * `lib/projects/filters.ts`. Metadata is derived from the active filters so
 * shared/filtered URLs carry meaningful titles (SEO) without separate routes.
 *
 * Spec: PROJECTS-PAGE-PLAN.md.
 */

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const state = parseSearchParams(objectToSearchParams(await searchParams));
  const hasFilters = activeFilterCount(state) > 0 || state.zone !== "all";

  const title = hasFilters
    ? describeFilters(state)
    : "All Projects in Bangalore — Apartments, Villas & Plots";
  const description = hasFilters
    ? `Browse ${describeFilters(state)} from Sobha, Prestige, Brigade, Provident & top Bangalore builders. RERA-verified. Free site visits.`
    : `Browse ${TOTAL_PROJECT_COUNT}+ RERA-verified projects from Sobha, Prestige, Brigade, Provident & top Bangalore builders. Filter by zone, budget, BHK.`;

  return { title, description };
}

export default function ProjectsListingPage() {
  return (
    <div className="relative w-full bg-mavis-bg text-mavis-fg">
      {/* Section 1 — compact hero */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16">
        <Container size="wide">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-mavis-gold/60" />
            <span
              className="text-[10px] uppercase font-light text-mavis-gold"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The Inventory
            </span>
          </div>
          <SectionHeading
            bold="EXPLORE"
            thin="ALL PROJECTS"
            size="lg"
            as="h1"
            align="left"
            className="mt-5"
          />
          <p className="mt-6 max-w-xl font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.8vw,1.35rem)] leading-relaxed">
            {TOTAL_PROJECT_COUNT} residences across Bangalore — filter by zone,
            budget and configuration to find your match.
          </p>
        </Container>
      </section>

      {/* Sections 2–6 — interactive browse */}
      <Suspense fallback={<BrowseFallback />}>
        <ProjectsBrowser projects={ALL_PROJECTS} />
      </Suspense>

      {/* Section 7 — footer CTA strip */}
      <section className="border-t border-mavis-line py-20 sm:py-28">
        <Container size="narrow" className="text-center">
          <h2 className="font-display italic font-light text-mavis-fg text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
            Can&rsquo;t decide? That&rsquo;s what we&rsquo;re here for.
          </h2>
          <p className="mt-5 text-sm sm:text-base font-light leading-relaxed text-mavis-fg-muted">
            {BRAND.metrics.repeatClients} of our {BRAND.metrics.familiesHelped}{" "}
            buyers came back for their second. Get matched with a Mavis advisor
            who&rsquo;ll filter through these for you.
          </p>
          <div className="mt-9 flex justify-center">
            <FrostedButton href="/#concierge" size="lg">
              Speak to an advisor
            </FrostedButton>
          </div>
        </Container>
      </section>
    </div>
  );
}

/** Suspense fallback — keeps the page shell stable while the client browser
    hydrates (prevents layout shift on first paint). */
function BrowseFallback() {
  return (
    <Container size="wide" className="py-16">
      <div className="h-10 w-full max-w-md rounded-sm bg-mavis-surface animate-pulse" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/3 rounded-sm bg-mavis-surface animate-pulse"
          />
        ))}
      </div>
    </Container>
  );
}

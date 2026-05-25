import Link from "next/link";
import type { Metadata } from "next";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ALL_PROJECTS, TOTAL_PROJECT_COUNT } from "@/lib/data/all-projects";
import { findLocalityBySlug } from "@/lib/data/localities";

/**
 * `/projects` — listing stub.
 *
 * Lightweight v1: section heading + grid of all 12 cards, with an optional
 * locality filter driven by the `?locality=<slug>` query (set by the homepage
 * BrowseByLocality bento). The full filterable listing (zone tabs, filter
 * bar, sort, infinite scroll) is documented in PROJECTS-PAGE-PLAN.md and
 * will replace this stub once CMS data lands.
 *
 * Note on Next 16 searchParams: `searchParams` is now a Promise — `await` it
 * before use, matching the same convention as dynamic-route `params`.
 */

interface PageProps {
  searchParams: Promise<{ locality?: string }>;
}

export const metadata: Metadata = {
  title: "All Projects",
  description: `Browse ${TOTAL_PROJECT_COUNT}+ RERA-verified projects from Sobha, Prestige, Brigade, Provident and top Bangalore builders.`,
};

export default async function ProjectsListingPage({ searchParams }: PageProps) {
  const { locality: localitySlug } = await searchParams;
  const locality = localitySlug ? findLocalityBySlug(localitySlug) : undefined;

  // Filter by locality name match — same string the BrowseByLocality grid
  // tiles use for their `name` field. Falls through to the unfiltered list
  // if the slug doesn't resolve (defensive against stale links).
  const projects = locality
    ? ALL_PROJECTS.filter((p) => p.locality === locality.name)
    : ALL_PROJECTS;

  return (
    <div className="relative w-full bg-mavis-bg text-mavis-fg">
      {/* Intro */}
      <section className="pt-32 sm:pt-40 pb-12 px-6 sm:px-10 lg:px-16 text-center">
        <SectionHeading bold="EXPLORE" thin="ALL PROJECTS" size="md" />
        <p className="mt-7 font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed max-w-md mx-auto">
          {locality
            ? `Projects in ${locality.name}.`
            : `${TOTAL_PROJECT_COUNT} residences across Bangalore. Tap any card for details and a one-tap WhatsApp enquiry.`}
        </p>

        {locality && (
          <div className="mt-7 flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mavis-gold/40 bg-mavis-gold/8 text-mavis-fg hover:border-mavis-gold/60 hover:bg-mavis-gold/15 transition-all text-[10px] uppercase font-light"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              <span>{locality.name}</span>
              <X className="h-3 w-3" strokeWidth={1.5} />
              <span className="sr-only">Clear filter</span>
            </Link>
          </div>
        )}
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-360 px-6 sm:px-10 lg:px-16 pb-32">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {projects.map((item, i) => (
              <ProjectCard
                key={item.slug}
                item={item}
                priority={i < 4}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md text-center py-20">
            <p className="font-display italic text-mavis-fg-muted text-lg">
              No curated projects in {locality?.name} yet — more are coming.
            </p>
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase text-mavis-fg hover:text-mavis-gold transition-colors font-light"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              View all {TOTAL_PROJECT_COUNT} projects →
            </Link>
          </div>
        )}

        {/* Footer note — only meaningful when not filtered */}
        {!locality && projects.length > 0 && (
          <p
            className="mt-20 text-center text-[10px] uppercase text-mavis-fg-faint font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            + {TOTAL_PROJECT_COUNT - ALL_PROJECTS.length} more projects available
            on request
          </p>
        )}
      </section>
    </div>
  );
}

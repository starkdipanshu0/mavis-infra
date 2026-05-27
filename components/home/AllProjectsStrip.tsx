"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import {
  ALL_PROJECTS,
  PROJECT_FILTERS,
  TOTAL_PROJECT_COUNT,
} from "@/lib/data/all-projects";

/**
 * S6 — Explore All Projects (horizontal card strip).
 *
 * The page's transition from cinematic moments to utility. Buyers who've
 * absorbed the brand promise now want to *look at the inventory*. This is
 * the teaser — 12 curated cards behind 4 filter chips, with a CTA to the
 * full /projects listing for deep browsing.
 *
 * Layout:
 *   • SectionHeading "EXPLORE · ALL PROJECTS"
 *   • Italic Cormorant subtitle ("46 residences across Bangalore.")
 *   • 4 filter chips (ALL · PRE-LAUNCH · READY · LUXURY) with live counts.
 *     Client-side filter — no page change, no re-fetch.
 *   • Horizontal scroll-snap strip of ProjectCard. Hidden scrollbar, arrow
 *     buttons for desktop nav, native swipe on mobile.
 *   • "View All 46 Projects →" CTA → /projects
 *
 * Footprint: ~85vh on desktop. The hero/featured/premium/difference moments
 * earned their long footprints; this section is intentionally tighter — the
 * deep browse lives on /projects, not here.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §6 · PROJECTS-PAGE-PLAN.md.
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

export function AllProjectsStrip() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Precompute counts per filter so the chip labels can show them
  const counts = useMemo(() => {
    return PROJECT_FILTERS.reduce<Record<string, number>>((acc, f) => {
      acc[f.slug] = ALL_PROJECTS.filter(f.match).length;
      return acc;
    }, {});
  }, []);

  const visibleProjects = useMemo(() => {
    const filter = PROJECT_FILTERS.find((f) => f.slug === activeFilter);
    if (!filter) return [...ALL_PROJECTS];
    return ALL_PROJECTS.filter(filter.match);
  }, [activeFilter]);

  const scrollByCard = (direction: "prev" | "next") => {
    const node = scrollRef.current;
    if (!node) return;
    // Find a card to measure width — the first child is the gutter spacer,
    // so query the first card directly. Read the live computed gap instead
    // of hardcoding 24 px so this stays correct if `gap-6` ever changes.
    const card = node.querySelector<HTMLElement>("[data-project-card]");
    if (!card) return;
    const computedGap = parseFloat(getComputedStyle(node).columnGap) || 0;
    const stepPx = card.getBoundingClientRect().width + computedGap;
    node.scrollBy({
      left: direction === "next" ? stepPx : -stepPx,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-label="Explore all projects"
      className="relative w-full bg-mavis-bg py-24 sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-350">
        {/* Heading + italic subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.0, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="px-6 sm:px-10 lg:px-16 text-center"
        >
          <SectionHeading bold="EXPLORE" thin="ALL PROJECTS" size="md" />
          <p className="mt-7 font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed">
            {TOTAL_PROJECT_COUNT} residences across Bangalore.
          </p>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: 0.8, delay: 0.3, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-12 sm:mt-14 px-6 sm:px-10 lg:px-16 flex flex-wrap items-center justify-center gap-3"
        >
          {PROJECT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.slug;
            const count = counts[filter.slug] ?? 0;
            return (
              <button
                key={filter.slug}
                type="button"
                onClick={() => setActiveFilter(filter.slug)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-baseline gap-2 px-4 py-2 rounded-full border",
                  "text-[10px] uppercase font-light transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft",
                  isActive
                    ? "border-mavis-gold text-mavis-fg bg-mavis-gold/8"
                    : "border-mavis-line text-mavis-fg-muted hover:border-mavis-fg/30 hover:text-mavis-fg",
                )}
                style={{ letterSpacing: "var(--tracking-display-wide)" }}
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    "text-[9px] transition-colors",
                    isActive ? "text-mavis-gold" : "text-mavis-fg-faint",
                  )}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Horizontal scroll-snap strip */}
        <div className="relative mt-12 sm:mt-14">
          {/* Arrow nav — visible from sm: up (was lg:, which hid them on most
              laptops). Touch users can still swipe via scroll-snap. */}
          <button
            type="button"
            onClick={() => scrollByCard("prev")}
            aria-label="Scroll projects left"
            className="hidden sm:inline-flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-mavis-bg/70 backdrop-blur-md border border-mavis-fg/15 text-mavis-fg hover:bg-mavis-bg/85 hover:border-mavis-fg/30 transition-all active:scale-95 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("next")}
            aria-label="Scroll projects right"
            className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-mavis-bg/70 backdrop-blur-md border border-mavis-fg/15 text-mavis-fg hover:bg-mavis-bg/85 hover:border-mavis-fg/30 transition-all active:scale-95 shadow-lg"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <div
            ref={scrollRef}
            className={cn(
              "flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 sm:scroll-px-10 lg:scroll-px-16",
              // Hide scrollbar across browsers — native momentum still works.
              "scrollbar-none [&::-webkit-scrollbar]:hidden",
              // Left/right padding so first/last card aren't flush with edges
              "px-6 sm:px-10 lg:px-16",
              "pb-4",
            )}
          >
            {/* AnimatePresence with popLayout so filter changes animate
                in/out smoothly instead of snapping. */}
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((item, i) => (
                <motion.div
                  key={item.slug}
                  data-project-card
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.55,
                      delay: Math.min(i * 0.04, 0.3),
                      ease: EASE_QUINT_OUT,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.94,
                    transition: { duration: 0.3, ease: "easeOut" as const },
                  }}
                  className="flex-none w-[78vw] sm:w-[320px] snap-start"
                >
                  <ProjectCard
                    item={item}
                    priority={i < 2}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Tail spacer — gives last card breathing room past the snap edge */}
            <div
              aria-hidden="true"
              className="flex-none w-2 sm:w-4 lg:w-8"
            />
          </div>

          {/* Mobile swipe affordance — right-edge fade hints at more cards */}
          <div
            aria-hidden="true"
            className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-mavis-bg to-transparent"
          />
        </div>

        {/* CTA — text link, not a button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: 0.8, delay: 0.4, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-14 sm:mt-16 px-6 flex justify-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-[11px] uppercase text-mavis-fg font-light hover:text-mavis-gold transition-colors duration-300"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            View all {TOTAL_PROJECT_COUNT} projects
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

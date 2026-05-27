"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FullScreenScrollFX } from "@/components/ui/full-screen-scroll-fx";
import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";

/**
 * S2 — Featured Projects (pinned scroll-fx).
 *
 * Replaces the previous horizontal-strip swipe carousel with the
 * `FullScreenScrollFX` primitive. Each of the 6 featured projects gets its
 * own full-screen moment — background cross-fades, italic-Cormorant project
 * name reveals word-by-word, builder and location flank as side-list rows.
 *
 * Layout (per active section):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │   FEATURED                                               │  ← header top
 *   │   PROJECTS                                               │
 *   │                                                          │
 *   │  · SOBHA                                                 │
 *   │    PROVIDENT          Sobha Hoskote              EAST    │  ← left list / centre title / right list
 *   │    BIRLA                                       BANGALORE │
 *   │    BRIGADE                                               │
 *   │                                                          │
 *   │              SALE IS NOT THE END   ·   01/06             │  ← footer + progress
 *   └──────────────────────────────────────────────────────────┘
 *
 * Pinned for (N+1) × 100vh of scroll — 700vh total for 6 projects. The
 * pinning means user sees the same viewport while scrolling drives the
 * section change. Cinematic single-stage with cross-fading layers.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §2 (FullScreenScrollFX revision).
 * Underlying primitive: components/ui/full-screen-scroll-fx.tsx (21st.dev).
 */

export function FeaturedCarousel() {
  // Track which slide is in view so the footer CTA can deep-link into the
  // active project's detail page. Previously this section was purely cinematic
  // and had no exit point — buyers had to scroll down to S6 to find a slide
  // they wanted to explore.
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(
    () =>
      FEATURED_PROJECTS.map((p) => ({
        id: p.slug,
        background: p.image ?? "",
        leftLabel: p.builder,
        title: p.name,
        rightLabel: p.location,
      })),
    [],
  );

  const active = FEATURED_PROJECTS[activeIndex] ?? FEATURED_PROJECTS[0];

  return (
    <FullScreenScrollFX
      sections={sections}
      ariaLabel="Featured projects — a pinned scroll showcase of six flagships"
      fontFamily='var(--font-inter), "Helvetica Neue", system-ui, sans-serif'
      onIndexChange={setActiveIndex}
      header={
        <>
          <span style={{ fontWeight: 700 }}>Featured</span>
          <span style={{ fontWeight: 200 }}>Projects</span>
        </>
      }
      footer={
        <Link
          href={`/projects/${active.slug}`}
          className="group inline-flex items-center gap-2 hover:text-mavis-gold transition-colors duration-300"
          aria-label={`Explore ${active.name}`}
        >
          <span>Explore {active.name}</span>
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>
      }
      durations={{ change: 0.7, snap: 800 }}
      colors={{
        text: "#f5f1ea",
        // Overlay kept light (0.18) so the photography reads bright; the
        // off-white tracked type stays legible thanks to its own weight/shadow.
        overlay: "rgba(13, 12, 10, 0.18)",
        pageBg: "#0d0c0a",
        stageBg: "#0d0c0a",
      }}
      showProgress
    />
  );
}

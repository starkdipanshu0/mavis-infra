"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectCardItem } from "@/lib/data/all-projects";

interface ProjectGridProps {
  projects: ProjectCardItem[];
  /** Cards shown before "Load more". Defaults to 18 (6 rows × 3). */
  pageSize?: number;
}

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Section 5 — the project grid. Reuses the shared ProjectCard. Cards stagger
 * in on mount and re-stagger when the filtered set changes (the grid key is
 * tied to a signature of the current result). Honors reduced-motion.
 */
export function ProjectGrid({ projects, pageSize = 18 }: ProjectGridProps) {
  const reduce = useReducedMotion() ?? false;
  const [shown, setShown] = useState(pageSize);

  // Signature of the current result set — changes on any filter/sort change,
  // which remounts the grid so the entrance stagger replays.
  const signature = useMemo(
    () => projects.map((p) => p.slug).join("|"),
    [projects],
  );

  // Reset pagination when the filtered set changes — adjusting state during
  // render (React's recommended pattern) instead of an effect, so there's no
  // extra render pass or cascading-render lint warning.
  const [prevSignature, setPrevSignature] = useState(signature);
  if (signature !== prevSignature) {
    setPrevSignature(signature);
    setShown(pageSize);
  }

  const visible = projects.slice(0, shown);
  const hasMore = shown < projects.length;

  return (
    <div>
      <div
        key={signature}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {visible.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: Math.min(i, 8) * 0.05,
                ease: EASE_QUINT_OUT,
              },
            }}
          >
            <ProjectCard item={item} priority={i < 3} className="h-full" />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + pageSize)}
            className="px-9 h-12 text-xs uppercase font-medium text-mavis-fg bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/15 hover:border-white/40 transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

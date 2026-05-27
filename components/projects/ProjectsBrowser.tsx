"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ZoneTabs } from "./ZoneTabs";
import { FilterBar } from "./FilterBar";
import { FilterSheet } from "./FilterSheet";
import { ActiveFilters } from "./ActiveFilters";
import { SortCountStrip } from "./SortCountStrip";
import { ProjectGrid } from "./ProjectGrid";
import { EmptyState } from "./EmptyState";
import { Container } from "@/components/shared/Container";
import { buildWhatsAppLink, type SortSlug } from "@/lib/constants";
import type { ProjectCardItem } from "@/lib/data/all-projects";
import {
  parseSearchParams,
  buildQueryString,
  applyFilters,
  sortProjects,
  activeFilterCount,
  deriveBuilders,
  describeFilters,
  EMPTY_FILTERS,
  type FilterState,
  type FilterKey,
  type ZoneFilter,
} from "@/lib/projects/filters";

interface ProjectsBrowserProps {
  projects: readonly ProjectCardItem[];
}

/**
 * Client orchestrator for /projects. The URL query string is the single
 * source of truth: state is derived from `useSearchParams` and every change
 * is written back via `router.replace(..., { scroll: false })` so filters are
 * shareable and back-button-safe. Filtering/sorting runs client-side.
 *
 * Must be rendered inside a <Suspense> boundary (Next 16 requirement for
 * useSearchParams on a prerenderable route).
 */
export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const state = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const commit = useCallback(
    (next: FilterState) => {
      const qs = buildQueryString(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const builders = useMemo(() => deriveBuilders(projects), [projects]);

  const filtered = useMemo(
    () => sortProjects(applyFilters(projects, state), state.sort),
    [projects, state],
  );

  // Zone tab counts: ignore the zone filter, respect the other active filters.
  const zoneCounts = useMemo(() => {
    const scoped = applyFilters(projects, { ...state, zone: "all" });
    const counts: Record<ZoneFilter, number> = {
      all: scoped.length,
      east: 0,
      north: 0,
      south: 0,
      outstation: 0,
    };
    for (const p of scoped) counts[p.zone] += 1;
    return counts;
  }, [projects, state]);

  const activeCount = activeFilterCount(state);

  const setZone = (zone: ZoneFilter) => commit({ ...state, zone });
  const setSort = (sort: SortSlug) => commit({ ...state, sort });

  const toggleFilter = (key: FilterKey, slug: string) => {
    if (key === "bhk") {
      const n = Number(slug);
      const has = state.bhk.includes(n);
      commit({
        ...state,
        bhk: has ? state.bhk.filter((x) => x !== n) : [...state.bhk, n],
      });
      return;
    }
    const arr = state[key] as string[];
    const has = arr.includes(slug);
    commit({ ...state, [key]: has ? arr.filter((x) => x !== slug) : [...arr, slug] });
  };

  // Clear the five dropdown filters; keep the current zone + sort.
  const clearFilters = () =>
    commit({ ...EMPTY_FILTERS, zone: state.zone, sort: state.sort });

  const whatsappHref = buildWhatsAppLink(
    `Hi, I'm looking for ${describeFilters(state)}. Can you help me find the right options?`,
  );

  return (
    <>
      {/* Sticky control stack — zone tabs + (desktop) filter bar */}
      <div className="sticky top-0 z-40 border-b border-mavis-line bg-mavis-bg/95 backdrop-blur-xl shadow-[0_12px_32px_-20px_rgba(0,0,0,0.85)]">
        <Container size="wide">
          <ZoneTabs active={state.zone} counts={zoneCounts} onSelect={setZone} />
          <div className="hidden sm:flex items-center border-t border-mavis-line py-1.5">
            <FilterBar
              state={state}
              builders={builders}
              activeCount={activeCount}
              onToggle={toggleFilter}
              onClear={clearFilters}
            />
          </div>
        </Container>
      </div>

      {/* Active-filter chips */}
      {activeCount > 0 && (
        <Container size="wide" className="pt-6">
          <ActiveFilters
            state={state}
            builders={builders}
            onRemove={toggleFilter}
            onClearAll={clearFilters}
          />
        </Container>
      )}

      {/* Sort + count strip */}
      <Container size="wide" className="pt-6 pb-6">
        <SortCountStrip count={filtered.length} sort={state.sort} onSort={setSort} />
      </Container>

      {/* Grid / empty state */}
      <Container size="wide" className="pb-28">
        {filtered.length > 0 ? (
          <ProjectGrid projects={filtered} />
        ) : (
          <EmptyState onClear={clearFilters} whatsappHref={whatsappHref} />
        )}
      </Container>

      {/* Mobile floating FILTERS pill → bottom sheet */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="sm:hidden fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-mavis-elevated/95 backdrop-blur-md border border-mavis-line-strong px-5 py-3 text-[11px] uppercase font-light text-mavis-fg shadow-2xl active:scale-95 transition-transform"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        Filters
        {activeCount > 0 && (
          <span className="text-mavis-gold">· {activeCount}</span>
        )}
      </button>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        state={state}
        builders={builders}
        resultCount={filtered.length}
        activeCount={activeCount}
        onToggle={toggleFilter}
        onSort={setSort}
        onClear={clearFilters}
      />
    </>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { ZONES } from "@/lib/constants";
import type { ZoneFilter } from "@/lib/projects/filters";

interface ZoneTabsProps {
  active: ZoneFilter;
  counts: Record<ZoneFilter, number>;
  onSelect: (zone: ZoneFilter) => void;
}

const TABS: { label: string; slug: ZoneFilter }[] = [
  { label: "All", slug: "all" },
  ...ZONES.map((z) => ({ label: z.label, slug: z.slug as ZoneFilter })),
];

/**
 * Section 2 — primary zone navigation. Bangalore buyers think in zones first.
 * Horizontal scroll-snap on mobile (contained — never bleeds the page).
 */
export function ZoneTabs({ active, counts, onSelect }: ZoneTabsProps) {
  return (
    <nav
      aria-label="Filter projects by zone"
      className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden snap-x"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.slug;
        const count = counts[tab.slug] ?? 0;
        return (
          <button
            key={tab.slug}
            type="button"
            onClick={() => onSelect(tab.slug)}
            aria-pressed={isActive}
            className={cn(
              "group relative shrink-0 snap-start whitespace-nowrap py-3.5 text-[12px] uppercase font-light transition-colors duration-200",
              "focus-visible:outline-none",
              isActive
                ? "text-mavis-fg"
                : "text-mavis-fg-muted hover:text-mavis-fg/80",
            )}
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "ml-1.5 tabular-nums transition-opacity",
                isActive ? "text-mavis-gold" : "text-mavis-fg-faint",
              )}
            >
              {count}
            </span>
            {/* Active underline — gold filament */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-px h-px origin-center transition-transform duration-300 ease-out bg-mavis-gold",
                isActive ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}

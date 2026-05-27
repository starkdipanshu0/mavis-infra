"use client";

import { FilterDropdown } from "./FilterDropdown";
import {
  BUDGET_BRACKETS,
  BHK_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "@/lib/constants";
import type { FilterState, FilterKey, BuilderOption } from "@/lib/projects/filters";

interface FilterBarProps {
  state: FilterState;
  builders: BuilderOption[];
  activeCount: number;
  onToggle: (key: FilterKey, slug: string) => void;
  onClear: () => void;
}

/**
 * Section 3 — desktop filter bar (5 multi-select dropdowns + CLEAR).
 * Hidden below `sm`; mobile uses the floating pill → FilterSheet instead.
 */
export function FilterBar({
  state,
  builders,
  activeCount,
  onToggle,
  onClear,
}: FilterBarProps) {
  return (
    <div className="hidden sm:flex items-center gap-1">
      <FilterDropdown
        label="Budget"
        options={BUDGET_BRACKETS.map((b) => ({ label: b.label, slug: b.slug }))}
        selected={state.budget}
        onToggle={(slug) => onToggle("budget", slug)}
      />
      <FilterDropdown
        label="BHK"
        options={BHK_OPTIONS.map((b) => ({ label: b.label, slug: b.slug }))}
        selected={state.bhk.map(String)}
        onToggle={(slug) => onToggle("bhk", slug)}
      />
      <FilterDropdown
        label="Status"
        options={STATUS_OPTIONS.map((s) => ({ label: s.label, slug: s.slug }))}
        selected={state.status}
        onToggle={(slug) => onToggle("status", slug)}
      />
      <FilterDropdown
        label="Builder"
        options={builders.map((b) => ({
          label: titleCase(b.name),
          slug: b.slug,
          count: b.count,
        }))}
        selected={state.builder}
        onToggle={(slug) => onToggle("builder", slug)}
      />
      <FilterDropdown
        label="Type"
        options={TYPE_OPTIONS.map((t) => ({ label: t.label, slug: t.slug }))}
        selected={state.type}
        onToggle={(slug) => onToggle("type", slug)}
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="ml-2 px-3 py-2 text-[11px] uppercase font-light text-mavis-gold hover:text-mavis-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

/** "SOBHA" → "Sobha" for friendlier dropdown labels. */
function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

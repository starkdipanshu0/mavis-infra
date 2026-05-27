"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import {
  BUDGET_BRACKETS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "@/lib/constants";
import type {
  FilterState,
  FilterKey,
  BuilderOption,
} from "@/lib/projects/filters";

interface ActiveFiltersProps {
  state: FilterState;
  builders: BuilderOption[];
  onRemove: (key: FilterKey, slug: string) => void;
  onClearAll: () => void;
}

interface Chip {
  key: FilterKey;
  slug: string;
  label: string;
}

/**
 * Removable chips summarising every active dropdown filter. Gives buyers a
 * persistent, scannable view of what's applied — and lets them peel filters
 * off one at a time instead of reopening each dropdown.
 */
export function ActiveFilters({
  state,
  builders,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: Chip[] = [
    ...state.budget.map((slug) => ({
      key: "budget" as const,
      slug,
      label: BUDGET_BRACKETS.find((b) => b.slug === slug)?.label ?? slug,
    })),
    ...state.bhk.map((n) => ({
      key: "bhk" as const,
      slug: String(n),
      label: `${n} BHK`,
    })),
    ...state.status.map((slug) => ({
      key: "status" as const,
      slug,
      label: STATUS_OPTIONS.find((s) => s.slug === slug)?.label ?? slug,
    })),
    ...state.builder.map((slug) => ({
      key: "builder" as const,
      slug,
      label: titleCase(
        builders.find((b) => b.slug === slug)?.name ?? slug,
      ),
    })),
    ...state.type.map((slug) => ({
      key: "type" as const,
      slug,
      label: TYPE_OPTIONS.find((t) => t.slug === slug)?.label ?? slug,
    })),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={`${chip.key}:${chip.slug}`}
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => onRemove(chip.key, chip.slug)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-mavis-gold/30 bg-mavis-gold/8 py-1.5 pl-3.5 pr-2.5 text-[11px] font-light text-mavis-fg transition-colors hover:border-mavis-gold/60 hover:bg-mavis-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft"
            style={{ letterSpacing: "0.04em" }}
            aria-label={`Remove ${chip.label} filter`}
          >
            <span>{chip.label}</span>
            <X
              className="h-3 w-3 text-mavis-fg-muted transition-colors group-hover:text-mavis-gold"
              strokeWidth={2}
            />
          </motion.button>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-[10px] uppercase font-light text-mavis-fg-faint hover:text-mavis-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        Clear all
      </button>
    </div>
  );
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BUDGET_BRACKETS,
  BHK_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  SORT_OPTIONS,
  type SortSlug,
} from "@/lib/constants";
import type {
  FilterState,
  FilterKey,
  BuilderOption,
} from "@/lib/projects/filters";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  builders: BuilderOption[];
  resultCount: number;
  activeCount: number;
  onToggle: (key: FilterKey, slug: string) => void;
  onSort: (sort: SortSlug) => void;
  onClear: () => void;
}

/**
 * Section 3 (mobile) — full filter set + sort in a bottom sheet. All changes
 * commit live to the URL; "View N projects" simply closes the sheet.
 */
export function FilterSheet({
  open,
  onClose,
  state,
  builders,
  resultCount,
  activeCount,
  onToggle,
  onSort,
  onClear,
}: FilterSheetProps) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-71 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-mavis-line-strong bg-mavis-elevated sm:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort projects"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-mavis-line px-5 py-4">
              <span
                className="text-[12px] uppercase font-light text-mavis-fg"
                style={{ letterSpacing: "var(--tracking-display-wide)" }}
              >
                Filters{activeCount > 0 ? ` · ${activeCount}` : ""}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="text-mavis-fg-muted hover:text-mavis-fg transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable filter groups */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <SheetGroup label="Budget">
                {BUDGET_BRACKETS.map((b) => (
                  <SheetRow
                    key={b.slug}
                    label={b.label}
                    checked={state.budget.includes(b.slug)}
                    onClick={() => onToggle("budget", b.slug)}
                  />
                ))}
              </SheetGroup>

              <SheetGroup label="Configuration">
                {BHK_OPTIONS.map((b) => (
                  <SheetRow
                    key={b.slug}
                    label={b.label}
                    checked={state.bhk.map(String).includes(b.slug)}
                    onClick={() => onToggle("bhk", b.slug)}
                  />
                ))}
              </SheetGroup>

              <SheetGroup label="Status">
                {STATUS_OPTIONS.map((s) => (
                  <SheetRow
                    key={s.slug}
                    label={s.label}
                    checked={state.status.includes(s.slug)}
                    onClick={() => onToggle("status", s.slug)}
                  />
                ))}
              </SheetGroup>

              <SheetGroup label="Builder">
                {builders.map((b) => (
                  <SheetRow
                    key={b.slug}
                    label={`${titleCase(b.name)} (${b.count})`}
                    checked={state.builder.includes(b.slug)}
                    onClick={() => onToggle("builder", b.slug)}
                  />
                ))}
              </SheetGroup>

              <SheetGroup label="Type">
                {TYPE_OPTIONS.map((t) => (
                  <SheetRow
                    key={t.slug}
                    label={t.label}
                    checked={state.type.includes(t.slug)}
                    onClick={() => onToggle("type", t.slug)}
                  />
                ))}
              </SheetGroup>

              <SheetGroup label="Sort by">
                {SORT_OPTIONS.map((o) => (
                  <SheetRow
                    key={o.slug}
                    label={o.label}
                    checked={state.sort === o.slug}
                    radio
                    onClick={() => onSort(o.slug)}
                  />
                ))}
              </SheetGroup>
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-3 border-t border-mavis-line px-5 py-4">
              <button
                type="button"
                onClick={onClear}
                disabled={activeCount === 0}
                className="px-4 py-3 text-[11px] uppercase font-light text-mavis-fg-muted enabled:hover:text-mavis-fg disabled:opacity-40 transition-colors"
                style={{ letterSpacing: "var(--tracking-display-wide)" }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-sm bg-mavis-gold/90 px-4 py-3 text-[11px] uppercase font-medium text-mavis-bg hover:bg-mavis-gold transition-colors"
                style={{ letterSpacing: "var(--tracking-display-wide)" }}
              >
                View {resultCount} {resultCount === 1 ? "project" : "projects"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-mavis-line py-4 last:border-b-0">
      <p
        className="mb-2 text-[10px] uppercase font-light text-mavis-fg-faint"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        {label}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function SheetRow({
  label,
  checked,
  onClick,
  radio = false,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  radio?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 py-3 text-left"
      aria-pressed={checked}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
          radio ? "rounded-full" : "rounded-[3px]",
          checked ? "border-mavis-gold bg-mavis-gold/20" : "border-mavis-fg/25",
        )}
      >
        {checked &&
          (radio ? (
            <span className="h-2 w-2 rounded-full bg-mavis-gold" />
          ) : (
            <Check className="h-3.5 w-3.5 text-mavis-gold" strokeWidth={2.5} />
          ))}
      </span>
      <span className="text-[14px] font-light text-mavis-fg">{label}</span>
    </button>
  );
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

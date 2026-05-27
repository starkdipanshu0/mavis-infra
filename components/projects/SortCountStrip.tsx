"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, type SortSlug } from "@/lib/constants";

interface SortCountStripProps {
  count: number;
  sort: SortSlug;
  onSort: (sort: SortSlug) => void;
}

/**
 * Section 4 — live result count (left) + sort dropdown (right). Single-select.
 */
export function SortCountStrip({ count, sort, onSort }: SortCountStripProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const activeLabel =
    SORT_OPTIONS.find((s) => s.slug === sort)?.label ?? "Featured";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex items-center justify-between">
      <p
        className="text-[12px] uppercase font-light text-mavis-fg-muted tabular-nums"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        {count} {count === 1 ? "project" : "projects"}
      </p>

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 text-[11px] uppercase font-light text-mavis-fg-muted hover:text-mavis-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          <span className="text-mavis-fg-faint">Sort:</span>
          <span className="text-mavis-fg">{activeLabel}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
            strokeWidth={1.5}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-50 mt-2 min-w-56 rounded-sm border border-mavis-line-strong bg-mavis-elevated p-1.5 shadow-2xl"
            role="listbox"
          >
            {SORT_OPTIONS.map((opt) => {
              const checked = opt.slug === sort;
              return (
                <button
                  key={opt.slug}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => {
                    onSort(opt.slug);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors duration-150 hover:bg-white/5"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {checked && (
                      <Check
                        className="h-3.5 w-3.5 text-mavis-gold"
                        strokeWidth={2.5}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[13px] font-light",
                      checked ? "text-mavis-fg" : "text-mavis-fg-muted",
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

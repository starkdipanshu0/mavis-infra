"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  label: string;
  slug: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: readonly DropdownOption[];
  /** Selected slugs */
  selected: string[];
  onToggle: (slug: string) => void;
}

/**
 * Multi-select dropdown for the desktop filter bar. Click-outside + Escape to
 * close. A gold dot marks an active filter; each row is a checkbox.
 */
export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const active = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 text-[11px] uppercase font-light transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded",
          active || open
            ? "text-mavis-fg"
            : "text-mavis-fg-muted hover:text-mavis-fg",
        )}
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        {active && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-mavis-gold"
          />
        )}
        <span>{label}</span>
        {active && <span className="text-mavis-gold">· {selected.length}</span>}
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
          className={cn(
            "absolute left-0 top-full z-50 mt-2 min-w-52 max-h-80 overflow-y-auto",
            "rounded-sm border border-mavis-line-strong bg-mavis-elevated p-1.5 shadow-2xl",
          )}
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.slug);
            return (
              <button
                key={opt.slug}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => onToggle(opt.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors duration-150",
                  "hover:bg-white/5",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                    checked
                      ? "border-mavis-gold bg-mavis-gold/20"
                      : "border-mavis-fg/25",
                  )}
                >
                  {checked && (
                    <Check className="h-3 w-3 text-mavis-gold" strokeWidth={2.5} />
                  )}
                </span>
                <span className="flex-1 text-[13px] font-light text-mavis-fg">
                  {opt.label}
                </span>
                {typeof opt.count === "number" && (
                  <span className="text-[11px] font-light text-mavis-fg-faint tabular-nums">
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

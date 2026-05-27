"use client";

import { MessageCircle } from "lucide-react";

interface EmptyStateProps {
  onClear: () => void;
  whatsappHref: string;
}

/**
 * Section 6 — shown when active filters return zero matches. A tight-filter
 * zero-result is a high-intent moment, so this is a lead-capture, not a
 * dead end: clear filters, or jump straight to a WhatsApp advisor.
 */
export function EmptyState({ onClear, whatsappHref }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="font-display italic text-2xl text-mavis-fg">
        No projects match these filters.
      </p>
      <p className="mt-4 text-sm font-light leading-relaxed text-mavis-fg-muted">
        Adjust your filters — or talk to a Mavis advisor. We may have unlisted
        options matching your brief.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClear}
          className="h-11 px-7 text-[11px] uppercase font-light text-mavis-fg border border-mavis-line-strong hover:border-mavis-fg/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          Clear filters
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-11 px-7 text-[11px] uppercase font-medium text-mavis-bg bg-mavis-gold/90 hover:bg-mavis-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          WhatsApp an advisor
        </a>
      </div>
    </div>
  );
}

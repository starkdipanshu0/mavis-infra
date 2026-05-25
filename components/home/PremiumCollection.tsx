"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import {
  PREMIUM_COLLECTION,
  type PremiumCollectionItem,
} from "@/lib/data/premium-collection";

/**
 * S3 — Premium Collection (FlowArt scroll-pin sequence).
 *
 * Replaces the earlier 4×100vh stacked panels. Each residence still gets a
 * full-bleed photograph + editorial copy, but the panels now **stack** via
 * GSAP ScrollTrigger pinning. As you scroll:
 *   1. Panel 1 pins at viewport bottom
 *   2. Panel 2 enters from below with a 30° rotation, scrubs to 0°
 *   3. Panel 2 then pins; Panel 3 rotates in; etc.
 *
 * Total scroll distance is the same as before, but the visual experience
 * feels far more cinematic and tighter — panels fold over one another like
 * chapters in an editorial spread.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §3 (FlowArt revision).
 * Underlying primitive: components/ui/story-scroll.tsx (21st.dev FlowArt).
 */

export function PremiumCollection() {
  return (
    <FlowArt aria-label="Premium Collection — four signature residences">
      {PREMIUM_COLLECTION.map((item, i) => (
        <Panel
          key={item.slug}
          item={item}
          index={i}
        />
      ))}
    </FlowArt>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

interface PanelProps {
  item: PremiumCollectionItem;
  index: number;
}

function Panel({ item, index }: PanelProps) {
  const isFirst = index === 0;
  const chapterNumber = String(index + 1).padStart(2, "0");

  return (
    <FlowSection
      aria-label={item.label}
      // Inner gets tone bg as fallback before Image paints, and the off-white
      // text color the editorial copy will inherit.
      style={{
        backgroundColor: item.tone,
        color: "#F5F1EA",
      }}
    >
      {/* Full-bleed photograph — absolute, stacks BEHIND the editorial flex
          content via negative z-index within the rotating inner. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="100vw"
          quality={85}
          priority={isFirst}
          className="object-cover"
        />
      </div>

      {/* Editorial mask — diagonal scrim from bottom-left, plus a soft puddle
          right under the headline. Keeps the photograph dominant in the
          centre-right; copy stays legible bottom-left. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: [
            "linear-gradient(to top right, rgba(13,12,10,0.88) 0%, rgba(13,12,10,0.45) 35%, transparent 65%)",
            "radial-gradient(ellipse 80% 55% at 22% 78%, rgba(13,12,10,0.5) 0%, transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ROW 1 — chapter index + (later panels) residence label.
          The inner uses flex-col justify-between, so this row goes top. */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p
          className="text-[10px] sm:text-xs uppercase text-mavis-fg/55 font-light"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          {chapterNumber} — Premium Collection
        </p>
        <p
          className="text-[10px] sm:text-xs uppercase text-mavis-gold/85 font-light"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          {item.label}
        </p>
      </div>

      {/* ROW 2 — italic headline. Aligned to bottom-left of the inner via
          a wrapping div + max-width. Pushed downward by the natural flex
          spacing (justify-between fills the gap above). */}
      <div className="max-w-3xl mt-auto pb-4 sm:pb-6">
        <h2 className="font-display italic font-light text-mavis-fg text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.04] tracking-tight">
          {item.headline}
        </h2>
      </div>

      {/* ROW 3 — meta + "View Residence" link, anchored to the bottom edge */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-mavis-fg/15 pt-5 sm:pt-6">
        <span
          className="text-[11px] uppercase text-mavis-fg-muted font-light"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          {item.meta}
        </span>

        <Link
          href={item.href}
          className="group inline-flex items-center gap-2 text-[11px] uppercase text-mavis-fg font-light hover:text-mavis-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft focus-visible:ring-offset-2 focus-visible:ring-offset-mavis-bg rounded-sm"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          View Residence
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </FlowSection>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProjectCardItem } from "@/lib/data/all-projects";

/**
 * ProjectCard — editorial card for any project surface.
 *
 * Used on the homepage Section 6 strip and (when built) on the /projects
 * listing grid. Sized as a portrait card with a 4:3 hero image at the top,
 * tracked uppercase status badges, builder + name + locality, and a small
 * BHK + price-from line.
 *
 * Hover: image scales 1.03, card border shifts from line → gold-soft, with
 * a subtle background lift. 300ms ease-out — refined, not jumpy.
 *
 * When `image === null`, falls back to a tone-gradient card with a faint
 * builder-initial watermark — same intentional placeholder pattern Section 3
 * used. Looks deliberate, not unfinished.
 */

interface ProjectCardProps {
  item: ProjectCardItem;
  /** Optional className override for sizing in different surfaces */
  className?: string;
  /** Image priority — set true for first 2-3 above-the-fold cards */
  priority?: boolean;
}

export function ProjectCard({ item, className, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${item.slug}`}
      aria-label={`Explore ${item.name} in ${item.locality}`}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-sm border border-mavis-line bg-mavis-surface",
        "transition-all duration-300 ease-out",
        "hover:border-mavis-gold-soft hover:bg-mavis-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft",
        className,
      )}
    >
      {/* Image — 4:3 aspect, scales subtly on hover */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: item.tone }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 640px) 320px, 70vw"
            quality={85}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <ToneFallback item={item} />
        )}
        {/* Bottom gradient — subtle, lets the image breathe */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(13,12,10,0.55) 0%, transparent 100%)",
          }}
        />
        {/* Status pill — bottom-left over the image */}
        <div className="absolute left-3 bottom-3 flex items-center gap-2">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 flex flex-col gap-3 px-5 py-5">
        {/* Builder + RERA — top row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase text-mavis-fg-muted font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {item.builder}
          </span>
          <span
            className="text-[10px] uppercase text-mavis-fg-faint font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            {item.reraDisplay}
          </span>
        </div>

        {/* Project name */}
        <h3 className="text-base sm:text-lg font-light text-mavis-fg leading-tight tracking-tight">
          {item.name}
        </h3>

        {/* Locality — italic Cormorant */}
        <p className="-mt-1 font-display italic text-sm text-mavis-fg-muted">
          {item.locality}
        </p>

        {/* Spacer pushes BHK + price to the bottom */}
        <div className="mt-auto pt-3 border-t border-mavis-line flex items-center justify-between gap-3">
          <span
            className="text-[10px] uppercase text-mavis-fg-muted font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            {item.bhkRange}
          </span>
          <span
            className="text-[11px] uppercase text-mavis-fg font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            {item.priceFrom}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: ProjectCardItem["status"] }) {
  const label =
    status === "pre-launch"
      ? "Pre-launch"
      : status === "ready"
        ? "Ready to Move"
        : "Under Construction";
  const tone =
    status === "pre-launch"
      ? "bg-mavis-gold/15 text-mavis-gold border-mavis-gold/30"
      : status === "ready"
        ? "bg-mavis-fg/10 text-mavis-fg border-mavis-fg/25"
        : "bg-mavis-bg/40 text-mavis-fg-muted border-mavis-fg/15";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-sm border backdrop-blur-md",
        "text-[9px] uppercase font-light",
        tone,
      )}
      style={{ letterSpacing: "var(--tracking-display-wide)" }}
    >
      {label}
    </span>
  );
}

/**
 * Tone-gradient fallback when no image — radial tint + builder initial
 * watermark + scribbled grain. Looks deliberate.
 */
function ToneFallback({ item }: { item: ProjectCardItem }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse 90% 90% at center 40%, ${item.tone} 0%, ${item.tone}cc 60%, #050505 100%)`,
      }}
      aria-hidden="true"
    >
      <span
        className="font-display italic text-mavis-fg/[0.06] text-[8rem] leading-none select-none"
        style={{ letterSpacing: "0.02em" }}
      >
        {item.builder.charAt(0)}
      </span>
    </div>
  );
}

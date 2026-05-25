"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  LOCALITIES,
  LOCALITY_ZONE_COUNT,
  TOTAL_PROJECTS_IN_LOCALITIES,
  type Locality,
} from "@/lib/data/localities";

/**
 * S7 — Explore Bangalore (Browse by Locality).
 *
 * The India-specific moment Binghatti doesn't have. Bangalore buyers map
 * their search to localities first — "something near my Whitefield office",
 * "anything in Hennur under 1.5". This section lets them enter the inventory
 * by area instead of by builder, so the next page they land on is already
 * narrowed to what they care about.
 *
 * Premium redesign:
 *   • Coordinate-style eyebrow ("S/07 · GEOGRAPHY · 12°58′N 77°35′E") that
 *     reads like a luxury hotel address plaque.
 *   • Two-line dramatic heading: "EVERY ADDRESS · TELLS A STORY".
 *   • Bento grid on desktop — Devanahalli hero (2×2), South BLR wide (2×1),
 *     six standard tiles. Mobile collapses to a single column; sm uses
 *     a uniform 2-col grid so reading order stays intact.
 *   • Cards: editorial number plate (01–08, italic Cormorant), zone tag,
 *     signature-project eyebrow, locality name (large two-weight),
 *     italic tagline, count + price footer, gold corner accents that
 *     extend on hover, animated underline beneath the name.
 *   • Subtle topographic backdrop — radial spotlight + faint horizontal
 *     grain lines, no video needed.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §7.
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

const SIZE_CLASSES: Record<Locality["size"], string> = {
  hero: "lg:col-span-2 lg:row-span-2 lg:aspect-auto aspect-4/5",
  wide: "lg:col-span-2 lg:row-span-1 lg:aspect-16/9 aspect-4/5",
  standard: "lg:col-span-1 lg:row-span-1 aspect-4/5",
};

export function BrowseByLocality() {
  return (
    <section
      aria-label="Browse Bangalore by locality"
      className="relative w-full overflow-hidden bg-mavis-bg py-24 sm:py-32"
    >
      {/* Topographic backdrop — radial spotlight + faint horizontal contour
          lines. Pure CSS, GPU-cheap, sits under the content with low opacity. */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,169,110,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(245,241,234,0.6) 0px, rgba(245,241,234,0.6) 1px, transparent 1px, transparent 90px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-350 px-6 sm:px-10 lg:px-16">
        {/* Coordinate eyebrow — luxury hotel plaque energy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="flex items-center justify-center gap-4"
        >
          <span
            aria-hidden="true"
            className="h-px w-10 bg-mavis-gold/40"
          />
          <span
            className="text-[10px] uppercase text-mavis-gold font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            S/07 · Geography · 12°58′N 77°35′E
          </span>
          <span
            aria-hidden="true"
            className="h-px w-10 bg-mavis-gold/40"
          />
        </motion.div>

        {/* Two-line headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.0, delay: 0.15, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-6 text-center"
        >
          <SectionHeading bold="EVERY ADDRESS" thin="TELLS A STORY" size="md" />
          <p className="mt-7 font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed max-w-xl mx-auto">
            Find your home by the corner of the city you already love.
          </p>
        </motion.div>

        {/* Stat line — total inventory across all localities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: 0.8, delay: 0.35, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-10 flex items-center justify-center gap-6 sm:gap-10 text-mavis-fg-faint"
        >
          <Stat label="Localities" value={String(LOCALITIES.length).padStart(2, "0")} />
          <span aria-hidden="true" className="h-6 w-px bg-mavis-line-strong" />
          <Stat label="Projects" value={String(TOTAL_PROJECTS_IN_LOCALITIES).padStart(2, "0")} />
          <span aria-hidden="true" className="h-6 w-px bg-mavis-line-strong" />
          <Stat label="Zones" value={String(LOCALITY_ZONE_COUNT).padStart(2, "0")} />
        </motion.div>

        {/* Bento grid */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.07,
                delayChildren: 0.45,
              },
            },
          }}
          className={cn(
            "mt-16 sm:mt-20 grid gap-4 sm:gap-5",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            "lg:auto-rows-fr",
          )}
        >
          {LOCALITIES.map((locality, i) => (
            <motion.li
              key={locality.slug}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.75, ease: EASE_QUINT_OUT },
                },
              }}
              className={cn("list-none", SIZE_CLASSES[locality.size])}
            >
              <LocalityCard
                locality={locality}
                index={i + 1}
                priority={i < 3}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-2xl sm:text-3xl text-mavis-fg font-light leading-none">
        {value}
      </span>
      <span
        className="text-[9px] uppercase text-mavis-fg-faint font-light"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        {label}
      </span>
    </div>
  );
}

interface LocalityCardProps {
  locality: Locality;
  /** Sequence number rendered as the editorial plate (01–08) */
  index: number;
  priority?: boolean;
}

function LocalityCard({ locality, index, priority = false }: LocalityCardProps) {
  const isHero = locality.size === "hero";
  return (
    <Link
      href={`/projects?locality=${locality.slug}`}
      aria-label={`Browse ${locality.projectCount} projects in ${locality.name}`}
      className={cn(
        "group relative block h-full w-full overflow-hidden rounded-sm",
        "border border-mavis-line bg-mavis-surface",
        "transition-[border-color,transform,box-shadow] duration-500 ease-out",
        "hover:border-mavis-gold-soft hover:-translate-y-0.5",
        "hover:shadow-[0_24px_60px_-20px_rgba(200,169,110,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft",
      )}
    >
      {/* Image layer */}
      <div className="absolute inset-0" style={{ backgroundColor: locality.tone }}>
        {locality.image ? (
          <Image
            src={locality.image}
            alt={locality.imageAlt}
            fill
            sizes={
              isHero
                ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                : locality.size === "wide"
                  ? "(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                  : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            }
            quality={82}
            priority={priority}
            className={cn(
              "object-cover",
              "transition-[transform,filter] duration-1100 ease-out",
              "scale-[1.02] brightness-[0.72] saturate-[0.95]",
              "group-hover:scale-[1.08] group-hover:brightness-[0.95] group-hover:saturate-100",
            )}
          />
        ) : (
          <ToneFallback locality={locality} />
        )}

        {/* Cinematic floor gradient + subtle vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.0) 22%, rgba(8,8,8,0.45) 60%, rgba(8,8,8,0.94) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 130% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* Gold corner accents — extend on hover, like a luxury logo mark */}
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      {/* Number plate — top-left, italic Cormorant */}
      <div className="absolute top-5 left-5 flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "font-display italic font-light text-mavis-gold",
            isHero ? "text-3xl" : "text-2xl",
          )}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-8 bg-mavis-gold/50 self-center mt-1"
        />
      </div>

      {/* Zone tag — top-right */}
      <span
        className="absolute top-5 right-5 text-[9px] uppercase text-mavis-fg/85 font-light"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        {locality.zone} BLR
      </span>

      {/* Bottom content stack */}
      <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 pb-6 pt-16">
        {/* Signature project eyebrow */}
        <p
          className="text-[10px] uppercase font-light text-mavis-gold/90"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          Flagship · {locality.signature}
        </p>

        {/* Locality name + animated underline */}
        <h3
          className={cn(
            "mt-3 uppercase text-mavis-fg leading-[0.95] font-bold",
            isHero
              ? "text-[clamp(2rem,3.6vw,2.8rem)]"
              : locality.size === "wide"
                ? "text-[clamp(1.7rem,3vw,2.4rem)]"
                : "text-[clamp(1.35rem,2.2vw,1.75rem)]",
          )}
          style={{ letterSpacing: "var(--tracking-display)" }}
        >
          {locality.name}
        </h3>
        <span
          aria-hidden="true"
          className={cn(
            "mt-2 block h-px bg-mavis-gold origin-left",
            "transition-transform duration-700 ease-out",
            "scale-x-[0.15] group-hover:scale-x-100",
            isHero ? "w-24" : "w-16",
          )}
        />

        {/* Tagline — italic Cormorant, only on hero + wide cards to avoid
            cramming standard tiles. Standard cards still get count + price. */}
        {(isHero || locality.size === "wide") && (
          <p
            className={cn(
              "mt-4 font-display italic font-light text-mavis-fg-muted leading-relaxed",
              isHero
                ? "text-[clamp(0.95rem,1.4vw,1.1rem)] max-w-md"
                : "text-[0.9rem] max-w-md",
            )}
          >
            {locality.tagline}
          </p>
        )}

        {/* Count + price footer */}
        <div
          className={cn(
            "mt-5 flex items-end justify-between gap-4 pt-4",
            "border-t border-mavis-line",
          )}
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-[9px] uppercase text-mavis-fg-faint font-light"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Inventory
            </span>
            <span
              className="text-[11px] uppercase text-mavis-fg font-light"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              {String(locality.projectCount).padStart(2, "0")}{" "}
              {locality.projectCount === 1 ? "Project" : "Projects"}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-[9px] uppercase text-mavis-fg-faint font-light"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Starting
            </span>
            <span
              className="text-[11px] uppercase text-mavis-fg font-light"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              {locality.priceFrom}
            </span>
          </div>
        </div>

        {/* Hover-revealed CTA — slides up + fades in */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-4 flex items-center gap-2 overflow-hidden",
            "max-h-0 opacity-0 translate-y-2",
            "transition-[max-height,opacity,transform] duration-500 ease-out",
            "group-hover:max-h-6 group-hover:opacity-100 group-hover:translate-y-0",
          )}
        >
          <span
            className="text-[10px] uppercase text-mavis-gold font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            Explore {locality.name}
          </span>
          <ArrowUpRight
            className="h-3.5 w-3.5 text-mavis-gold"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * Gold corner accent — tiny L-shaped mark in the corner of each card,
 * extends from 12px → 22px on hover. Reads as a luxury logo mark.
 */
function CornerAccent({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const baseEdge = "absolute bg-mavis-gold/55 transition-all duration-500 ease-out";
  const groupHover = "group-hover:bg-mavis-gold";

  if (position === "tl") {
    return (
      <>
        <span
          aria-hidden="true"
          className={cn(baseEdge, groupHover, "top-3 left-3 h-px w-3 group-hover:w-6")}
        />
        <span
          aria-hidden="true"
          className={cn(baseEdge, groupHover, "top-3 left-3 w-px h-3 group-hover:h-6")}
        />
      </>
    );
  }
  if (position === "br") {
    return (
      <>
        <span
          aria-hidden="true"
          className={cn(baseEdge, groupHover, "bottom-3 right-3 h-px w-3 group-hover:w-6")}
        />
        <span
          aria-hidden="true"
          className={cn(baseEdge, groupHover, "bottom-3 right-3 w-px h-3 group-hover:h-6")}
        />
      </>
    );
  }
  return null;
}

/**
 * Tone-gradient fallback when no aerial image is loaded yet.
 * Mirrors the ProjectCard fallback pattern so the page never shows a
 * blank rectangle while builder/Pexels imagery is still being sourced.
 */
function ToneFallback({ locality }: { locality: Locality }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-end justify-end p-6"
      style={{
        background: `radial-gradient(ellipse 110% 90% at 30% 20%, ${locality.tone} 0%, ${locality.tone}cc 55%, #060606 100%)`,
      }}
    >
      <span
        className="font-display italic text-mavis-fg/[0.07] text-[9rem] leading-none select-none"
        style={{ letterSpacing: "0.01em" }}
      >
        {locality.name.charAt(0)}
      </span>
    </div>
  );
}

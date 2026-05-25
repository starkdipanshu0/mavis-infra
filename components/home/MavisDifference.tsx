"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Counter } from "@/components/shared/Counter";
import { ProgressiveBlur } from "@/components/shared/ProgressiveBlur";
import {
  MAVIS_STATS,
  MAVIS_PILLARS,
} from "@/lib/data/mavis-difference";

/**
 * S4 — The Mavis Difference.
 *
 * Two-part editorial scroll (200vh total). The most important emotional
 * beat of the homepage.
 *
 *   Part 1 — STATEMENT (100vh)
 *     A single Higgsfield image (close-up of a bronze door handle, the
 *     "after the keys are handed over" symbol). Cormorant italic tagline
 *     overlay. One thought, all the gravity.
 *
 *   Part 2 — PROOF (100vh)
 *     Quiet ink background. Three animated counters reveal the trust numbers
 *     (6 / 200+ / 37 — "37 came back" highlighted in gold). A thin gold
 *     divider. Three "we escalate / we document / we show up" pillars in
 *     italic Cormorant.
 *
 * Motion intent: deliberately calm. No carousels, no drag, no auto-cycling.
 * The numbers animate once on scroll-in (Counter primitive does the work);
 * everything else fades in once via `whileInView`. Premium calm.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §4.
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

export function MavisDifference() {
  return (
    <section
      aria-label="The Mavis Difference"
      className="relative w-full bg-mavis-bg"
    >
      <StatementPart />
      <ProofPart />
    </section>
  );
}

/* ─── PART 1 ────────────────────────────────────────────────────────────── */

function StatementPart() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <article className="relative h-screen w-full overflow-hidden isolate">
      {/* Atmospheric image — bronze door handle close-up */}
      <div className="absolute inset-0">
        <Image
          src="/images/difference/door-handle.jpg"
          alt="A bronze door handle — the moment after the keys change hands."
          fill
          sizes="100vw"
          quality={85}
          priority={false}
          className="object-cover"
        />
      </div>

      {/* Dark wash — pulls focus to the headline. Heavier on the right where
          the text sits, lighter on the left where the door handle lives. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(to left, rgba(13,12,10,0.86) 0%, rgba(13,12,10,0.45) 45%, transparent 75%)",
            "radial-gradient(ellipse 60% 60% at 75% 50%, rgba(13,12,10,0.5) 0%, transparent 70%)",
          ].join(", "),
        }}
      />
      {/* Soft top + bottom blur so the section edges dissolve into adjacent
          sections rather than meeting them with a hard line. */}
      <ProgressiveBlur
        direction="top"
        blurLayers={5}
        blurIntensity={0.35}
        className="absolute inset-x-0 top-0 h-[18vh] z-[5]"
      />
      <ProgressiveBlur
        direction="bottom"
        blurLayers={5}
        blurIntensity={0.35}
        className="absolute inset-x-0 bottom-0 h-[22vh] z-[5]"
      />

      {/* Editorial copy — right-aligned over the dark wash */}
      <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-12 lg:px-20">
        <motion.div
          className="ml-auto max-w-2xl text-right"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.1, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
        >
          <p
            className="text-[10px] sm:text-xs uppercase text-mavis-gold/85 font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            The Mavis Difference
          </p>

          <h2 className="mt-6 font-display italic font-light text-mavis-fg text-[clamp(2rem,5vw,4rem)] leading-[1.06] tracking-tight">
            The real work begins
            <br className="hidden sm:block" /> after we hand
            <br className="hidden sm:block" /> you the keys.
          </h2>

          <p
            className="mt-8 text-[11px] sm:text-xs uppercase text-mavis-fg-muted font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            Sale is not the end. It&rsquo;s the beginning of our service.
          </p>
        </motion.div>
      </div>
    </article>
  );
}

/* ─── PART 2 ────────────────────────────────────────────────────────────── */

function ProofPart() {
  const reducedMotion = useReducedMotion() ?? false;

  // Shared reveal config — quietly fades each block in once when scrolled to
  const revealProps = {
    initial: reducedMotion ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE_QUINT_OUT },
    },
    viewport: { once: true, margin: "-15%" },
  };

  return (
    <article className="relative h-screen w-full overflow-hidden bg-mavis-bg flex flex-col justify-center">
      {/* Subtle radial spotlight — gives the dark page a centre */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at center, rgba(200,169,110,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* STATS ROW */}
        <motion.div
          {...revealProps}
          className="grid grid-cols-3 gap-6 sm:gap-12"
        >
          {MAVIS_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <span
                className={cn(
                  "font-display italic font-light leading-none text-[clamp(2.75rem,7vw,5.5rem)]",
                  stat.emphasize ? "text-mavis-gold" : "text-mavis-fg",
                )}
              >
                <Counter
                  end={stat.end}
                  duration={stat.duration}
                  suffix={stat.suffix ?? ""}
                />
              </span>
              <span
                className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] uppercase text-mavis-fg-muted font-light"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Thin gold divider — separates the numbers from the pillars */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scaleX: 0.4 }}
          whileInView={{
            opacity: 1,
            scaleX: 1,
            transition: {
              duration: 1.2,
              delay: 0.4,
              ease: EASE_QUINT_OUT,
            },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="my-14 sm:my-20 h-px w-full origin-center bg-gradient-to-r from-transparent via-mavis-gold/40 to-transparent"
        />

        {/* PILLAR ROW */}
        <motion.div
          {...revealProps}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE_QUINT_OUT }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12"
        >
          {MAVIS_PILLARS.map((pillar, i) => (
            <div
              key={pillar.headline}
              className={cn(
                "flex flex-col items-center sm:items-start text-center sm:text-left",
                // Subtle vertical divider between columns on desktop only
                i > 0 &&
                  "sm:border-l sm:border-mavis-line sm:pl-12",
              )}
            >
              <h3 className="font-display italic font-light text-mavis-fg text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
                {pillar.headline}
              </h3>
              <p className="mt-4 text-sm sm:text-[15px] text-mavis-fg-muted leading-relaxed max-w-xs">
                {pillar.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </article>
  );
}

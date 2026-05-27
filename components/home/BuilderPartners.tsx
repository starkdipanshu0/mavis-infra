"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  BUILDER_PARTNERS,
  ADDITIONAL_PARTNER_COUNT,
} from "@/lib/data/builder-partners";

// Three.js backdrop is decorative and heavy (~150 KB). Load it client-side
// only, and never on mobile, reduced-motion, or Save-Data — those fall back
// to the static radial scrim below.
const GenerativeArtScene = dynamic(
  () =>
    import("@/components/ui/anomalous-matter-hero").then(
      (m) => m.GenerativeArtScene,
    ),
  { ssr: false },
);

/**
 * S5 — Builder Partners.
 *
 * Quiet editorial trust-strip. After the cinematic noise of Section 2's
 * pinned scroll and Section 3's FlowArt stack and Section 4's emotional
 * proof beat, the page needs a moment to breathe. This is that moment.
 *
 * Layout (Logo Cloud pattern from 21st.dev, adapted):
 *   • SectionHeading "BUILDER · PARTNERS"
 *   • Italic Cormorant subtitle
 *   • Thin gold divider
 *   • Flex-wrap grid of 10 builder wordmarks — Inter, tracked uppercase
 *   • Tiny footer note: "+ 11 more A-grade developers"
 *
 * No marquee. No carousel. No card backgrounds. Pure typography on warm ink.
 * Heading + divider + wordmarks + footer each fade in via `whileInView` with
 * a stagger across the wordmarks. Once-only — premium calm.
 *
 * Approx footprint: ~80vh (py-32 + intrinsic content). The whole page has
 * been heavy on scroll-pinned moments; this section is deliberately short
 * so the cadence doesn't fatigue the reader.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §5 (post-reset).
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

export function BuilderPartners() {
  // Only render the WebGL backdrop on capable, motion-friendly clients.
  // Everyone else gets the static radial scrim below — no three.js download.
  const [showWebGL, setShowWebGL] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    const update = () =>
      setShowWebGL(desktop.matches && !reduce.matches && !saveData);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return (
    <section
      aria-label="Builder Partners"
      className="relative w-full bg-mavis-bg py-28 sm:py-36"
    >
      {/* Generative wireframe icosahedron backdrop (Three.js) — desktop +
          motion-on only; dynamically imported so it never ships to mobile. */}
      {showWebGL && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.22]"
        >
          <GenerativeArtScene
            color="#c8a96e"
            displacement={0.12}
            mouseTracking
          />
        </div>
      )}
      {/* Soft floor + ceiling scrim — keeps the wireframe from touching
          adjacent sections' edges with hard lines. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at center, transparent 0%, rgba(13,12,10,0.45) 65%, rgba(13,12,10,0.92) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Heading + italic subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.0, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="text-center"
        >
          <SectionHeading bold="BUILDER" thin="PARTNERS" size="md" />
          <p className="mt-8 font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed max-w-md mx-auto">
            Channel partners with every A-grade developer in Bangalore.
          </p>
        </motion.div>

        {/* Thin gold divider — animates draw on scroll-in */}
        <motion.div
          initial={{ scaleX: 0.3, opacity: 0 }}
          whileInView={{
            scaleX: 1,
            opacity: 1,
            transition: {
              duration: 1.2,
              delay: 0.3,
              ease: EASE_QUINT_OUT,
            },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="my-14 sm:my-16 h-px w-full origin-center bg-gradient-to-r from-transparent via-mavis-gold/40 to-transparent"
        />

        {/* Wordmark grid — flex-wrap so it reflows responsively */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.45,
              },
            },
          }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-10 sm:gap-x-14 sm:gap-y-12"
        >
          {BUILDER_PARTNERS.map((builder) => (
            <motion.li
              key={builder.slug}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: EASE_QUINT_OUT },
                },
              }}
              className="list-none"
            >
              <span
                className="block text-[clamp(1.05rem,1.7vw,1.45rem)] uppercase text-mavis-fg-muted font-light hover:text-mavis-fg transition-colors duration-300 cursor-default select-none"
                style={{ letterSpacing: "var(--tracking-display)" }}
              >
                {builder.name}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Footer note — total partner count signal */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 1.0,
              delay: 1.2,
              ease: EASE_QUINT_OUT,
            },
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-20 sm:mt-24 text-center text-[10px] uppercase text-mavis-fg-faint font-light"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          + {ADDITIONAL_PARTNER_COUNT} more A-grade developers
        </motion.p>
      </div>
    </section>
  );
}

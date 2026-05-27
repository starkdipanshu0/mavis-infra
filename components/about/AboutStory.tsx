"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { ProgressiveBlur } from "@/components/shared/ProgressiveBlur";
import { Counter } from "@/components/shared/Counter";
import { STORY_CHAPTERS, PROOF } from "@/lib/data/about";
import { MAVIS_PILLARS } from "@/lib/data/mavis-difference";

/**
 * The narrative spine — a scroll-pinned chapter stack (FlowArt). Each chapter
 * pins at the bottom of the viewport while the next folds in over it. Reading
 * top-to-bottom: the problem → why we exist → the proof (37 came back) → how
 * we stay. Reduced-motion collapses this to plain stacked full-height
 * sections (handled inside FlowArt).
 *
 * Each chapter sits over a heavily darkened full-bleed photograph (the
 * MavisDifference scrim recipe) so the centered editorial type reads against
 * cinematic imagery, not flat black. The scrim is weighted to the LEFT where
 * the text lives; the right keeps more of the image. ProgressiveBlur dissolves
 * the chapter seams.
 */

// Scrim weighted left (text) → lighter right (image shows through) + a floor.
const SCRIM = [
  "linear-gradient(to right, rgba(13,12,10,0.94) 0%, rgba(13,12,10,0.78) 45%, rgba(13,12,10,0.5) 100%)",
  "linear-gradient(to top, rgba(13,12,10,0.55) 0%, transparent 38%)",
].join(", ");

function Chapter({
  index,
  label,
  image,
  watermark = true,
  children,
}: {
  index: string;
  label: string;
  image: string;
  watermark?: boolean;
  children: ReactNode;
}) {
  return (
    <FlowSection aria-label={label} className="border-t border-mavis-line">
      {/* Darkened cinematic backdrop (rotates/folds with the chapter) */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          className="object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0" style={{ background: SCRIM }} />
        <ProgressiveBlur
          direction="top"
          blurLayers={5}
          blurIntensity={0.3}
          className="absolute inset-x-0 top-0 h-[16vh]"
        />
        <ProgressiveBlur
          direction="bottom"
          blurLayers={5}
          blurIntensity={0.3}
          className="absolute inset-x-0 bottom-0 h-[18vh]"
        />
      </div>

      {/* Centered editorial content */}
      <div className="relative z-10 my-auto w-full">
        {watermark && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-14vh] right-0 select-none font-display font-light leading-none text-mavis-fg/5 text-[clamp(9rem,30vw,26rem)]"
          >
            {index}
          </span>
        )}
        <div className="relative">
          <div className="flex items-center gap-4">
            <span
              className="font-display text-mavis-gold/80 text-lg tabular-nums"
              aria-hidden="true"
            >
              {index}
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-mavis-line-strong" />
            <span
              className="text-[10px] uppercase font-light text-mavis-fg-faint"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              {label}
            </span>
          </div>
          <div className="mt-9">{children}</div>
        </div>
      </div>
    </FlowSection>
  );
}

export function AboutStory() {
  const [problem, origin] = STORY_CHAPTERS;

  return (
    <FlowArt aria-label="The Mavis story">
      {/* Chapter 1 — the problem */}
      <Chapter index="01" label={problem.eyebrow} image="/images/about/chapter-problem.jpg">
        <h2 className="max-w-4xl font-display font-light leading-[1.05] tracking-tight text-mavis-fg text-[clamp(2.25rem,6vw,5rem)]">
          {problem.heading}
        </h2>
        <p className="mt-7 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-mavis-fg-muted">
          {problem.body}
        </p>
      </Chapter>

      {/* Chapter 2 — the origin */}
      <Chapter index="02" label={origin.eyebrow} image="/images/about/chapter-origin.jpg">
        <h2 className="max-w-4xl font-display font-light leading-[1.05] tracking-tight text-mavis-fg text-[clamp(2.25rem,6vw,5rem)]">
          {origin.heading}
        </h2>
        <p className="mt-7 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-mavis-fg-muted">
          {origin.body}
        </p>
      </Chapter>

      {/* Chapter 3 — the proof (emotional peak). Giant 37 carries the frame. */}
      <Chapter
        index="03"
        label={PROOF.eyebrow}
        image="/images/about/chapter-proof.jpg"
        watermark={false}
      >
        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <Counter
            end={PROOF.count}
            duration={2}
            className="font-display font-light leading-[0.85] text-mavis-gold text-[clamp(6rem,22vw,16rem)]"
          />
          <span className="font-display italic font-light text-mavis-fg text-[clamp(1.5rem,4vw,3rem)]">
            of {PROOF.outOf} {PROOF.lead}
          </span>
        </p>
        <p className="mt-8 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-mavis-fg-muted">
          {PROOF.body}
        </p>
      </Chapter>

      {/* Chapter 4 — how we stay (pillars) */}
      <Chapter
        index="04"
        label="How we stay"
        image="/images/about/chapter-stay.jpg"
        watermark={false}
      >
        <h2 className="font-display font-light leading-[1.05] tracking-tight text-mavis-fg text-[clamp(2.25rem,6vw,5rem)]">
          Three ways we show up.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {MAVIS_PILLARS.map((pillar) => (
            <div
              key={pillar.headline}
              className="border-t border-mavis-line-strong pt-5"
            >
              <h3 className="font-display italic font-light text-mavis-fg text-2xl sm:text-3xl">
                {pillar.headline}
              </h3>
              <p className="mt-3 text-sm sm:text-base font-light leading-relaxed text-mavis-fg-muted">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Chapter>
    </FlowArt>
  );
}

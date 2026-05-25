"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Progressive blur — N stacked layers, each masked to a different vertical
 * band and given a slightly stronger `backdrop-filter: blur(...)`. The mask
 * gradients overlap so the blur builds up smoothly from clear to heavy.
 *
 * Use as a soft edge fade where a single hard blur boundary would look
 * digital — hero edges, marquee fades, the top/bottom of a full-bleed
 * carousel, etc. Sits as an overlay layer; needs no content of its own.
 *
 *   <ProgressiveBlur direction="bottom" className="absolute inset-x-0 bottom-0 h-48" />
 *
 * Adapted from a 21st.dev primitive. Pure CSS — no JS work per frame.
 */

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const;

interface ProgressiveBlurProps extends HTMLMotionProps<"div"> {
  /** Which edge fades into clear */
  direction?: keyof typeof GRADIENT_ANGLES;
  /** Number of stacked blur layers. Higher = smoother, more GPU. Default 8. */
  blurLayers?: number;
  /** Blur step per layer in px (layer N has blur = N * intensity). Default 0.3. */
  blurIntensity?: number;
  className?: string;
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  blurIntensity = 0.3,
  className,
  ...rest
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);

  return (
    <div
      aria-hidden="true"
      className={cn("relative pointer-events-none", className)}
    >
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const stops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, i) =>
            `rgba(0,0,0,${i === 1 || i === 2 ? 1 : 0}) ${pos * 100}%`,
        );
        const gradient = `linear-gradient(${angle}deg, ${stops.join(", ")})`;

        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...rest}
          />
        );
      })}
    </div>
  );
}

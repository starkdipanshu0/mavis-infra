"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Counter — animates from 0 to `end` when the element scrolls into view.
 * Uses motion's `animate()` with onUpdate so the rendered text re-flows
 * cleanly (no layout shift) and the easing is precisely controlled.
 *
 * Triggers **once** (premium sites don't re-animate when you scroll back).
 * Honors `prefers-reduced-motion` — shows the final value immediately.
 *
 *   <Counter end={37} duration={2} suffix="" />
 *   <Counter end={200} duration={2.4} suffix="+" />
 */
interface CounterProps {
  /** Target value to count up to */
  end: number;
  /** Seconds for the full count. Default 2. */
  duration?: number;
  /** Prefix string, e.g. "₹" */
  prefix?: string;
  /** Suffix string, e.g. "+" or "%" */
  suffix?: string;
  /** Format with thousands separator? Default false. */
  thousandsSeparator?: boolean;
  className?: string;
}

export function Counter({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  thousandsSeparator = false,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reducedMotion = useReducedMotion() ?? false;
  const [value, setValue] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return controls.stop;
  }, [inView, end, duration, reducedMotion]);

  const formatted = thousandsSeparator
    ? value.toLocaleString("en-IN")
    : value.toString();

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-label={`${prefix}${end}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

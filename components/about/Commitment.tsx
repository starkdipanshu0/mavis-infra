"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMMITMENTS, COMMITMENT_NOTE } from "@/lib/data/about";

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Our Commitment — honesty as a feature. Two columns: what Mavis does, and
 * what it deliberately won't. The "won't" column is the trust signal — a firm
 * that names its limits reads as one that won't oversell.
 */
export function Commitment() {
  const reduce = useReducedMotion() ?? false;

  const reveal = (delay: number) =>
    reduce
      ? false
      : ({
          initial: { opacity: 0, y: 18 },
          whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay, ease: EASE_QUINT_OUT },
          },
          viewport: { once: true, margin: "-15%" },
        } as const);

  return (
    <section className="border-t border-mavis-line py-16 sm:py-24">
      <Container size="default">
        <SectionHeading bold="OUR" thin="COMMITMENT" size="md" align="left" />

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {/* We do */}
          <motion.div {...(reveal(0) || {})}>
            <p
              className="text-[11px] uppercase font-light text-mavis-gold"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              We do
            </p>
            <ul className="mt-6 space-y-4">
              {COMMITMENTS.does.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-mavis-gold"
                    strokeWidth={1.75}
                  />
                  <span className="text-base font-light text-mavis-fg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* We don't */}
          <motion.div {...(reveal(0.12) || {})}>
            <p
              className="text-[11px] uppercase font-light text-mavis-fg-faint"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              We don&rsquo;t
            </p>
            <ul className="mt-6 space-y-4">
              {COMMITMENTS.doesnt.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-mavis-fg-faint"
                    strokeWidth={1.75}
                  />
                  <span className="text-base font-light text-mavis-fg-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="mt-14 max-w-2xl border-t border-mavis-line pt-7 font-display italic font-light text-mavis-fg-muted text-lg leading-relaxed">
          {COMMITMENT_NOTE}
        </p>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FOUNDERS } from "@/lib/data/about";

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Founders — 4:5 portrait cards. Real names + roles; the portrait itself is a
 * tone-gradient placeholder with an initials watermark (same deliberate
 * fallback the project cards use) until real photography is supplied.
 */
export function FoundersGrid() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="border-t border-mavis-line py-16 sm:py-24">
      <Container size="default">
        <SectionHeading bold="THE" thin="FOUNDERS" size="md" align="left" />
        <p className="mt-6 max-w-xl font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.8vw,1.35rem)] leading-relaxed">
          The people who pick up the call — before, during, and long after the
          sale.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:max-w-2xl">
          {FOUNDERS.map((f, i) => (
            <motion.figure
              key={f.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: EASE_QUINT_OUT,
                },
              }}
              viewport={{ once: true, margin: "-15%" }}
              className="group"
            >
              <div
                className="relative aspect-4/5 overflow-hidden rounded-sm border border-mavis-line"
                style={{
                  background: `radial-gradient(ellipse 90% 90% at center 35%, ${f.tone} 0%, ${f.tone}cc 55%, #050505 100%)`,
                }}
              >
                {f.image ? (
                  <Image
                    src={f.image}
                    alt={`${f.name} — ${f.role}`}
                    fill
                    sizes="(min-width: 640px) 320px, 90vw"
                    className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center font-display italic text-mavis-fg/[0.07] text-[7rem] leading-none select-none"
                  >
                    {f.initials}
                  </span>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(13,12,10,0.6) 0%, transparent 100%)",
                  }}
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-base font-light text-mavis-fg">{f.name}</p>
                <p className="mt-1 text-[11px] uppercase font-light text-mavis-fg-faint" style={{ letterSpacing: "var(--tracking-display-wide)" }}>
                  {f.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/shared/Container";

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * About hero — type only. No image, no video: a single editorial promise set
 * in vast negative space. "We stay / after the sale." reveals line by line.
 * Honors reduced-motion (renders static).
 */
export function AboutHero() {
  const reduce = useReducedMotion() ?? false;

  const line = (delay: number) =>
    reduce
      ? false
      : ({
          initial: { opacity: 0, y: 28 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.1, delay, ease: EASE_QUINT_OUT },
          },
        } as const);

  return (
    <section className="relative flex min-h-[68svh] items-center overflow-hidden pt-28 sm:pt-36 pb-12">
      {/* Faint architectural backdrop — heavily scrimmed so the headline
          stays the focus; reads as atmosphere, not a photograph. */}
      <Image
        src="/images/about/about-hero.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={82}
        priority
        className="object-cover opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,12,10,0.94) 0%, rgba(13,12,10,0.8) 50%, rgba(13,12,10,0.6) 100%)",
        }}
      />
      {/* Atmosphere — faint gold glow + film grain so the type sits in a
          warm-lit space rather than a flat void. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 45%, rgba(200,169,110,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="film-grain absolute inset-0 pointer-events-none"
      />
      <Container size="wide" className="relative">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[10px] uppercase font-light text-mavis-fg-faint"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          <Link href="/" className="hover:text-mavis-fg transition-colors">
            Mavis
          </Link>
          <span className="mx-2 text-mavis-fg/30">/</span>
          <span className="text-mavis-fg-muted">About</span>
        </nav>

        {/* Eyebrow + gold hairline */}
        <motion.div
          {...(line(0.1) || {})}
          className="mt-10 flex items-center gap-3"
        >
          <span aria-hidden="true" className="h-px w-10 bg-mavis-gold/60" />
          <span
            className="text-[10px] uppercase font-light text-mavis-gold"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Est. 2019
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="mt-7 text-mavis-fg">
          <motion.span
            {...(line(0.25) || {})}
            className="block font-display font-light leading-[0.95] tracking-tight text-[clamp(3.5rem,13vw,11rem)]"
          >
            We stay
          </motion.span>
          <motion.span
            {...(line(0.55) || {})}
            className="mt-1 block font-display italic font-light text-mavis-fg-muted leading-[1.05] text-[clamp(1.75rem,6vw,4.5rem)]"
          >
            after the sale.
          </motion.span>
        </h1>

        {/* Sub-line */}
        <motion.p
          {...(line(0.95) || {})}
          className="mt-9 max-w-xl text-sm sm:text-base font-light leading-relaxed text-mavis-fg-muted"
        >
          Most brokers disappear the moment the booking amount is paid. We built
          Mavis because we believe that&rsquo;s when the real work begins.
        </motion.p>
      </Container>
    </section>
  );
}

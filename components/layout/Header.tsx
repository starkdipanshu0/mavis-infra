"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

/**
 * Site header.
 *
 * Behaviour:
 *   • Transparent over the hero, solid + blurred + bordered once scrolled past 40 px
 *   • Hides itself when scrolling DOWN past 100 px (`y: -100%`)
 *   • Reveals itself when scrolling UP — buttery snap via spring-ish quint-out
 *   • Never hides while MobileNav is open (the X to close lives in this header)
 *   • Sits at z-[65] so it stays ABOVE the MobileNav overlay (z-60). Same
 *     button toggles the menu open/close, animating between hamburger lines
 *     and X.
 *
 * Visual chrome:
 *   • 1px gold (#C8A96E) scroll-progress bar at the very top, scaled 0 → 1 by
 *     `scrollYProgress`
 *   • Logo left, animated toggle right. No search icon (deferred until search
 *     actually exists — premium restraint means we don't ship inert chrome).
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;
const SCROLL_DELTA = 6; // jitter threshold — ignore tiny scroll movements

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const lastScrollRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollRef.current;
    setScrolled(latest > 40);

    // Never hide while menu is open — the close button lives here
    if (mobileNavOpen) {
      setHidden(false);
      lastScrollRef.current = latest;
      return;
    }

    // Always show near the top
    if (latest < 100) {
      setHidden(false);
    } else if (latest > prev + SCROLL_DELTA) {
      // Scrolling down with intent
      setHidden(true);
    } else if (latest < prev - SCROLL_DELTA) {
      // Scrolling up with intent
      setHidden(false);
    }

    lastScrollRef.current = latest;
  });

  const toggleMenu = () => setMobileNavOpen((open) => !open);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_QUINT_OUT }}
        className={cn(
          "fixed top-0 inset-x-0 z-[65] transition-colors duration-300",
          scrolled || mobileNavOpen
            ? "bg-mavis-bg/82 backdrop-blur-xl border-b border-mavis-line"
            : "bg-transparent border-b border-transparent",
        )}
      >
        {/* Scroll progress bar — thin gold filament along the very top edge */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-px origin-left bg-mavis-gold/70"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Mavis Infra Solutions — home"
            className="flex items-center transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src="/mavis-logo.svg"
              alt="Mavis Infra Solutions"
              width={120}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Menu toggle — animated hamburger ↔ X */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            className="group inline-flex items-center gap-3 py-2 -mr-2 px-2 text-mavis-fg hover:text-mavis-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded"
          >
            <span
              className="hidden sm:inline text-[10px] uppercase font-light opacity-80 group-hover:opacity-100 transition-opacity tabular-nums"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              {mobileNavOpen ? "Close" : "Menu"}
            </span>

            {/* Custom hamburger — two thin lines that rotate to X when open */}
            <span
              aria-hidden="true"
              className="relative inline-block h-3.5 w-5"
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 block h-px w-full bg-current",
                  "transition-all duration-300 ease-out",
                  mobileNavOpen
                    ? "translate-y-0 rotate-45"
                    : "-translate-y-[3.5px]",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 block h-px w-full bg-current",
                  "transition-all duration-300 ease-out",
                  mobileNavOpen
                    ? "translate-y-0 -rotate-45"
                    : "translate-y-[3.5px]",
                )}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}

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
 *   • Fully transparent at all times — no background/blur/border, ever. Logo
 *     and toggle carry a soft drop-shadow so they stay legible over both the
 *     dark hero and lighter sections beneath.
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const lastScrollRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollRef.current;

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
        className="fixed top-0 inset-x-0 z-65 bg-transparent"
      >
        {/* Scroll progress bar — thin gold filament along the very top edge */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-px origin-left bg-mavis-gold/70"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Mavis Infra Solutions — home"
            className="flex items-center transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src="/mavis-logo.svg"
              alt="Mavis Infra Solutions"
              width={210}
              height={56}
              priority
              className="h-11 sm:h-14 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            />
          </Link>

          {/* Menu toggle — animated hamburger ↔ X. Icon only, no label. */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            className="group inline-flex items-center py-2 -mr-2 px-2 text-mavis-fg hover:text-mavis-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            {/* Custom hamburger — two thin lines that rotate to X when open */}
            <span
              aria-hidden="true"
              className="relative inline-block h-6 w-9"
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 block h-0.5 w-full rounded-full bg-current",
                  "transition-all duration-300 ease-out",
                  mobileNavOpen
                    ? "translate-y-0 rotate-45"
                    : "-translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 block h-0.5 w-full rounded-full bg-current",
                  "transition-all duration-300 ease-out",
                  mobileNavOpen
                    ? "translate-y-0 -rotate-45"
                    : "translate-y-1.5",
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

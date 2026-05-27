"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * S1 — Hero.
 *
 * Single cinematic moment. One looping video, one editorial headline, one
 * scroll cue. No carousel. No auto-cycling. No flash.
 *
 * Design intent — the first 3 seconds must establish:
 *   1. Cinematic credibility (full-bleed real footage, not stock)
 *   2. Brand truth ("The sale is not the end. It's the beginning of our service.")
 *   3. Invitation to scroll (small "Discover" cue, never demanding)
 *
 * Typography is Cormorant Garamond Italic — restrained editorial serif. The
 * uppercase tracked "Discover" balances the italic with cleanly tracked sans
 * (Inter). This serif↔sans dialogue carries through the rest of the page.
 *
 * Background video pauses when the section leaves viewport — saves CPU on
 * lower-end devices and keeps battery use polite.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §1.
 */

const HERO_VIDEO = "/videos/hero-sunworth.mp4";
const HERO_POSTER = "/images/hero-poster.jpg";
const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

type ConnLike = { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };
const getConn = (): ConnLike | undefined =>
  (navigator as Navigator & { connection?: ConnLike }).connection;

/** Reactively reads the browser Save-Data hint. SSR snapshot is false, so the
    server renders the video and the client only switches post-hydration. */
function useSaveData(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const c = getConn();
      c?.addEventListener?.("change", cb);
      return () => c?.removeEventListener?.("change", cb);
    },
    () => getConn()?.saveData === true,
    () => false,
  );
}

export function HeroReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [loaded, setLoaded] = useState(false);
  // Track whether the hero is on-screen so the scroll-cue + video loop only
  // animate when visible — saves a constant rAF chain once the user scrolls
  // past the first viewport.
  const [inView, setInView] = useState(true);
  // Only Save-Data fully skips the video download (poster image instead).
  // Reduced-motion still loads the video element — it just doesn't autoplay,
  // so the poster frame shows statically (motion respected, hero still there).
  const saveData = useSaveData();
  const posterOnly = saveData;
  const videoVisible = loaded || reducedMotion;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setInView(isVisible);
        const video = videoRef.current;
        if (!video || reducedMotion) return;
        if (isVisible) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Mavis Infra Solutions"
      className="relative h-screen w-full overflow-hidden bg-mavis-bg isolate"
    >
      {/* Background video — fades in once metadata loads to avoid black flash */}
      <div className="absolute inset-0">
        {posterOnly ? (
          <Image
            src={HERO_POSTER}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.78) saturate(1.05)" }}
          />
        ) : (
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            loop
            autoPlay={!reducedMotion}
            preload="metadata"
            poster={HERO_POSTER}
            aria-hidden="true"
            onLoadedData={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-1000 ease-out",
              videoVisible ? "opacity-100" : "opacity-0",
            )}
            style={{ filter: "brightness(0.78) saturate(1.05)" }}
          />
        )}
        {/* Surface fallback shown while video loads. Same tone as bg so the
            transition is invisible. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-mavis-surface transition-opacity duration-1000",
            videoVisible || posterOnly ? "opacity-0" : "opacity-100",
          )}
        />
      </div>

      {/* Cinematic gradient mask — dark top (for header legibility) and dark
          bottom (for headline + scroll cue legibility). Centre stays clean. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,12,10,0.55) 0%, rgba(13,12,10,0.0) 22%, rgba(13,12,10,0.0) 55%, rgba(13,12,10,0.85) 100%)",
        }}
      />

      {/* Subtle vignette — feathers corners into the warm ink background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 75% at center 50%, transparent 55%, rgba(13,12,10,0.45) 100%)",
        }}
      />

      {/* Editorial headline — lower third, centred. Italic Cormorant carries
          the line; muted secondary tucks under at half-size. */}
      <div className="absolute inset-x-0 bottom-32 sm:bottom-36 z-10 flex flex-col items-center px-6 text-center pointer-events-none">
        <motion.h1
          className="text-mavis-fg max-w-4xl"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1.2,
              delay: 0.9,
              ease: EASE_QUINT_OUT,
            },
          }}
        >
          <span className="block font-display italic font-light text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-tight">
            The sale is not the end.
          </span>
          <motion.span
            className="mt-4 block font-display italic font-light text-[clamp(1rem,2vw,1.35rem)] text-mavis-fg-muted"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1.1, delay: 1.7, ease: "easeOut" as const },
            }}
          >
            It&rsquo;s the beginning of our service.
          </motion.span>
        </motion.h1>
      </div>

      {/* Scroll cue — eyebrow + thin vertical line with a slow gold travel.
          Invites further engagement without flashing. */}
      <motion.div
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center pointer-events-none"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.9, delay: 2.5 },
        }}
      >
        <div className="flex flex-col items-center gap-3 text-mavis-fg-muted">
          <span
            className="text-[10px] uppercase font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Discover
          </span>
          {/* Static line with a slow gold "elevator" indicator travelling down */}
          <span className="relative h-12 w-px overflow-hidden">
            <span className="absolute inset-0 bg-mavis-fg-faint" />
            {!reducedMotion && inView && (
              <motion.span
                aria-hidden="true"
                className="absolute -inset-x-px h-6 bg-linear-to-b from-transparent via-mavis-gold to-transparent"
                initial={{ y: -24 }}
                animate={{ y: 48 }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                  repeatDelay: 1.4,
                }}
              />
            )}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

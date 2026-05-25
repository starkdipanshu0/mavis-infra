"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND, NAV_LINKS, TEL_LINK, buildWhatsAppLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Fullscreen dark overlay menu. Fades in over the page.
 *
 * The Header sits at z-[65] above this nav (z-60) — its hamburger button
 * animates to an X when open and serves as the single close trigger. ESC key
 * also closes. We don't render a redundant in-overlay X to keep the menu
 * surface clean.
 *
 * a11y:
 *   • Body scroll locked while open
 *   • ESC closes
 *   • Focus moves to the first nav link on open and Tab is trapped within
 *     the overlay; on close focus is restored to whichever element had it
 *     before the menu opened (typically the hamburger toggle).
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Focus management — capture the previously focused element, move focus into
  // the overlay, trap Tab, and restore on close.
  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Defer one frame so the overlay is interactive before we focus into it.
    const raf = requestAnimationFrame(() => {
      const first = overlay.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("aria-hidden"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      // Restore focus to whatever opened the menu (the hamburger button).
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-60 bg-mavis-bg/95 backdrop-blur-xl",
        "transition-all duration-500 ease-out",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      {/* Spacer matching the Header height so the close X above lines up
          visually with where the user expects the menu to "close from". */}
      <div className="h-full w-full flex flex-col pt-16">
        <nav className="flex-1 flex flex-col justify-center items-center px-6 gap-6">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "text-mavis-fg uppercase font-thin",
                "text-[clamp(2rem,5vw,3.5rem)] tracking-wide leading-none",
                "hover:text-mavis-gold transition-colors duration-300",
                "transition-all ease-out",
                open
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3",
              )}
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pb-10 px-6 sm:px-8 lg:px-12 flex flex-col items-center gap-3 text-xs uppercase text-mavis-fg-muted">
          <div className="flex gap-6">
            <a
              href={TEL_LINK}
              className="hover:text-mavis-gold transition-colors"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              {BRAND.phone.display}
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mavis-gold transition-colors"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              WhatsApp
            </a>
          </div>
          <p
            className="text-mavis-fg-faint text-[10px]"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {BRAND.email}
          </p>
        </div>
      </div>
    </div>
  );
}

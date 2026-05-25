import { BRAND, TEL_LINK, buildWhatsAppLink } from "@/lib/constants";

/**
 * Site footer.
 * Minimal one-line per Binghatti reference. Centered. White at low opacity.
 * Legal links removed for v1 — they'll come back once /privacy and /terms
 * stubs ship. Contact links instead point to surfaces that already exist.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-mavis-line bg-mavis-bg">
      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-12 py-5 sm:h-16 sm:py-0 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-mavis-fg-faint">
        <p
          className="text-[11px] uppercase text-center sm:text-left"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          © {year} {BRAND.name}. All rights reserved.
        </p>
        <nav
          aria-label="Contact"
          className="flex items-center gap-5 text-[11px] uppercase"
          style={{ letterSpacing: "var(--tracking-display-wide)" }}
        >
          <a
            href={TEL_LINK}
            className="hover:text-mavis-fg transition-colors"
          >
            {BRAND.phone.display}
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-mavis-fg transition-colors"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}

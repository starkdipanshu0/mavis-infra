import { Phone } from "lucide-react";
import { TEL_LINK } from "@/lib/constants";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

/**
 * Fixed right-edge action cluster — phone + WhatsApp.
 * Always visible. Vertically stacked. White frosted circles.
 *
 * Hidden on the lead-form section (page handles via CSS scroll-margin if needed
 * — out of scope for v1; section 8 has its own form).
 */
export function FloatingActions() {
  return (
    <div className="fixed right-4 sm:right-6 bottom-6 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-40 flex flex-col gap-3">
      <a
        href={TEL_LINK}
        aria-label="Call Mavis"
        className="h-12 w-12 rounded-full inline-flex items-center justify-center text-mavis-fg bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 hover:border-white/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft"
      >
        <Phone className="h-5 w-5" strokeWidth={1.5} />
      </a>
      <WhatsAppButton variant="circle" />
    </div>
  );
}

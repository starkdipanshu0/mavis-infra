import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  /** Prefilled message when WA opens. Defaults to a generic enquiry. */
  message?: string;
  /** Floating circle (default), inline text variant, or icon-only */
  variant?: "circle" | "inline" | "icon";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<WhatsAppButtonProps["variant"]>, string> = {
  circle:
    "h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/25 " +
    "hover:bg-whatsapp hover:border-whatsapp",
  inline:
    "h-11 px-5 gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 " +
    "uppercase text-[11px] font-medium hover:bg-whatsapp hover:border-whatsapp",
  icon:
    "h-9 w-9 rounded-full hover:bg-white/10",
};

/**
 * WhatsApp link button — prefilled message, opens wa.me in new tab.
 * Use `circle` for floating right-edge actions, `inline` for in-page CTAs.
 */
export function WhatsAppButton({
  message,
  variant = "circle",
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "inline-flex items-center justify-center text-mavis-fg",
        "transition-colors duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft",
        VARIANT_CLASSES[variant],
        className,
      )}
      style={{ letterSpacing: "var(--tracking-display-wide)" }}
    >
      <MessageCircle
        className={variant === "icon" ? "h-4 w-4" : "h-5 w-5"}
        strokeWidth={1.5}
      />
      {variant === "inline" && <span>WhatsApp</span>}
    </a>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface CommonProps {
  children: ReactNode;
  /** `lg` for hero CTAs, `md` for in-section CTAs */
  size?: "md" | "lg";
  /** Full-width within parent */
  block?: boolean;
  className?: string;
}

type AsLink = CommonProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

type AsButton = CommonProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "className" | "children">;

type FrostedButtonProps = AsLink | AsButton;

const SIZE_CLASSES: Record<NonNullable<CommonProps["size"]>, string> = {
  md: "h-11 px-7 text-[11px]",
  lg: "h-12 px-9 text-xs",
};

const BASE =
  "inline-flex items-center justify-center uppercase font-medium text-mavis-fg " +
  "bg-white/10 backdrop-blur-md border border-white/25 " +
  "transition-all duration-300 ease-out " +
  "hover:bg-white/15 hover:border-white/40 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft " +
  "active:scale-[0.98]";

/**
 * Frosted-glass CTA button — the Mavis primary action style.
 * Renders as `<Link>` when `href` is provided, otherwise `<button>`.
 *
 * <FrostedButton href="/projects">View All Projects →</FrostedButton>
 */
export function FrostedButton(props: FrostedButtonProps) {
  const { children, size = "md", block, className, ...rest } = props;
  const classes = cn(
    BASE,
    SIZE_CLASSES[size],
    block && "w-full",
    className,
  );

  const trackingStyle = { letterSpacing: "var(--tracking-display-wide)" };

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={classes} style={trackingStyle} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { href: _omit, ...buttonRest } = rest as AsButton;
  void _omit;
  return (
    <button className={classes} style={trackingStyle} {...buttonRest}>
      {children}
    </button>
  );
}

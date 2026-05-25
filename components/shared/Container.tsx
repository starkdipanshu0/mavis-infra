import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** `wide` for hero/full sections, `default` for content, `narrow` for prose */
  size?: "narrow" | "default" | "wide";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
};

/**
 * Centered max-width wrapper with consistent horizontal padding.
 * Use this for any in-section content layout.
 */
export function Container({
  children,
  size = "default",
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

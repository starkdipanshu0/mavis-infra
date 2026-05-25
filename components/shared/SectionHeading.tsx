import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** First word(s), rendered BOLD weight 700 */
  bold: string;
  /** Second word(s), rendered THIN weight 200 */
  thin: string;
  /** Display size — defaults to `md` (section heading scale) */
  size?: "sm" | "md" | "lg";
  /** Center vs left-align */
  align?: "left" | "center";
  /** Tag — `h2` by default; use `h1` only for page-level hero */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  sm: "text-[clamp(1.5rem,3vw,2.25rem)]",
  md: "text-[var(--text-display-md)]",
  lg: "text-[var(--text-display-lg)]",
};

/**
 * Two-weight uppercase heading used across the site.
 * Pattern: `BOLD THIN` — establishes the Mavis editorial voice.
 *
 * <SectionHeading bold="EXPLORE" thin="ALL PROJECTS" />
 */
export function SectionHeading({
  bold,
  thin,
  size = "md",
  align = "center",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "uppercase leading-[0.95] text-mavis-fg",
        SIZE_CLASSES[size],
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={{ letterSpacing: "var(--tracking-display)" }}
    >
      <span className="font-bold">{bold}</span>
      <span className="font-thin ml-[0.3em]">{thin}</span>
    </Tag>
  );
}

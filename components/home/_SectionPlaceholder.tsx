import { cn } from "@/lib/utils";

interface SectionPlaceholderProps {
  /** S1, S2, … */
  number: string;
  /** Section title */
  title: string;
  /** One-line description of what will live here */
  description: string;
  /** Section height — defaults to 100vh */
  height?: "full" | "tall" | "medium";
  /** Background — defaults to mavis-bg */
  background?: "bg" | "surface" | "elevated";
}

const HEIGHT_CLASSES: Record<NonNullable<SectionPlaceholderProps["height"]>, string> = {
  full: "min-h-screen", // 100vh
  tall: "min-h-[80vh]",
  medium: "min-h-[60vh]",
};

const BG_CLASSES: Record<NonNullable<SectionPlaceholderProps["background"]>, string> = {
  bg: "bg-mavis-bg",
  surface: "bg-mavis-surface",
  elevated: "bg-mavis-elevated",
};

/**
 * Pre-build placeholder shown for each homepage section until its real
 * component is implemented. Always shows section number, title, plan
 * reference so we can verify routing/layout without finished assets.
 *
 * Internal — prefix `_` keeps it out of the component public surface.
 */
export function SectionPlaceholder({
  number,
  title,
  description,
  height = "full",
  background = "bg",
}: SectionPlaceholderProps) {
  return (
    <section
      className={cn(
        "w-full flex items-center justify-center border-b border-mavis-line",
        HEIGHT_CLASSES[height],
        BG_CLASSES[background],
      )}
    >
      <div className="text-center px-6 max-w-2xl">
        <p
          className="text-[11px] uppercase text-mavis-gold"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Section {number}
        </p>
        <h2
          className="mt-4 uppercase text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
          style={{ letterSpacing: "var(--tracking-display)" }}
        >
          <span className="font-bold">{title.split(" ")[0]}</span>
          <span className="font-thin ml-[0.3em]">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <p className="mt-6 text-sm text-mavis-fg-muted leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with Tailwind-aware merging.
 * Standard shadcn/ui helper.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian rupees with Cr/Lakh shorthand.
 * 18_500_000 → "₹1.85 Cr"
 * 9_500_000  → "₹95 L"
 * 50_000     → "₹50,000"
 */
export function formatINR(value: number): string {
  if (value >= 10_000_000) {
    const cr = value / 10_000_000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }
  if (value >= 100_000) {
    const lakh = value / 100_000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, "")} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Format a price range: 18_500_000–28_000_000 → "₹1.85 Cr – ₹2.8 Cr"
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatINR(min)} – ${formatINR(max)}`;
}

/**
 * URL-safe slug from a string.
 * "Provident Sunworth City" → "provident-sunworth-city"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Convert a possession date to a short label.
 * "2027-12-01" → "Dec 2027" · null → "Ready to Move"
 */
export function formatPossession(date: string | null | undefined): string {
  if (!date) return "Ready to Move";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

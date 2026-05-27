/**
 * Pure filtering / sorting logic for the /projects listing.
 *
 * Framework-agnostic and side-effect-free so it can run on the server (for
 * metadata) and the client (for live filtering) from a single source. The
 * canonical filter state lives in the URL query string; `parseSearchParams`
 * reads it and `buildQueryString` writes it back.
 *
 * Multi-select values are comma-joined in one param: `?status=pre-launch,ready`.
 */

import type { ProjectCardItem, ProjectZone } from "@/lib/data/all-projects";
import {
  BUDGET_BRACKETS,
  SORT_OPTIONS,
  TOP_BUILDERS,
  DEFAULT_SORT,
  type SortSlug,
} from "@/lib/constants";

export type ZoneFilter = ProjectZone | "all";

export interface FilterState {
  zone: ZoneFilter;
  budget: string[]; // BUDGET_BRACKETS slugs
  bhk: number[]; // bedroom counts
  status: string[]; // ProjectStatus values
  builder: string[]; // lowercased builder names
  type: string[]; // ProjectType values
  sort: SortSlug;
}

export const EMPTY_FILTERS: FilterState = {
  zone: "all",
  budget: [],
  bhk: [],
  status: [],
  builder: [],
  type: [],
  sort: DEFAULT_SORT,
};

/** The five dropdown filter keys (zone + sort are managed separately). */
export const FILTER_KEYS = ["budget", "bhk", "status", "builder", "type"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

const VALID_ZONES: ZoneFilter[] = ["all", "east", "north", "south", "outstation"];
const VALID_SORTS = SORT_OPTIONS.map((s) => s.slug) as SortSlug[];

const splitCsv = (raw: string | null): string[] =>
  raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

export const builderSlug = (builder: string): string => builder.toLowerCase();

/** Read a FilterState from a URLSearchParams (client) or equivalent. */
export function parseSearchParams(params: URLSearchParams): FilterState {
  const zoneRaw = params.get("zone");
  const zone = (VALID_ZONES.includes(zoneRaw as ZoneFilter)
    ? zoneRaw
    : "all") as ZoneFilter;

  const sortRaw = params.get("sort");
  const sort = (VALID_SORTS.includes(sortRaw as SortSlug)
    ? sortRaw
    : DEFAULT_SORT) as SortSlug;

  const budgetSlugs = new Set(BUDGET_BRACKETS.map((b) => b.slug));

  return {
    zone,
    budget: splitCsv(params.get("budget")).filter((s) => budgetSlugs.has(s)),
    bhk: splitCsv(params.get("bhk"))
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5),
    status: splitCsv(params.get("status")),
    builder: splitCsv(params.get("builder")).map((s) => s.toLowerCase()),
    type: splitCsv(params.get("type")),
    sort,
  };
}

/** Build a `URLSearchParams` instance from a plain object (server adapter). */
export function objectToSearchParams(
  obj: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(obj)) {
    if (val == null) continue;
    params.set(key, Array.isArray(val) ? val.join(",") : val);
  }
  return params;
}

/** Serialize FilterState back to a query string (no leading `?`). Omits
    defaults so canonical URLs stay clean and cacheable. */
export function buildQueryString(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.zone !== "all") params.set("zone", state.zone);
  if (state.budget.length) params.set("budget", state.budget.join(","));
  if (state.bhk.length) params.set("bhk", state.bhk.join(","));
  if (state.status.length) params.set("status", state.status.join(","));
  if (state.builder.length) params.set("builder", state.builder.join(","));
  if (state.type.length) params.set("type", state.type.join(","));
  if (state.sort !== DEFAULT_SORT) params.set("sort", state.sort);
  return params.toString();
}

/** Count of active dropdown filters (drives the CLEAR button + mobile pill). */
export function activeFilterCount(state: FilterState): number {
  return (
    state.budget.length +
    state.bhk.length +
    state.status.length +
    state.builder.length +
    state.type.length
  );
}

function matchesBudget(p: ProjectCardItem, budgetSlugs: string[]): boolean {
  if (p.priceMin == null) return false; // no band → can't confirm
  const pMin = p.priceMin;
  const pMax = p.priceMax ?? p.priceMin;
  return budgetSlugs.some((slug) => {
    const bracket = BUDGET_BRACKETS.find((b) => b.slug === slug);
    if (!bracket) return false;
    const bMin = "min" in bracket ? bracket.min : 0;
    const bMax = "max" in bracket ? bracket.max : Infinity;
    return pMin <= bMax && pMax >= bMin; // band overlaps bracket
  });
}

/** Apply all active filters (AND across categories, OR within each). */
export function applyFilters(
  projects: readonly ProjectCardItem[],
  state: FilterState,
): ProjectCardItem[] {
  return projects.filter((p) => {
    if (state.zone !== "all" && p.zone !== state.zone) return false;
    if (state.status.length && !state.status.includes(p.status)) return false;
    if (state.type.length && !state.type.includes(p.type)) return false;
    if (state.builder.length && !state.builder.includes(builderSlug(p.builder)))
      return false;
    if (state.bhk.length && !p.bhk.some((b) => state.bhk.includes(b)))
      return false;
    if (state.budget.length && !matchesBudget(p, state.budget)) return false;
    return true;
  });
}

const STATUS_RANK: Record<ProjectCardItem["status"], number> = {
  "pre-launch": 0,
  "under-construction": 1,
  ready: 2,
};

/** Effective possession key for sorting: ready = soonest, unknown = last. */
function possessionKey(p: ProjectCardItem): number {
  if (p.status === "ready") return -Infinity;
  if (!p.possession) return Infinity;
  const [y, m] = p.possession.split("-").map(Number);
  return y * 12 + (m || 1);
}

/** Sort a filtered list. Stable on the original order as the final tiebreak. */
export function sortProjects(
  projects: ProjectCardItem[],
  sort: SortSlug,
): ProjectCardItem[] {
  const withIndex = projects.map((p, i) => ({ p, i }));
  const priceAsc = (a: ProjectCardItem, b: ProjectCardItem) =>
    (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity);

  withIndex.sort((a, b) => {
    switch (sort) {
      case "newest": {
        const r = STATUS_RANK[a.p.status] - STATUS_RANK[b.p.status];
        return r !== 0 ? r : a.i - b.i;
      }
      case "price-asc": {
        const r = priceAsc(a.p, b.p);
        return r !== 0 ? r : a.i - b.i;
      }
      case "price-desc": {
        const r = -priceAsc(a.p, b.p);
        return r !== 0 ? r : a.i - b.i;
      }
      case "possession": {
        const r = possessionKey(a.p) - possessionKey(b.p);
        return r !== 0 ? r : a.i - b.i;
      }
      case "featured":
      default:
        return a.i - b.i;
    }
  });

  return withIndex.map((x) => x.p);
}

export interface BuilderOption {
  name: string; // display, e.g. "SOBHA"
  slug: string; // lowercased, URL value
  count: number;
}

/** Derive the builder filter options from the data: top builders first
    (in TOP_BUILDERS order), then the remaining builders A–Z. */
export function deriveBuilders(
  projects: readonly ProjectCardItem[],
): BuilderOption[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    counts.set(p.builder, (counts.get(p.builder) ?? 0) + 1);
  }
  const all = [...counts.keys()];
  const top = TOP_BUILDERS.filter((b) => counts.has(b));
  const rest = all
    .filter((b) => !TOP_BUILDERS.includes(b as (typeof TOP_BUILDERS)[number]))
    .sort((a, b) => a.localeCompare(b));
  return [...top, ...rest].map((name) => ({
    name,
    slug: builderSlug(name),
    count: counts.get(name) ?? 0,
  }));
}

/** Human-readable summary of active filters — used for dynamic <title>/H1. */
export function describeFilters(state: FilterState): string {
  const parts: string[] = [];
  if (state.bhk.length) parts.push(`${state.bhk.sort().join(", ")} BHK`);
  if (state.status.includes("pre-launch")) parts.push("Pre-launch");
  else if (state.status.includes("ready")) parts.push("Ready-to-Move");
  const zoneLabel: Record<ZoneFilter, string> = {
    all: "Bangalore",
    east: "East Bangalore",
    north: "North Bangalore",
    south: "South Bangalore",
    outstation: "Outstation",
  };
  const where = zoneLabel[state.zone];
  const noun = parts.length ? `${parts.join(" ")} Projects` : "All Projects";
  return `${noun} in ${where}`;
}

import type { CVData } from "@/lib/types";

/** Built-in section IDs in their default order; custom sections use their own `id`. */
export const DEFAULT_SECTIONS_ORDER = [
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "other",
];

/** All sections in display order with their visibility, for layout editors. */
export function getLayoutSections(data: CVData): { id: string; hidden: boolean }[] {
  const order = data.sectionsOrder || DEFAULT_SECTIONS_ORDER;
  const all = [
    ...new Set([
      ...order,
      ...DEFAULT_SECTIONS_ORDER,
      ...(data.customSections || []).map((s) => s.id),
    ]),
  ];
  const hidden = new Set(data.hiddenSections || []);
  // A built-in section missing from an explicit order has always been hidden; keep that.
  return all.map((id) => ({
    id,
    hidden:
      hidden.has(id) ||
      (DEFAULT_SECTIONS_ORDER.includes(id) && !!data.sectionsOrder && !order.includes(id)),
  }));
}

/** Section IDs templates should render, in order. */
export function getOrderedSectionIds(data: CVData): string[] {
  return getLayoutSections(data)
    .filter((s) => !s.hidden)
    .map((s) => s.id);
}

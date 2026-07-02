import type { ProductId } from "@/lib/products";

// Glow variants — each product color tuned to read on the dark hub (#0b0b0c).
// See docs/brand/bapita-v3-brand-system.md §2.2.
const ACCENT_MAP: Record<ProductId, string> = {
  book: "#f0743a",
  social: "#2bc487",
  seo: "#4e86ff",
  outreach: "#9277ff",
  bots: "#f2628f",
  ads: "#f5a623",
};

/**
 * Returns an inline style object setting --accent to the product's
 * hex color. Used on any element that needs per-product theming via
 * the .accent-* CSS utility classes in globals.css.
 */
export function accentStyle(id: ProductId): React.CSSProperties {
  return { "--accent": ACCENT_MAP[id] } as React.CSSProperties;
}

export function accentHex(id: ProductId): string {
  return ACCENT_MAP[id];
}

/**
 * Light-surface variant — sets --accent to the product's base token
 * (deeper hue that reads on paper/clay backgrounds).
 */
export function accentStyleLight(id: ProductId): React.CSSProperties {
  return { "--accent": `var(--color-${id})` } as React.CSSProperties;
}

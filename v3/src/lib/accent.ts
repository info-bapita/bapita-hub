import type { ProductId } from "@/lib/products";

const ACCENT_MAP: Record<ProductId, string> = {
  book: "#d4622a",
  social: "#e8920a",
  seo: "#3c7a52",
  outreach: "#1a7a7a",
  bots: "#5b5f97",
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

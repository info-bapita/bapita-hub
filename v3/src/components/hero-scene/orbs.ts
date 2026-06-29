/** The five product orbs — fixed hue per product (brand glow values). */
export interface OrbDef {
  id: "book" | "social" | "seo" | "outreach" | "bots";
  label: string;
  color: string;
  /** resting home position in the field, used for drift + respawn */
  home: [number, number, number];
}

export const ORBS: OrbDef[] = [
  { id: "book", label: "Book", color: "#f0743a", home: [-2.6, 1.4, 0] },
  { id: "social", label: "Social", color: "#2bc487", home: [2.6, 1.6, 0.4] },
  { id: "seo", label: "SEO", color: "#4e86ff", home: [-3.1, -0.2, -0.4] },
  { id: "outreach", label: "Outreach", color: "#9277ff", home: [3.2, 0.1, -0.2] },
  { id: "bots", label: "Bots", color: "#f2628f", home: [0.2, 2.3, 0.2] },
];

/** Bowl center in world space — where caught orbs land. */
export const BOWL_CENTER: [number, number, number] = [0, -1.7, 0];
export const BOWL_RADIUS = 1.15;

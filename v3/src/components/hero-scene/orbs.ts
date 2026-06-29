/** The five product orbs — fixed hue per product (brand glow values). */
export interface OrbDef {
  id: "book" | "social" | "seo" | "outreach" | "bots";
  label: string;
  color: string;
  /** resting home position in the field, used for drift + respawn */
  home: [number, number, number];
}

export const ORBS: OrbDef[] = [
  { id: "book",     label: "Book",     color: "#f0743a", home: [-3.5,  1.8,  0   ] },
  { id: "social",   label: "Social",   color: "#2bc487", home: [ 3.2,  2.2,  0.4 ] },
  { id: "seo",      label: "SEO",      color: "#4e86ff", home: [-4.0,  0.2, -0.4 ] },
  { id: "outreach", label: "Outreach", color: "#9277ff", home: [ 3.8, -0.2, -0.2 ] },
  { id: "bots",     label: "Bots",     color: "#f2628f", home: [ 0.5,  3.4,  0.2 ] },
];

/** Bowl center in world space — where caught orbs land. */
export const BOWL_CENTER: [number, number, number] = [0, -2.4, 0];
export const BOWL_RADIUS = 1.15;

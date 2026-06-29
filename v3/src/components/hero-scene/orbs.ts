/** The six product orbs — fixed hue per product. Names render INSIDE the orb. */
export interface OrbDef {
  id: "book" | "seo" | "analytics" | "social" | "outreach" | "bots";
  label: string;
  color: string;
  /** resting home position in the field, used for drift + respawn */
  home: [number, number, number];
}

export const ORBS: OrbDef[] = [
  // 3 LEFT — symmetric arc: upper, mid, low-over-bowl
  { id: "book",      label: "Online booking", color: "#E8920A", home: [-3.3,  1.5,  0.2 ] },
  { id: "seo",       label: "SEO tools",      color: "#2E84D8", home: [-3.7,  0.0,  0   ] },
  { id: "analytics", label: "Analytics",      color: "#16A6B3", home: [-1.7, -2.4,  0.6 ] },
  // 3 RIGHT — mirror arc
  { id: "social",    label: "Social posts",   color: "#23A36A", home: [ 3.3,  1.5,  0.2 ] },
  { id: "outreach",  label: "Outreach tools", color: "#8163E6", home: [ 3.7,  0.0,  0   ] },
  { id: "bots",      label: "Chat bots",      color: "#E64F86", home: [ 1.7, -2.4,  0.6 ] },
];

/** Bowl sits low-center as the anchor, large, bleeding off the bottom fold. */
export const BOWL_CENTER: [number, number, number] = [0, -3.2, 0];
export const BOWL_RADIUS = 3.0;
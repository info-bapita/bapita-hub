# Homepage overhaul — conversion + clay hero

**What:** Rework bapita.com homepage: (1) connect section — "How would you like to connect?" chooser: Calendly (https://calendly.com/info-bapita/30min) + lead form (name, business?, phone, email → Supabase `leads`, insert-only RLS); all CTAs point here. (2) Merge ProductsGrid+Pricing into "What we offer": Book (Live) + Social (Launching soon) featured w/ full features; SEO/Outreach/Bots/Ads compact roadmap row w/ features + notify. No prices. (3) Copy: H1 "Your business, online. Without the tech." + evergreen suite copy (kill "five tools"). (4) Proof band: 35% after-hours / 78% first-responder / 80% fewer no-shows stats + category marquee. (5) Hero rebuild: DOM/CSS clay orbs + pita bowl bridging light hero → dark page; drop three/rapier. (6) Rhythm: light hero → dark proof/offer/how → light who-its-for → dark FAQ/connect. (7) A11y: contrast ≥AA on muted text, aria-expanded/pressed, FAQ clip fix, selectable hero text, /privacy /terms pages, OG image.

**Why:** Page never asked for the actual conversion (call), showed no proof, duplicated product grids, and hero read cheap. Founder-led sales needs call bookings + lead capture.

**Acceptance:**
- "Book a free call" in nav + hero scrolls to #connect; Calendly opens new tab; form saves to Supabase and shows success.
- One offering section; six products; no prices; notify forms still work.
- Hero: clay orbs drop into bowl (arc + squash + bowl pulse), bowl straddles light→dark fold; reduced-motion = static; no three.js in bundle.
- Lint + build pass; Playwright screenshots verified; muted text passes AA.

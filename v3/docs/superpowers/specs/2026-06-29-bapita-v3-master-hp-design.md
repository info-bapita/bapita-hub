# Bapita v3 — Master Homepage Rebuild · Design Spec

**Date:** 2026-06-29
**Surface:** `bapita.com` — the neutral premium dark hub
**Goal:** Rebuild the master homepage section-by-section to Gemini/Scale-tier polish, on the v3 brand system, with restrained premium motion. Existing site (commit `8ad62a6`) is the baseline we improve.

---

## 1. Decisions (locked with Rami)

| Item | Decision |
|---|---|
| Hero headline | **"Built for you. Run it your way."** |
| Hero engine | **Higgsfield-generated video loop** background, with poster + graceful fallback |
| Motion stack | **framer-motion** only (no Lenis, no WebGL/three) |
| Higgsfield assets | **Hero video only** for now. Bento + sections use CSS motifs + Lucide. Product spot-illos = later pass. |
| Logo mark | **Neutral white bowl** icon (recreate bowl/smile as SVG, strip cream card) + white `bapita` wordmark, both `#F4F4F2` |
| Scope | **Full section-by-section rebuild** |
| Bento cards | All **5 products**, status badge only (Live / Coming soon), short description. No per-product control-mode tags. |
| WhatsApp CTA | **Dropped.** CTAs stay internal (`#products`, `book.bapita.com`, waitlist, `mailto`). |

### Theme guardrails (from `bapita-v3-brand-system.md`)
- Hub is **neutral dark** (`--ink-900 #0B0B0C`). Terracotta is **Book's** color only — never the master brand color.
- The five product hues coexist **only** in the bento product grid. Everywhere else the hub is neutral.
- Heebo everywhere. Premium feel from whitespace + type weight + restraint, not extra fonts.
- Motion: purposeful, calm. Respect `prefers-reduced-motion` always.

---

## 2. Messaging strategy (the core rewrite)

The biggest content change. v2 copy leans **hands-off** ("no logins to a complicated dashboard," "you focus on customers, we handle the software," "run your business, not your tools"). The v3 truth is a **spectrum**, and current copy must be rewritten to match it.

**The spectrum truth:**
- **Book** — runs itself. Dashboard optional but recommended. Hands-off is fine.
- **Social** — you drive, but trivially: one button, one inbox, schedule a post in a tap.
- **SEO / Outreach / Bots** — land between; mostly automated, simple controls.

**Hero promise:** *Built for you. Run it your way.* — Some tools run themselves; some you run in one tap; none need setup or an agency.

**Copy rules (carry from brand voice §7):**
- "Zero technical setup. Total daily simplicity." is the recurring theme.
- Do **NOT** say "you never touch the system" or "no dashboard." Owners HAVE full daily control — easy scheduling, calendar, stats, one tap on mobile.
- Speak to any SMB, not just barbers. Short sentences. Headlines ≤ 12 words. "You" and "we." AI is the engine, not the headline.

**Sections needing copy edits for this:**
- **Hero** — new headline + spectrum sub.
- **HowItWorks** — step 3 ("Run your business, not your tools") reframed to simple daily control (see §4.5).
- **FAQ** — Q1 ("no logins to a complicated dashboard, no settings to figure out") rewritten to "simple controls you actually use, not a system you fight." Q2 similar.

---

## 3. Architecture & foundations

Stack unchanged: Next 16 App Router, React 19, Tailwind v4 `@theme`, Heebo via `next/font`, lucide-react. **Add `framer-motion`** (one dep).

### 3.1 Motion layer
- Replace/augment the custom `Reveal` (IntersectionObserver) with a thin framer-motion wrapper so reveals, stagger, parallax, and spring hovers share one system.
- New `Reveal` API stays the same (`children`, `delay`, `className`) so call sites don't churn — internals swap to `motion` + `whileInView`.
- **Reveal spec:** fade + `translateY(16px)` → `0`, 300ms ease-out, children stagger 80ms.
- **Hover spec (bento):** `translateY(-4px)` + accent glow drop-shadow, 200ms spring.
- Add a `useReducedMotion` guard — when reduced, disable transforms/parallax/video; show static states.

### 3.2 globals.css token completion
Add v3 tokens currently missing or partial:
- Borders: `--ink-700 #1E1E22`, `--ink-600 #2A2A30`, `--text-on-dark-muted #9A9AA2`.
- Radii: `--radius-sm 8px`, `--radius-md 12px`, `--radius-lg 16px` (current `--radius-card` stays as alias).
- Shadows: `--shadow-sm/md/lg` per brand doc.
- Spacing: `--section-pad: clamp(4rem,8vw,8rem)`.
- Keyframes: hero gradient/glow drift (fallback layer), reduced-motion off-switch.

### 3.3 Hero video asset (Higgsfield)
- Generate **one** abstract motion loop: near-black field, faint slow-drifting colored light-blooms in the five product hues. Premium, subtle, seamless loop, neutral-dark dominant.
- Output to `/public/hero/` as `.mp4` (+ `.webm` if available) + a **poster** still frame.
- Playback: `autoplay muted loop playsinline`, `preload="none"` or lazy, poster shown until ready.
- **Fallbacks (no video / reduced-motion / mobile):** static poster image + a CSS radial-gradient bloom layer. Never block first paint; video is decoration over a complete static hero.
- Credit guard: watch for Higgsfield limit warning; if hit, ship poster + CSS bloom and swap in video later (Rami can add free accounts for more credits).

---

## 4. Sections (full rebuild, top to bottom)

### 4.1 Navigation
Sticky, `bg-ink/80` + `backdrop-blur-md`, hairline bottom border. New white bowl logo lockup. Links: Products / How it works / Pricing / FAQ. Primary CTA "See the tools" → `#products`. Mobile: blur sheet menu (keep current toggle pattern).

### 4.2 Hero (most impressive fold)
- Video-loop background (§3.3) behind a complete static hero.
- Eyebrow: "Digital tools for any business."
- Display headline **"Built for you. Run it your way."** — `--text-display-xl`, weight 800, tight tracking.
- Sub: "Some tools run themselves. Some you run in one tap. None need setup, none need an agency."
- CTAs: primary "See the tools" → `#products`; secondary "How it works" → `#how-it-works`.
- Entrance: staggered reveal of eyebrow → headline → sub → CTAs. Optional subtle parallax on the bloom layer tied to scroll (disabled on reduced-motion).

### 4.3 Social proof
Keep marquee concept; restyle neutral-premium. Categories/served-types from `SERVED_CATEGORIES`. Quiet, low-contrast, single row.

### 4.4 Bento grid (the one place 5 colors live)
- Real **bento**: varied cell sizes (e.g. Book as a larger feature cell since it's Live; the four "coming soon" as smaller cells) on a responsive grid; collapses to single column on mobile.
- Section header: "Five tools, one toolkit." + short intro.
- Each card: product accent **glow** color for icon + motif + "Learn more →"; status badge top-right (Live / Coming soon); name "Bapita {Name}"; short description (use `tagline`/`description` from `products.ts`, trimmed).
- Live (Book) → link to `book.bapita.com`. Coming-soon → anchor to its pricing/notify block (or inline notify).
- Hover: `translateY(-4px)` + accent glow drop-shadow, 200ms. Keep existing `.product-card` glow, tune to brand drop-shadow.

### 4.5 How it works — 3-step onboarding timeline
Reframe to **Call → We Build → Simple Control** with a connected timeline visual (vertical line / connectors), staggered reveal.
1. **A quick call** — Tell us about your business. No tech talk.
2. **We build it** — Configured, branded, and live — usually within 48 hours.
3. **Simple daily control** — Schedule, post, check stats in one tap. Or let it run itself. Your call. *(replaces hands-off step 3)*

### 4.6 Who it's for
Keep; restyle neutral-premium. Business-type chips from `BUSINESS_TYPES`.

### 4.7 Pricing
Keep per-product card structure + waitlist `NotifyForm` (already wired to `/api/waitlist`). Restyle. Header keeps "Pay for what you use. Nothing more." + "Pick what you need. Pay for what you use. No lock-in."

### 4.8 FAQ
Accordion (keep behavior). **Rewrite Q1 + Q2** to the control framing (no "no dashboard / no logins"). Keep the rest.

### 4.9 CTA band + Footer
Clean closing CTA band (neutral, "See the tools" / "Talk to us" → `mailto`/`#products`, no WhatsApp) + footer. Restyle to premium dark.

---

## 5. Components touched
- `ui/brand-mark.tsx` — new white bowl SVG + wordmark.
- `reveal.tsx` — framer-motion internals, same API, add stagger + reduced-motion.
- `hero.tsx` — video bg + new copy + parallax.
- `products-grid.tsx` — bento layout, control-tag-free, tuned hover glow.
- `how-it-works.tsx` — timeline visual + reworded steps.
- `navigation.tsx`, `social-proof.tsx`, `who-its-for.tsx`, `pricing.tsx`, `faq.tsx`, `footer.tsx` — restyle pass + copy edits where noted.
- `globals.css` — token completion + keyframes.
- New: `/public/hero/` assets.

## 6. Out of scope (YAGNI / later)
- Product spot-illustrations (5) — later Higgsfield pass.
- Subdomain/product pages — separate specs.
- Region migration, Stripe, analytics — unrelated.

## 7. Verification
- `npm run build` + `eslint` clean.
- Local Playwright screenshots (desktop + mobile) of each fold.
- Reduced-motion check (video off, statics show).
- Feature branch off `main`; push → Vercel preview; Rami approves before prod.

---

## 8. Risks
- **Hero video weight / perf** — mitigated by poster-first, lazy, reduced-motion + mobile fallback to static.
- **Higgsfield free limit** — mitigated by single asset + poster/CSS fallback; can swap video in later.
- **framer-motion + React 19 / Next 16** — verify version compat at install; fall back to CSS reveals if incompatible.

# Bapita v3 — Full Design Audit & Redesign Recommendations

**Generated**: 2026-06-29
**Scope**: Every visual element — sections, layout, feeling, fonts, colors, animations, spacing, interactions

---

## 0. Current State Summary

Bapita v3 uses:
- **Typeface**: Heebo (Google Font) — clean, rounded Hebrew/Latin sans
- **Palette**: Ink (#1e1a14) + Cream (#fbf7f1) — warm, earthy minimal
- **Accents**: 5 product colors — Booking (orange), Social (indigo), SEO (green), Outreach (teal), Bots (amber)
- **Radius**: 0.875rem cards, 9999px pills — soft modern
- **Shadows**: `shadow-soft` — very subtle (0 1px 3px rgba(30,26,20,0.06))
- **Animation**: `Reveal` component — fade-up on scroll, single stagger delay
- **Layout**: Max-w-7xl centered, 5px/8px padding, stacked sections
- **Sections**: Nav → Hero → Social-proof → Products-grid → How-it-works → Who-its-for → Pricing → FAQ → Footer

---

## 1. Color System

### Current state

```
Ink:        #1e1a14  (text, dark bg)
Cream:      #fbf7f1  (page bg, light surfaces)
Booking:    #d4622a  (orange)
Social:     #5b5f97  (indigo)
SEO:        #3c7a52  (green)
Outreach:   #1a7a7a  (teal)
Bots:       #e8920a  (amber)
```

### Problems
1. **Cream reads as off-white** — the #fbf7f1 is close to white but feels "dirty" on large areas. Needs more warmth or more intentional styling.
2. **Ink contrast ratio** — #1e1a14 on #fbf7f1 passes WCAG AA for body text but fails for smaller / lighter weights. The `text-cream/55` and similar opacity tokens create readability issues.
3. **5 accent colors lack hierarchy** — on a page with all 5, it feels chaotic because each card competes for attention.
4. **No surface / muted tokens** — there's no true gray for borders, secondary text, disabled states. Current borders use `ink/[0.08]` opacity which looks muddy on cream.
5. **No brand gradient** — every hero on the market uses a gradient or color transition. Bapita has flat ink bg. Feels dark and heavy.

### Recommendations

**A. Introduce a true surface hierarchy**

Instead of opacity hacks, add explicit tokens:

```css
/* New surface tokens */
--color-surface: #ffffff;           /* Cards, sections that need contrast */
--color-muted: #f2ede6;            /* Alternate section bg, slightly warmer */
--color-border: #e5dfd6;           /* Subtle borders (replaces ink/[0.08]) */
--color-text-secondary: #7a7268;   /* 55% opacity replacement — solid */
--color-text-tertiary: #a39b91;    /* 35% opacity replacement — solid */
```

This gives clean, intentional layering instead of floating on opacity.

**B. Add a brand gradient for hero/footer**

```css
--gradient-hero: linear-gradient(135deg, #1e1a14 0%, #2d2821 50%, #1e1a14 100%);
--gradient-accent: linear-gradient(135deg, #d4622a, #e8920a); /* warm orange→amber */
```

Gradient in hero creates depth. Flat ink = dead.

**C. Accent color usage rule**

On the homepage: only show the accent color of the *primary featured product*. The rest use neutral styling until hover. This creates a visual narrative instead of a rainbow explosion.

**D. Product accent → pastel wash**

Replace direct accent colors with washed versions for bg:

```css
--color-booking-wash: #f8eee6;   /* light orange bg */
--color-social-wash:  #eeeff6;   /* light indigo bg */
--color-seo-wash:     #edf3ef;   /* light green bg */
--color-outreach-wash:#e6f2f2;   /* light teal bg */
--color-bots-wash:    #fdf4e2;   /* light amber bg */
```

---

## 2. Typography

### Current state

- **Font**: Heebo (Google Font) — variable weight
- **Headings**: `font-extrabold`, `tracking-tight`, `leading-[1.04]`
- **Sizes**: `text-display-xl` (3.5rem / 56px) on hero, `text-display-lg` (not defined as token, likely ~2.5rem) on section headers
- **Body**: `text-lg` (18px) in hero, `text-[0.9rem]` in cards, `text-sm` in metadata
- **Uppercase labels**: `text-xs font-bold uppercase tracking-[0.16em]` — small section labels

### Problems
1. **Heebo works for Hebrew, less distinctive for English** — the English characters are clean but not memorable. It blends into the sea of similar Google sans.
2. **No type scale system** — sizes are hardcoded inconsistently (`text-[1.05rem]`, `text-[0.9375rem]`, `text-[0.9rem]`). No coherence.
3. **Display XL at 3.5rem** — on desktop this is fine, on mobile it shrinks via nothing (no responsive size adjustments in CSS).
4. **Line height on hero heading** — `leading-[1.04]` is very tight. For a 56px font, that's ~58px. Creates visual tension especially with multi-line text.
5. **Body text too large in hero** — `text-lg` (18px) is big for a paragraph. Combined with `leading-relaxed` it takes up too much vertical space.
6. **No font for data/numbers** — no monospace or display face for pricing figures, stats, counts.

### Recommendations

**A. Add a display / heading font with character**

```css
--font-display: "Instrument Serif", Georgia, serif;
/* or "Playfair Display", "DM Serif Display", "Sora" */
```

Use a serif or elevated sans for headings to create contrast with Heebo body text. This gives the brand a premium, editorial feel vs. the "generic startup" look.

Pairing: **Instrument Serif** (headings) + **Heebo** (body) = warm, human, premium.

**B. Create a proper type scale**

```css
/* Fluid type scale using clamp() */

--text-hero:    clamp(2.5rem, 6vw, 4.5rem);     /* 40px → 72px */
--text-h1:      clamp(2rem, 4vw, 3rem);          /* 32px → 48px */
--text-h2:      clamp(1.5rem, 3vw, 2.5rem);      /* 24px → 40px */
--text-h3:      clamp(1.125rem, 2vw, 1.375rem);  /* 18px → 22px */
--text-body:    1rem;                             /* 16px fixed */
--text-small:   0.875rem;                         /* 14px */
--text-xs:      0.75rem;                          /* 12px */
--label:        0.6875rem;                        /* 11px uppercase */

--leading-display: 1.04;    /* headings only */
--leading-tight:    1.2;    /* subheadings */
--leading-normal:   1.6;    /* body */
```

**C. Headings → variable weight for texture**

Use a mix of weights in headings, not just `font-extrabold` everywhere:

```css
/* Section headers: */
"Five tools, one toolkit." → font-medium or font-normal display face

/* Hero: */
"Stop wrestling with software." → font-bold (not extrabold)
"We build and run your business tools" → font-normal / italic
"— so you don't have to." → font-semibold
```

Weight variation creates rhythm. Uniform extrabold is shouty.

**D. Remove hardcoded rem values**

Replace all `text-[1.05rem]`, `text-[0.9375rem]`, `text-[0.9rem]` with semantic tokens. This cleans up the codebase and ensures consistency.

---

## 3. Layout & Spacing

### Current state

- **Container**: `max-w-7xl` (1280px) centered
- **Padding**: `px-5` mobile, `px-8` sm+
- **Section spacing**: `py-24` (96px) / `py-32` (128px)
- **Grid columns**: `sm:grid-cols-2 lg:grid-cols-3` for product cards
- **Content max-widths**: `max-w-2xl` / `max-w-3xl` for section headers

### Problems
1. **All sections same spacing** — no rhythm. Every section is py-24 sm:py-32. Feels like a checklist, not a narrative.
2. **Content never breaks the grid** — no full-bleed elements, no off-grid hero images, no overlapping elements. Every section is a straight column.
3. **Max-w-7xl too wide** — 1280px with 5px padding = 1270px content. For a single-column text-heavy site, this is too wide. Lines are long.
4. **No visual anchors between sections** — no color transitions, no dividers with personality, no "bookend" feel.
5. **Cards too dense** — 3-column grid at 1280px = ~400px per card. Text-heavy cards at that width look sparse. Tall rectangles with lots of white space.

### Recommendations

**A. Create a rhythm pattern**

```
Hero:         pt-28 pb-24 sm:pt-36 sm:pb-32  →  "tall start"
Social-proof: py-5                            →  "thin seam"
Products:     py-24 sm:py-28                  →  "main content"
How-it-works: py-24 sm:py-28                  →  "main content"
Who-its-for:  py-24 sm:py-28                  →  "main content"
Pricing:      py-24 sm:py-24                  →  "shorter"
FAQ:          py-20 sm:py-24                  →  "tapered end"
Footer:       py-14                           →  "grounded"
```

Each section has a different height based on its role. The page breathes.

**B. Add 1-2 full-bleed or broken-grid moments**

- Hero: full-bleed background color, with content constrained but a visual element (screenshot, abstract shape) that breaks out of the container
- Social-proof: full-bleed marquee (already done — keep)
- Between sections: add a thin full-bleed color block or border treatment

**C. Narrow content widths for readability**

Section headers max at `max-w-xl` (576px) not `max-w-2xl` (672px). Body content max at `max-w-2xl`. This keeps line lengths at ~60–75 characters for comfortable reading.

**D. Use asymmetric layouts**

Not every section needs centered text. Alternate:

```
Section 1: text-left, image right
Section 2: image left, text-right (or centered)
Section 3: centered text, cards below
```

Pattern: left → center → split → center creates visual interest.

**E. Card layout improvements**

- 2-column grid on desktop for pricing (not 3) — cards are wider, less vertical scrolling
- For product cards: use `sm:grid-cols-2` and make the first card span full width to feature Book
- Card padding: `p-8` instead of `p-6` — more breathing room

---

## 4. Feeling & Atmosphere

### Current feeling: "Clean but cold"

The site reads as a functional checklist. It doesn't evoke any emotion. The dark hero with cream text feels safe but not inviting.

### Target feeling: "Warm, human, capable"

Bapita's value proposition is "we do it for you." The site should feel:
- **Warm** — like a person, not a dashboard
- **Capable** — professional, trustworthy
- **Simple** — uncluttered, clear
- **Human** — real business owners, real results

### How to evoke this

1. **Warmth through texture** — add subtle grain or noise overlay on hero sections. Use warm gradients, not flat colors.
2. **Humanity through photography** — NOT stock photos of people smiling at laptops. Use:
   - Real product screenshots (blurred/annotated "Your name here")
   - Physical textures (paper, hand-drawn elements, organic shapes)
   - If photos: close-cropped, high-contrast, warm-toned
3. **Capability through precision** — tight spacing, clear hierarchy, no orphans. Every element looks intentional.
4. **Simplicity through restraint** — if an element doesn't serve the narrative, remove it.

**Mood board signals:**
- Linear (the issue tracker) — clean, human, warm
- Stripe — precise, trust-building
- Arc — warm gradients, human copy
- Notion — simple, spacious, intentional

---

## 5. Navigation

### Current issues
1. **"Get started" CTA links to #products** — weak. It should link to a booking call or the Book product page.
2. **No visual indicator of scroll position** — user doesn't know where they are on the page.
3. **Nav too tall** — 64px (h-16) for a sticky nav is bulky. Could be 56px.
4. **No background on scroll** — `bg-cream/80 backdrop-blur-md` is fine but the border-bottom is barely visible. Needs more presence when scrolled.
5. **No CTA differentiation** — "Get started" looks like any other button. Need stronger visual weight.

### Recommendations
1. **Reduce to 3 links**: Products, Pricing, FAQ. "How it works" is a section within the page, not a distinct navigation target.
2. **Primary nav CTA**: "Book a call" → opens Calendly / external booking, not an anchor link. Solid button, distinct from all other page CTAs.
3. **Add scroll-progress indicator** (you already have `scroll-progress.tsx` — use it) at the very top of the page, thin (2px), accent color.
4. **Nav background**: On scroll past hero, add a more opaque background (`bg-cream/95`) with stronger shadow (`shadow-sm`).
5. **Nav height**: 56px (h-14) — saves 8px, feels tighter.
6. **Active link indicator**: A small dot below the active section's nav link (using Intersection Observer).

---

## 6. Hero Section

### Current issues
1. **Flat ink background** — dark, heavy, no depth
2. **No visual element** — 100% text. No screenshot, no illustration, no mockup.
3. **Copy too generic** — "Run your business online" could be 10,000 companies.
4. **Two CTAs** — "See the tools" and "How it works." Neither is action-oriented. Neither drives conversion.
5. **No numbers, no proof** — no trust elements in the first viewport.

### Redesign concept

```html
<!-- Structure -->
<section>                                  <!-- Full bleed ink gradient -->
  <div>                                    <!-- Inner container max-w-7xl -->
    <div>                                  <!-- Left column (text) -->
      <!-- Eyebrow: Now live → Badge -->
      <Badge>Bapita Book · Now live</Badge>

      <!-- Headline → Display font, weight variation -->
      <h1>Stop wrestling with booking software.</h1>
      <p class="sub">We build your booking page, set up reminders, connect payments — and you start taking appointments in 48 hours.</p>

      <!-- Primary CTA → Only one -->
      <Button>Book a free call →</Button>

      <!-- Micro-trust: tiny stat line -->
      <p class="trust-line">Used by barbers, clinics, coaches, and 30+ other business types.</p>
    </div>

    <div>                                  <!-- Right column (visual) -->
      <!-- Mockup screenshot of booking page → blurred edges, shadow -->
      <img src="/mockups/booking-page.png" alt="Bapita Book booking page preview" />

      <!-- Floating badge: "Set up in 48h" -->
      <div class="floating-badge">⚡ Set up in 48 hours</div>
    </div>
  </div>
</section>
```

### Visual treatments
- **Gradient background**: `linear-gradient(135deg, #1e1a14 0%, #2d2821 50%, #1e1a14 100%)`
- **Mockup**: Rounded corners (12px), large shadow, slight perspective or tilt, background that fades into the hero gradient
- **Headline**: Display face (Instrument Serif), light weight (`font-light` or `font-normal`), white
- **Sub-headline**: Heebo, `font-normal`, cream/70 opacity
- **Primary CTA**: Button with gradient bg (orange → amber), white text, `hover:shadow-lg` and `hover:-translate-y-0.5`
- **Animation**: Stagger in — badge (0ms), headline (100ms), sub (200ms), mockup (300ms) with subtle scale-in + fade-up for the mockup

---

## 7. Social Proof Section

### Current state
- Marquee of category names (Barbershops, Salons...)
- Very thin (py-5)
- No numbers

### Recommendations
1. **Add a number** — "Join X businesses already using Bapita Book" (or remove the counter if you don't have it yet, but keep the language aspirational)
2. **Use real business names** if available. If not, use categories but with "families" styling
3. **Add a subtle animated gradient** to the marquee — slowly shifting between product accent colors
4. **Make it thicker** — py-8 instead of py-5, larger text
5. **Add a pause-on-hover** behavior to the marquee (CSS animation-play-state)

---

## 8. Products Grid → Problem/Solution Section

### Current issues
1. **Five cards with equal weight** — user sees 5 options and leaves
2. **4/5 products are "Coming Soon"** — user may think "this is vaporware, I'll check back never"
3. **Features as bullet points** — generic, doesn't sell

### Redesign: Showcase Book + Tease the suite

**Two-tier design**:

**Tier 1: Book (featured, full-width card)**
```
┌──────────────────────────────────────────────┐
│  ★ NOW LIVE                                   │
│                                               │
│  Bapita Book                                  │
│  Your own booking site in 48 hours.           │
│  We do everything: setup, branding, reminders, │
│  payments. You just share the link.            │
│                                               │
│  [Book a free call →]    [See a demo →]       │
│                                               │
│  ✅ No setup required    ✅ 48h turnaround    │
│  ✅ WhatsApp reminders   ✅ Online payments   │
└──────────────────────────────────────────────┘
```

**Tier 2: Coming soon (smaller, teaser cards)**
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Social       │  │ SEO          │  │ Outreach     │  │ Bots         │
│ Coming Q3    │  │ Coming Q4    │  │ Coming Q4    │  │ Early access │
│ [Get notified]│  │ [Get notified]│  │ [Get notified]│  │ [Get notified]│
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

This makes Book feel real and the rest feel like a roadmap, not vaporware.

---

## 9. How It Works Section

### Current state
- 3-step layout (01, 02, 03)
- Dark background, cream text
- Number + title + body text
- No visuals

### Recommendations
1. **Add icons** — each step gets a simple illustration (icon + abstract shape). Breaks up text.
2. **Show a "live example"** — step 1 shows a browser with Bapita dashboard, step 2 shows a loading/checkmark transition, step 3 shows a customer-facing booking page.
3. **Connect the steps visually** — a thin line or progress bar connecting 01 → 02 → 03
4. **Add hover animation** — each step card lifts (`-translate-y-1`) and shows a subtle accent border on the left
5. **Background**: Keep dark (`bg-ink`) but add a subtle radial gradient highlight behind the middle step — draws the eye through the narrative

---

## 10. "Who It's For" Section

### Current state
- Tabs on left, product recommendations on right
- Functional, clean
- No visual distinction for "best match"

### Recommendations
1. **Show an icon for each business type** — barber (scissors icon), clinic (heart/cross), etc.
2. **Badge for "best match"** — e.g., if the user selects "Barber / Salon", the Book tab gets a small "⭐ Best match" badge
3. **Add a count/size indicator** — "Used by 300+ barbershops" under the label
4. **Animation**: On tab switch, stagger the product cards in with a slight delay per card. Currently they just swap instantly.
5. **Mobile**: The tab + cards layout should stack vertically on mobile (tab selector on top, cards below). Currently might work but verify.

---

## 11. Pricing Section

### Current state
- 3-column grid on lg, 2 on sm
- Each product card has pricing note, features, CTA
- Notify form for coming-soon products
- "Live" badge vs "Coming soon" badge

### Problems
1. **"Coming soon" badges kill conversions** — user sees "Coming soon" and stops reading
2. **No pricing amounts shown** — "From $29/mo" is vague. Show actual numbers.
3. **No comparison to competitors** — "vs Calendly at $16/seat + setup time" would sell
4. **Pricing before trust** — user hasn't seen testimonials or proof yet

### Recommendations
1. **Feature Book pricing only** — it's the one live product. Give it a proper pricing card with tiers (maybe a single plan at $29/mo). The other products show "Coming Q3 2026" with notify form.
2. **Add a comparison element** — a small table or callout: "vs setting up Calendly yourself (45 min + config) → Bapita: tell us what you need, we do it."
3. **Pricing card visual**: Add a subtle accent top border or accent shadow to make the live pricing card pop.
4. **Annual discount highlight**: If offering annual, show "Save 2 months" tag.
5. **Remove the generic "From $X/mo"** — be specific or don't say it.

---

## 12. FAQ Section

### Current state
- Accordion pattern, clean
- 7 questions, well-written

### Recommendations
1. **Add a search bar** — for longer FAQ sections, search helps. For 7 questions, maybe overkill. But could add a simple filter.
2. **Stagger the open animation** — when clicking an item, the content should ease in with a subtle height transition (current: max-h transition, smooth enough).
3. **Add anchor links** — each FAQ `<dt>` should have an id so you can link to `#faq-3`. Good for support emails.
4. **Visual divider**: Lightweight line between items (already done with border-b). But add a subtle `+` / `−` icon animation (rotate the plus by 45 degrees to become an X or minus).
5. **Consider an "expand all" toggle** — low priority but useful for readers who want to Cmd+F through content.

---

## 13. Footer

### Current state
- 3-column layout: brand + products + company links
- Dark ink bg with cream text
- Minimal

### Recommendations
1. **Add social icons** — Instagram, LinkedIn, Twitter/X. Even if accounts are new, placeholders build trust.
2. **CTA in footer** — "Ready to get started? [Book a free call →]" — a small section above the footer links.
3. **Product status indicators** — small colored dots next to product names (green = live, amber = soon) so users can scan.
4. **Newsletter signup** — minimal email input + "Subscribe" button. Shows you're building a following.
5. **Better brand block** — include a short brand mark + 1 sentence + social links in a tight block.

---

## 14. Colors — Detailed Token System

### Current design tokens (in globals.css)

```css
@theme inline {
  --color-ink: #1e1a14;
  --color-cream: #fbf7f1;
  --color-booking: #d4622a;
  --color-social: #5b5f97;
  --color-seo: #3c7a52;
  --color-outreach: #1a7a7a;
  --color-bots: #e8920a;
  --shadow-soft: 0 1px 3px rgba(30, 26, 20, 0.06), 0 1px 2px rgba(30, 26, 20, 0.04);
  --text-display-xl: 3.5rem;
}
```

### Recommended token set

```css
@theme inline {
  /* Brand */
  --color-ink: #1e1a14;
  --color-ink-light: #2d2821;
  --color-cream: #fbf7f1;
  --color-cream-dark: #f2ede6;
  --color-surface: #ffffff;
  --color-border: #e5dfd6;
  --color-border-light: #f0ebe4;

  /* Text */
  --color-text: #1e1a14;
  --color-text-secondary: #7a7268;
  --color-text-tertiary: #a39b91;
  --color-text-disabled: #c4bcb2;

  /* Product accents */
  --color-booking: #d4622a;
  --color-booking-wash: #f8eee6;
  --color-social: #5b5f97;
  --color-social-wash: #eeeff6;
  --color-seo: #3c7a52;
  --color-seo-wash: #edf3ef;
  --color-outreach: #1a7a7a;
  --color-outreach-wash: #e6f2f2;
  --color-bots: #e8920a;
  --color-bots-wash: #fdf4e2;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #1e1a14 0%, #2d2821 50%, #1e1a14 100%);
  --gradient-cta: linear-gradient(135deg, #d4622a, #e8920a);
  --gradient-divider: linear-gradient(90deg, transparent, #e5dfd6, transparent);

  /* Shadows */
  --shadow-soft: 0 1px 3px rgba(30, 26, 20, 0.06), 0 1px 2px rgba(30, 26, 20, 0.04);
  --shadow-lift: 0 10px 25px rgba(30, 26, 20, 0.08), 0 4px 10px rgba(30, 26, 20, 0.04);
  --shadow-card: 0 1px 4px rgba(30, 26, 20, 0.04), 0 8px 24px rgba(30, 26, 20, 0.06);

  /* Typography */
  --font-sans: var(--font-heebo), ui-sans-serif, system-ui, sans-serif;
  --font-display: "Instrument Serif", Georgia, serif;

  /* Fluid type */
  --text-hero: clamp(2.5rem, 6vw, 4.5rem);
  --text-h1: clamp(2rem, 4vw, 3rem);
  --text-h2: clamp(1.5rem, 3vw, 2.5rem);
  --text-h3: clamp(1.125rem, 2vw, 1.375rem);

  /* Radii */
  --radius-card: 0.875rem;
  --radius-pill: 9999px;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;

  /* Spacing (not in theme, but use consistently) */
  /* section-padding: clamp(4rem, 8vw, 8rem) */
}
```

---

## 15. Animations & Interactions

### Current state
- `Reveal` component: translate-y-6 + opacity 0 → 0/1 on scroll
- 700ms duration, ease-out
- Stagger via `delay` prop (multiples of 60ms / 80ms)

### Problems
1. **Single animation for everything** — no variety. Every section fades up the same way.
2. **No hover states beyond shadows** — cards use `hover:shadow-lift` but no micro-interactions
3. **No page-load entrance** — everything triggers on scroll, nothing on initial load
4. **No micro-animations** — buttons don't respond beyond basic CSS

### Recommendations

**A. Animation vocabulary**

Create 3 animation types:

| Type | Use | CSS |
|------|-----|-----|
| `fade-up` | Section headers, text blocks | translateY(24px) → 0, opacity 0→1, 700ms ease-out |
| `scale-in` | Cards, images, screenshots | scale(0.95) → 1, opacity 0→1, 500ms ease-out |
| `slide-in` | Side elements, stats, badges | translateX(±20px) → 0, opacity 0→1, 600ms ease-out |

Each section uses a different animation type for its main content:

```
Hero:         scale-in (mockup), fade-up (text)
Products:     scale-in (cards), stagger by index (50ms)
How-it-works: slide-in from left (step 1), center (step 2), right (step 3)
Who-its-for:  fade-up (tabs), scale-in (cards on tab switch)
Pricing:      scale-in (cards)
FAQ:          fade-up (items), stagger by 80ms
```

**B. Page-load sequence**

On first visit (not on subsequent same-page navigation), stagger the hero elements:

```
0ms:    Navigation (slide down)
100ms:  Badge / eyebrow (fade-up)
200ms:  Headline (fade-up)
350ms:  Sub-text (fade-up)
500ms:  Mockup (scale-in + fade-up)
700ms:  CTA buttons (fade-up)
```

Use `useEffect` on mount for this, not intersection observer.

**C. Hover micro-interactions**

```css
/* Button hover */
.btn-primary {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 98, 42, 0.25);
}

/* Card hover */
.product-card {
  transition: transform 250ms ease, box-shadow 250ms ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(30, 26, 20, 0.08);
}

/* Link underline animation */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-booking);
  transition: width 250ms ease;
}
.nav-link:hover::after {
  width: 100%;
}
```

**D. Scroll-triggered parallax (subtle)**

For the hero mockup: on scroll, move the mockup up at 50% of scroll speed (parallax). Creates depth.

For section dividers: a subtle background shift or gradient reveal as user scrolls (use `background-position` animation).

**E. Button press effect**

```css
.btn-primary:active {
  transform: scale(0.97);
}
```

**F. Loading transitions**

If any async content loads (notify form submission, etc.), add a simple skeleton or pulse animation rather than hard state switches.

---

## 16. Dividers & Section Transitions

### Current state
- Each section just starts where the last ended
- No visual separation except background color changes (`bg-ink`, `wash-cream`, `bg-surface`)

### Recommendations

**A. Section transition treatments**

Use 3 types:

1. **Color shift** — alternating between cream, white, cream-dark, ink. Creates natural separation.
   ```
   Hero:          bg-ink (dark)
   Social-proof:  bg-surface (white)
   Products:      wash-cream (light cream)
   How-it-works:  bg-ink (dark)
   Who-its-for:   wash-cream (light cream) 
   Pricing:       wash-cream → switch to bg-surface
   FAQ:           bg-surface
   Footer:        bg-ink
   ```

2. **Decorative divider** — a thin, centered line between sections that fades in on scroll:
   ```css
   /* Add a subtle gradient line between sections */
   .section-divider {
     height: 1px;
     background: linear-gradient(90deg, transparent, var(--color-border), transparent);
     max-width: 200px;
     margin: 0 auto;
   }
   ```

3. **Background noise/grain** — add a subtle noise texture to dark sections (hero, how-it-works, footer):
   ```css
   /* Add as a pseudo-element overlay */
   .bg-noise::before {
     content: '';
     position: absolute;
     inset: 0;
     opacity: 0.03;
     background-image: url("data:image/svg+xml,...noise pattern...");
     pointer-events: none;
   }
   ```

**B. Transition animation between sections**

When a section scrolls into view, its divider line draws from center outward (width: 0 → 200px). Small detail, high perceived polish.

---

## 17. Mobile-Specific Issues

### Current state
- Responsive but not optimized
- Same layout stack, just narrower

### Identified problems
1. **Hero heading wraps awkwardly** — "Run your business online. No agency needed." on mobile becomes 3-4 lines.
2. **Product cards stack full-width** — on mobile, 5 cards in a single column = very long page.
3. **"Who it's for" layout** — on mobile, the tabs become a vertical list, which is fine, but the recommended tools sit below the fold.
4. **Navigation hamburger** — functional but plain. No animation on open/close.
5. **CTA buttons full-width on mobile** — good. Keep.
6. **Marquee on mobile** — the social proof marquee works but the text is small. Could be larger on mobile.

### Recommendations
1. **Mobile hero**: 
   - Shorten headline to 1-2 lines: "Stop wrestling with booking software." (sub-text explains)
   - No mockup on mobile (or a smaller, simplified version below the fold)
   - Stack vertically: text → CTA → trust line
2. **Mobile nav**: Animate the hamburger to a close X with rotation (already have Menu/X icons, but add a rotation animation on toggle)
3. **Mobile spacing**: Reduce section padding to `py-16` on mobile (from `py-24`). Too much vertical space on small screens.
4. **Mobile font sizes**: Body text at 16px minimum (not `text-lg` which is 18px). Headings scale down via clamp().

---

## 18. Summary: Redesign Priority Matrix

| Priority | Change | Effort | Impact | Section |
|----------|--------|--------|--------|---------|
| P0 | Rewrite hero copy + add mockup screenshot | Medium | Very High | Hero |
| P0 | Feature Book only as primary product | Low | Very High | Products |
| P0 | Replace 5-card grid with 1 featured + 4 teasers | Medium | Very High | Products |
| P1 | Add gradient + texture to hero background | Low | High | Hero |
| P1 | Add hover micro-interactions (cards, buttons, links) | Low | High | Global |
| P1 | Add page-load entrance animation sequence | Medium | High | Hero |
| P1 | Change "Book a call" as primary CTA everywhere | Low | High | Global |
| P1 | Add proper surface/color token system | Medium | High | Design System |
| P1 | Add testimonials section with real photos | High | Very High | New Section |
| P2 | Add Instrument Serif for headings | Low | Medium | Design System |
| P2 | Add fluid type scale with clamp() | Medium | Medium | Design System |
| P2 | Different animation types per section | Medium | Medium | Global |
| P2 | Mobile spacing/typography optimization | Medium | Medium | Mobile |
| P2 | Section transition dividers | Low | Medium | Global |
| P2 | Social footer icons + newsletter signup | Low | Medium | Footer |
| P3 | Parallax on hero mockup | Medium | Low | Hero |
| P3 | Scroll-position nav background change | Low | Low | Nav |
| P3 | FAQ anchor links + expand animation | Low | Low | FAQ |
| P3 | Noise texture on dark sections | Low | Low | Design System |

---

## 19. Before/After Feeling Comparison

| Dimension | Before | After |
|-----------|--------|-------|
| **First impression** | "Generic dark SaaS" | "Warm, human, premium" |
| **Trust** | No proof, no testimonials | Real businesses, real screenshots |
| **Clarity** | "5 tools, pick one" | "1 tool works now, more coming" |
| **Urgency** | None | "Live in 48 hours. Book a call." |
| **Visual depth** | Flat colors throughout | Gradients, shadows, textures |
| **Typography** | Uniform extrabold | Varied weights, serif + sans pair |
| **Animation** | One pattern everywhere | Choreographed, purposeful |
| **Mobile** | Long scroll, tight text | Compact, readable, fast |
| **Brand memorability** | Low | High (warm, distinct, human) |
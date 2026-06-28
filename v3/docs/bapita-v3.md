# Bapita v3 — Multi-Product Platform Strategy
**Positioning · Product Architecture · Visual Identity · Go-To-Market**
*June 2026 — From single-product agency to multi-product SaaS platform*

---

## Table of Contents
1. [Strategic Pivot](#1-strategic-pivot)
2. [Product Architecture](#2-product-architecture)
3. [Visual Identity System](#3-visual-identity-system)
4. [Per-Product Brand Identities](#4-per-product-brand-identities)
5. [Master Brand — bapita.com](#5-master-brand---bapitacom)
6. [Design System](#6-design-system)
7. [Technical Architecture](#7-technical-architecture)
8. [Copy & Voice](#8-copy--voice)
9. [Go-To-Market](#9-go-to-market)
10. [Open Decisions & Questions](#10-open-decisions--questions)

---

## 1. Strategic Pivot

### From v2 (Current)
- Single product: Booking platform
- Target: Israeli barbers, salons & appointment businesses
- Model: Done-for-you agency (build in 48h, manage monthly)
- Market: Israel only
- Positioning: "Built for you. Runs without you."

### To v3 (New)
- Multi-product: Family of 5 digital tools for SMBs
- Target: SMBs globally (Shopify stores, agencies, freelancers, clinics, barbers)
- Model: Self-serve SaaS per product, separate subscriptions
- Market: Global (English-first, Hebrew later)
- Positioning: "Tools that run your business online. Pick yours."

### Why
- Expand TAM beyond Israeli appointment businesses
- Each product serves a distinct need with its own market
- Products reinforce each other (cross-sell across the suite)
- SaaS model scales better than agency model
- Brand name "Bapita" is strong enough to carry a suite

### What Changes
| Aspect | v2 | v3 |
|--------|----|----|
| Products | 1 (Booking) | 5 (Book, Social, SEO, Outreach, Bots) |
| Target | Israeli barbers/salons | Global SMBs |
| Model | Agency (done-for-you) | SaaS (self-serve + setup) |
| Pricing | ₪200-1,690/mo | $X/mo per product |
| Language | Hebrew-first | English-first |
| bapita.com | Booking LP | Master brand product hub |
| Book.bapita.com | — (was bapita.com) | Dedicated booking LP |

### What Stays
- Brand palette (terra cotta, cream, amber, warm charcoal)
- Heebo typography
- Voice (direct, warm, peer-to-peer)
- Visual language (editorial, warm, premium)

---

## 2. Product Architecture

### Subdomain Structure

```
bapita.com              → Master brand page (product hub)
├── book.bapita.com     → Appointment booking platform
├── social.bapita.com   → Social media management
├── seo.bapita.com      → SEO tools suite
├── outreach.bapita.com → Link building & outreach
└── bots.bapita.com     → AI chatbots (WhatsApp, Telegram)
```

### Product Maturity

| Product | Status | Priority | Team |
|---------|--------|----------|------|
| Book | ✅ Live (mature, paying customers) | 1 - Core revenue | Existing |
| Social | 🚧 In development (under construction on social-ops-platform) | 2 - Next launch | Current |
| SEO | 📋 Planned | 3 | — |
| Outreach | 📋 Planned | 4 | — |
| Bots | 💡 Concept | 5 (earliest) | — |

### Each Product Is
- **Independent** — separate subdomain, separate subscription, separate dashboard
- **Self-serve** — sign up, pay, use. No 48h build.
- **Different visual identity** — own accent colour, own sub-brand feel, but same brand family
- **Cross-sell opportunity** — dashboard shows companion products, works best together

### Pricing Model (per product)
- Monthly subscription per product ($X/mo)
- No lock-in, cancel anytime
- Annual discounts available (2 months free)
- Each product may have tiers (e.g., Book: Starter / Pro / Agency)

---

## 3. Visual Identity System

### Master Brand Palette (inherited from v2, unchanged)

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (terra cotta) | `#D4622A` | Logo, primary buttons, book.bapita.com brand |
| Accent (amber) | `#E8920A` | social.bapita.com brand, secondary CTAs, highlights |
| Dark (warm charcoal) | `#1C1917` | Headline text, footer backgrounds |
| Text body | `#2D2821` | Body copy |
| Text muted | `#6B6052` | Secondary text, labels |
| Background (cream) | `#F8F4EE` | Page background |
| Background (sand) | `#FDF0E4` | Wash backgrounds, gradient bases |
| Background light | `#FBF9F4` | Card surfaces |
| Surface | `#FFFFFF` | Cards, modals, elevated surfaces |
| Border | rgba(30,26,20,0.09) | Dividers, card borders |
| Shadow base | rgba(30,26,20) | All shadow colors (warm, not gray) |

### Gradient Washes
```css
wash-amber:    linear-gradient(to bottom, #FDF0E4, #F8F4EE)
wash-sand:     linear-gradient(to bottom, #F8F4EE, #FBF9F4)
wash-terra:    linear-gradient(135deg, #FDF0E4 0%, #F8F4EE 50%, #FEF0E8 100%)
```

### Per-Product Accent Colours

Each product gets its own accent colour. These sit in the same warm natural family — different shades in the same Mediterranean painting.

| Product | Colour | Hex | Vibe | Usage |
|---------|--------|-----|------|-------|
| **Book** | Terra Cotta | `#D4622A` | Warm, trusted, earthy — the original | Primary buttons, badges, product card icon, subdomain brand |
| **Social** | Amber | `#E8920A` | Energetic, warm, social — conversation starter | Icon accents, badges, status indicators |
| **SEO** | Forest Green | `#3C7A52` | Growth, organic, natural — grounded | Icon, accent badges, data viz highlights |
| **Outreach** | Deep Teal | `#1A7A7A` | Depth, expansion, water — reaching out | Icon, accent, link highlights |
| **Bots** | Slate Indigo | `#5B5F97` | Trustworthy, smart, calm — reliable | Icon, chat bubble accents, status |

Each accent comes with a lighter tint for hover states and backgrounds:
```
Book tint:       #FEF0E8
Social tint:     #FEF5E0
SEO tint:        #EAF3EB
Outreach tint:   #E0F0F0
Bots tint:       #EBECF4
```

### Each Product Gets Its Own Visual "Feel"

This is key. Each product is not just a colour swap — it has its own vibe:

| Product | Feeling | Illustration Style | Typography Mood |
|---------|---------|-------------------|-----------------|
| Book | Warm, calm, trusted | Line art with terra-cotta accents | Soft editorial |
| Social | Energetic, bold, playful | Dynamic shapes, amber highlights | Bold, slightly tighter tracking |
| SEO | Grounded, analytical, deep | Organic/natural forms, green | Clean, precise, generous leading |
| Outreach | Expansive, connected, flowing | Water/wave motifs, teal | Open, airy, wide tracking |
| Bots | Sharp, reliable, futuristic | Geometric/clean, indigo | Sleek, modern, monospace touches |

On the master brand page, each product card reflects its own vibe through:
- Its accent colour
- A unique illustration style/icon format
- Typography that hints at its personality
- A one-line tagline that captures its distinct promise

---

## 4. Per-Product Brand Identities

### Product 1: Book (book.bapita.com)
| | |
|---|---|
| **Status** | ✅ Live, paying customers |
| **Colour** | Terra Cotta `#D4622A` |
| **Tagline** | "Your own booking site. Built for you. Runs without you." |
| **One-liner** | Appointment booking platform — your own site, dashboard, and automations. Clients book 24/7, you see everything in one place. |
| **Target** | Barbers, salons, nail techs, clinics, dog groomers, physios |
| **Vibe** | Warm, calm, trusted. The peace of mind of knowing bookings handle themselves. |
| **Hero CTA** | "Get your booking site" |
| **Key Features** | Booking website, owner dashboard, email confirmations, WhatsApp reminders, online payments |
| **Pricing** | TBD (tiered per business size) |
| **History** | This IS the original v2 product. Now spun off to its own subdomain. |

### Product 2: Social (social.bapita.com)
| | |
|---|---|
| **Status** | 🚧 In development (social-ops-platform repo) |
| **Colour** | Amber `#E8920A` |
| **Tagline** | "Post. Schedule. Grow. All in one place." |
| **One-liner** | Social media management for SMBs — schedule posts, generate captions, translate content, manage Instagram & Facebook from one dashboard. |
| **Target** | Shopify stores, agencies, coaches, local businesses with social presence |
| **Vibe** | Energetic, bold, playful. The feeling of having your social on autopilot. |
| **Hero CTA** | "Join the waitlist" (pre-launch) |
| **Key Features** | Post scheduler, AI caption generator, localization/translation, IG/FB integration, content calendar |
| **Current Build** | App at social-ops-platform.vercel.app (in progress, not production) |

### Product 3: SEO (seo.bapita.com)
| | |
|---|---|
| **Status** | 📋 Planned |
| **Colour** | Forest Green `#3C7A52` |
| **Tagline** | "Rank higher. Build authority. Grow organic." |
| **One-liner** | SEO tools for SMBs — keyword research, clustering, SERP analysis, page improvement, content brief generation. Made for non-experts. |
| **Target** | Shopify stores, content creators, agencies, local businesses |
| **Vibe** | Grounded, analytical, natural. The quiet satisfaction of seeing your rankings climb. |
| **Hero CTA** | "Get notified on launch" (email capture) |
| **Key Features** | Keyword research, keyword clustering, SERP analysis, page reviewer/improver, content brief generator |

### Product 4: Outreach (outreach.bapita.com)
| | |
|---|---|
| **Status** | 📋 Planned |
| **Colour** | Deep Teal `#1A7A7A` |
| **Tagline** | "Find leads. Build links. Grow reach." |
| **One-liner** | Link building and outreach automator — find quote opportunities, discover leads, automate follow-ups. Make your backlink profile grow while you work. |
| **Target** | Content marketers, SEOs, agencies, founders doing their own outreach |
| **Vibe** | Expansive, connected, flowing. The momentum of your network growing without manual effort. |
| **Hero CTA** | "Get notified on launch" (email capture) |
| **Key Features** | Link building automation, quote finder, lead finder, automated outreach sequences |

### Product 5: Bots (bots.bapita.com)
| | |
|---|---|
| **Status** | 💡 Concept (earliest) |
| **Colour** | Slate Indigo `#5B5F97` |
| **Tagline** | "Your business never sleeps. Neither do your bots." |
| **One-liner** | AI chatbots for WhatsApp and Telegram — answer FAQs, qualify leads, book appointments. Plug and play, no coding. |
| **Target** | Any business with WhatsApp/Telegram customer flow: clinics, e-commerce, service businesses |
| **Vibe** | Sharp, reliable, futuristic. 24/7 availability that feels human. |
| **Hero CTA** | "Get notified on launch" (email capture) |
| **Key Features** | WhatsApp chatbot, Telegram chatbot, FAQ automation, lead qualification, booking integration |

---

## 5. Master Brand — bapita.com

### Role
The master brand page is a **product hub**. Its job:
1. Introduce the Bapita brand story
2. Show all 5 products as cards
3. Let visitors pick the tool(s) they need
4. Drive traffic to individual product subdomains
5. Build trust through social proof, clarity, and warmth

### Page Structure

```
┌─────────────────────────────────────┐
│ Navigation                           │
│ Logo  [Products ▼] Pricing About  [Get started] │
├─────────────────────────────────────┤
│ Promise: Pick your tool.             │
│ Sub: "A set of professional digital tools for SMBs." │
│ [Book] [Social] [SEO] [Outreach] [Bots] — pills      │
│ CTA: "Explore tools ↓"                               │
├─────────────────────────────────────┤
│ Products Grid: 5 cards              │
│ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │ Book │ │Social│ │ SEO  │          │
│ │ Terra│ │Amber │ │Green │          │
│ └──────┘ └──────┘ └──────┘          │
│ ┌──────┐ ┌──────┐                   │
│ │Outrch│ │ Bots │                   │
│ │ Teal │ │Indigo│                   │
│ └──────┘ └──────┘                   │
├─────────────────────────────────────┤
│ How It Works: 3 steps               │
│ Pick → Set Up → Run                 │
├─────────────────────────────────────┤
│ Who It's For: Business type grid    │
├─────────────────────────────────────┤
│ Pricing: Per-product CTA blocks     │
├─────────────────────────────────────┤
│ FAQ                                  │
├─────────────────────────────────────┤
│ Footer                               │
└─────────────────────────────────────┘
```

### Each Product Card Contains
- Small illustration/icon in product's accent colour
- Product name (bold, Heebo)
- One-line tagline
- 3 bullet features
- Badge: "Live" or "Coming soon" or "In development"
- "Learn more →" link to subdomain
- Card hover: subtle lift + accent glow

### Trust & Social Proof Section
- "Trusted by [X] businesses"
- Client logo cloud or placeholder
- Optional metrics: appointments booked, posts scheduled, etc.

### Who It's For Section
Grid of SMB types, each showing which products fit:
- Barber / Salon → Book, Social
- Shopify / e-commerce → Social, SEO, Outreach
- Marketing agency → Social, SEO, Outreach, Bots
- Clinic / practice → Book, Bots
- Freelancer / coach → Book, Social
- Any SMB → pick what you need

### Pricing Section (Master Page)
- No specific prices shown on master page
- Each product section has its own CTA:
  - Book: "See plans →" (links to book.bapita.com/pricing)
  - Social: "Coming soon — get notified"
  - Others: "Coming soon — get notified"
- Email capture form for pre-launch products

---

## 6. Design System

### UI Components (shared across all products)

| Component | Style |
|-----------|-------|
| Buttons | Filled primary colour, bold Heebo 700, 14px+ vertical padding, 12px radius, warm shadow |
| Cards | Warm cream or white bg, subtle warm shadow, 16px radius, no harsh borders |
| Badges | Rounded-full, 8px px-3 py-1, accent colour bg-light, accent colour text |
| Pills/Tags | Rounded-full, 24px+ height, thin border, accent colour text on hover |
| Inputs | Clean, no dropshadow, clear focus state in terra cotta |
| Dividers | Thin rule in rgba(30,26,20,0.09) |

### Typography Scale

| Level | Size | Weight | Leading |
|-------|------|--------|---------|
| H1 (hero) | clamp(2.5rem, 5vw, 4rem) | 800 | 1.1 |
| H2 (section) | clamp(1.75rem, 3.5vw, 2.75rem) | 700 | 1.2 |
| H3 (card title) | clamp(1.25rem, 2vw, 1.5rem) | 700 | 1.3 |
| Body large | 1.125rem | 400 | 1.6 |
| Body | 1rem | 400 | 1.6 |
| Body small | 0.875rem | 400 | 1.5 |
| Label/tag | 0.75rem | 600 | 1.3 |
| Caption | 0.75rem | 400 | 1.4 |

### Spacing

| Token | Value |
|-------|-------|
| Section padding | clamp(4rem, 8vw, 8rem) |
| Card padding | 1.5rem |
| Grid gap | 1.5rem |
| Stack gap (vertical rhythm) | 1rem |

### Shadows

```css
shadow-sm:   0 1px 3px rgba(30,26,20,0.06)
shadow-md:   0 4px 12px rgba(30,26,20,0.08)
shadow-lg:   0 8px 24px rgba(30,26,20,0.1)
shadow-xl:   0 12px 36px rgba(30,26,20,0.12)
```

### Animation Principles
- Subtle, purposeful, not gratuitous
- Scroll-triggered fade-in + translateY (10-20px)
- Stagger children (100ms delay per child)
- Hover: card lift translateY(-4px) + shadow-lg
- Link hover: underline or colour shift
- Respect prefers-reduced-motion
- Duration: 300ms ease-out (standard), 500ms for hero

---

## 7. Technical Architecture

### Subdomain Implementation
- Each product is a **separate Next.js app** deployed to its own Vercel project
- OR: all products under a monorepo with Vercel domain routing
- DNS: CNAME each subdomain to respective Vercel deployment

### Master Brand Page (bapita.com)
| | |
|---|---|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + CSS custom properties |
| **Font** | next/font → Heebo (400, 500, 600, 700, 800, 900) |
| **Animation** | Framer Motion (or lightweight CSS) |
| **Analytics** | Plausible |
| **Icons** | Lucide React or custom SVGs |
| **SEO** | Full meta, OG, JSON-LD (SoftwareApplication + Organization) |
| **a11y** | WCAG 2.1 AA (semantic HTML, headings, focus, aria) |

### Shared Design Tokens (CSS Custom Properties)
```css
:root {
  --color-primary: #D4622A;
  --color-accent: #E8920A;
  --color-dark: #1C1917;
  --color-text: #2D2821;
  --color-text-muted: #6B6052;
  --color-bg: #F8F4EE;
  --color-bg-sand: #FDF0E4;
  --color-bg-light: #FBF9F4;
  --color-surface: #FFFFFF;
  --color-border: rgba(30,26,20,0.09);
  --shadow-sm: 0 1px 3px rgba(30,26,20,0.06);
  --shadow-md: 0 4px 12px rgba(30,26,20,0.08);
  --shadow-lg: 0 8px 24px rgba(30,26,20,0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --font-heebo: 'Heebo', sans-serif;
}
```

Per-product accents as their own CSS files or component-level tokens.

### File Structure (master page)
```
app/
  layout.tsx
  page.tsx
  globals.css
  components/
    navigation.tsx
    hero.tsx
    social-proof.tsx
    products-grid.tsx
    product-card.tsx
    how-it-works.tsx
    who-its-for.tsx
    pricing.tsx
    faq.tsx
    footer.tsx
    ui/
      button.tsx
      badge.tsx
      card.tsx
      pill.tsx
  lib/
    products.ts
  hooks/
    use-scroll-progress.ts
public/
  img/
    favicon.ico
    og-image.png
    logo.svg
```

---

## 8. Copy & Voice

### Master Brand Voice Rules

1. **Speak to SMBs, not just barbers.** Widened from v2. "Your business" not "Your barbershop."
2. **Direct, warm, peer-to-peer.** Same v2 voice. Never "platform," "solution," "leverage."
3. **Short sentences. Max 20 words in headlines.**
4. **Loss-frame when applicable.** "Every hour you spend on social is an hour you don't spend on your business."
5. **Use "you" and "we."** Human relationship, not corporate.
6. **Never mention AI in headlines.** AI is the engine. Human outcomes are the brand.
7. **Safe to say yes.** "Pick what you need. Pay for what you use. No lock-in."

### Master Brand Copyblocks

#### Hero
> **Headline:** Tools that run your business online. Pick yours.
> **Subheadline:** A set of professional digital tools for businesses that want to run better online — without hiring an agency or learning complicated software. Use what you need. Pay for what you use.
> **CTA:** Explore tools

#### Products Section
> **Headline:** Pick your tools
> **Sub:** Every business is different. Choose the tools that fit yours.

#### How It Works
> **Headline:** Three steps. That's it.
> **Step 1 — Pick:** Choose the tools your business needs.
> **Step 2 — Set up:** We help you get started. Connect accounts, add your details.
> **Step 3 — Run:** Your business runs better. You focus on what you do best.

#### Pricing Section
> **Headline:** Each tool is a separate subscription. No lock-in. Cancel anytime.
> **Sub:** Start with one. Add more as you grow.

#### Final CTA
> **Headline:** Ready to run your business better?
> **CTA:** Get started

### Per-Product Taglines

| Product | Tagline |
|---------|---------|
| Book | "Your own booking site. Clients book 24/7. You never touch it." |
| Social | "Schedule, post, and grow your social presence — from one place." |
| SEO | "Rank higher with tools that make SEO simple." |
| Outreach | "Find leads, build links, grow your reach — automatically." |
| Bots | "AI chatbots for WhatsApp and Telegram. Your business never sleeps." |

---

## 9. Go-To-Market

### Launch Order
1. **Master brand page (bapita.com)** — build first, establishes the suite
2. **Book.bapita.com** — already live, redirect existing traffic from bapita.com
3. **Social.bapita.com** — next build (in dev now)
4. **SEO, Outreach, Bots** — sequential launches with waitlist capture from day 1

### Launch Strategy
- Master page goes live → shows all 5 products with "Coming soon" badges
- Book traffic redirects naturally to book.bapita.com
- Book dashboard gets a "Check out Bapita Social →" cross-sell banner
- Waitlist capture for each upcoming product builds anticipation
- Each product launch gets its own Product Hunt + directory submissions push

### Cross-Sell Strategy
Each product's dashboard shows companion products:
- Book dashboard: "Run your social too? Try Bapita Social."
- Social dashboard: "Need more bookings? Use Bapita Book."
- SEO dashboard: "Ranking content needs links. Try Outreach."

---

## 10. Open Decisions & Questions

### To Resolve
- [ ] Exact per-product pricing (free tier? trial length?)
- [ ] Social launch date (when is it ready for production?)
- [ ] Domain migration plan for book.bapita.com (what happens to existing bapita.com URLs?)
- [ ] Logo v3 — keep current wordmark? lockup change for suite identity?
- [ ] Illustration style — create custom set for each product or use abstract icons?
- [ ] Hebrew version timeline — when to add RTL support?
- [ ] Monorepo vs separate repos per product?
- [ ] Shared auth system across products (single sign-on?) or separate?

### Document Version
- **Created:** June 29, 2026
- **Author:** Planning session — brand direction, product architecture, visual identity
- **Based on:** bapita-brand-doc.md v2 + multi-product strategy discussions
- **Supersedes:** v2 brand doc (booking-only positioning is now historical)
# Bapita — Competitor Research
**Date:** 2026-06-10  
**Purpose:** Reference for all design decisions. Do not repeat this research.

---

## Platforms Studied

1. **Boulevard** (joinblvd.com) — premium, enterprise-leaning salon/medspa software
2. **GlossGenius** (glossgenius.com) — mobile-first, solo/small team beauty professionals
3. **Fresha** (fresha.com) — free-tier, marketplace + software hybrid, global
4. **Booksy** (booksy.com) — marketplace with embedded booking, barber-heavy

*Competitor	Good for Bapita?	Why
Boulevard	❌ Too enterprise	Luxury branding, multi-location, big teams
GlossGenius	✅ Best reference	Small business focused, simple, premium, personal
Fresha	⚠️ Partial	Good features, but marketplace-heavy and huge scale
Booksy	⚠️ Partial	Booking-first, but marketplace positioning
GrowTap	✅ Messaging reference	"Simple website + booking" positioning similar to your market

---

## Boulevard

### Product positioning
- "The tech behind your touch"
- Targets multi-location salons, medspas, franchises, enterprises
- High-end pricing, demo-gated (no free trial)
- US-focused, luxury brand positioning

### Landing page
- Hero: *"The tech behind your touch"* — aspirational, not pain-elimination
- CTA: "Get a Demo" (one CTA, gated)
- Colors: white bg, dark text, blue/teal accents — clean but cold, not warm
- Social proof: Capterra Best Value, G2 Best Value, named enterprise clients (Fellow Barber, Hairroin Salon)
- Sections: product carousel → 3 pillars (Scheduling, POS, Marketing) → awards → testimonials → CTA
- Nav: Solutions (by industry) · Features · Pricing · Resources · Login · Get a Demo

### Desktop app
- **Browser-based** (Chrome recommended)
- **Top horizontal nav bar** — not sidebar: Front Desk · Schedule · Appointments · Messages · Sales · Manage · Marketing
- "Front Desk" = primary landing view (calendar + live queue)
- Multi-staff focus: color-coded per staff member on calendar
- Booking popups appear bottom-right corner — no full-page redirect, stays in context
- Design: black text on white, minimal color usage, only accents on actionable elements
- Calendar views: Day / 3-Day / Week / Schedule (list)
- Filter icon top-left: toggle which staff show on calendar

### Mobile app (Boulevard Professional)
- Bottom nav: ~4 items — minimalist, calendar-centric
- **Settings = gear icon bottom-right**, separate from main nav tabs (NOT a bottom nav tab)
- Plus button creates new booking or time block
- Calendar top bar: tap the date → cycle through view modes (day/3-day/week/schedule)
- Performance metrics icon at bottom

### ✅ What to borrow
- Contextual popups that don't leave the calendar (bottom-right drawer on click)
- Minimal bottom nav — not cluttered with every feature
- Calendar as primary home screen
- "Front Desk" concept: all daily info in one view

### ❌ What to avoid
- Enterprise complexity (multi-location, franchise, multi-staff filters)
- Cold blue/teal color palette — not warm
- Top horizontal nav — works for multi-section enterprise app, not clean for solo-owner mobile-first
- Demo-gated CTA — Bapita needs WhatsApp contact, lower barrier
- Geared toward operations managers, not the barber doing the actual work

---

## GlossGenius

### Product positioning
- "Scheduling, payments, and admin. Handled."
- Targets solo beauty professionals and small teams
- Mobile-first, app-native product
- Strong on payments, marketing, booking website
- Pricing: Standard $24/mo · Gold $48/mo · Platinum $148/mo

### Landing page
- Hero: *"Scheduling, payments, and admin. Handled."* — pain-elimination, punchy ✅
- Two CTAs: "Start free trial" + "Get a demo" — low barrier
- Stats front and center: **26% more revenue in year one · 75% rebooking rate · 40hrs saved/month**
- Colors: soft pastels, floral accents, lifestyle photography — warm, approachable ✅
- "Why switch" section: directly compares to competitors, addresses objections
- FAQ addresses: target audience, team sizing, competitive advantages
- Sections: How it works → proof stats → testimonials → industry grid → why switch → reviews → data migration → FAQ

### Desktop
- **Mostly mobile-only** — web browser shows calendar only
- No full desktop experience — not a useful desktop reference
- Users reported frustration: "you have to do it all from a phone or tablet"

### Mobile app
- Bottom nav: **5 tabs — Dashboard · Calendar · Clients · Checkout · More**
- **Settings NOT in bottom nav** — gear icon top-right on Dashboard screen ✅
- "More" tab catchall: Reports · Reviews · Text Marketing · Email Marketing · Share
- Calendar: day/week/month toggle at top of calendar screen
- Settings organized into: Website, Business Details, Booking Controls, Services, Bank Account, Card Reader, Subscriptions

### Known UX flaw
- Booking flow is **sequential multi-screen**: pick date → go to next screen → check times → go back if unavailable — users explicitly complain about this
- Avoid this pattern in Bapita: keep time selection in a single view

### ✅ What to borrow
- Pain-elimination landing page headline model
- Stats as hero social proof (we need to collect our own)
- "More" tab pattern — clean way to hide low-frequency features
- Settings hidden behind icon, not a main tab
- Warm color palette and lifestyle photography approach
- FAQ section addressing objections

### ❌ What to avoid
- Multi-screen sequential booking flow (pick date → next screen → pick time)
- Desktop-only-calendar model — Bapita should have full desktop dashboard
- "Checkout" as a main tab — Bapita doesn't have POS yet
- 5 tabs is one too many — More tab is fine but 5 total feels heavy

---

## Fresha

### Product positioning
- Free software (marketplace-funded model)
- Global platform, 140,000+ businesses, 120+ countries
- Combines booking software + consumer marketplace
- Fresha earns from commission on new clients via marketplace, not subscription

### Desktop
- Drag-and-drop calendar as core workspace
- Clean horizontal nav, simplified appointment view
- Quick client card display with contact info on tap
- Checkout integrated directly from appointment view (no extra navigation)

### Mobile
- Two apps: one for business, one for customers (marketplace)
- Business app: 4.0 rating — functional but not exceptional
- Client app: 4.9 rating — discovery + booking from marketplace

### ✅ What to borrow
- Checkout integrated into appointment view (not separate screen)
- Quick client card in context (tap appointment → client info appears)
- Clean appointment view with only key info

### ❌ What to avoid
- Marketplace dependency (Fresha owns the client relationship, not the business)
- Free model means limited customization — businesses are fungible in the marketplace
- Not brand-differentiated for individual business owners

---

## Booksy

### Product positioning
- Marketplace-first, barber-heavy
- 38M+ global users
- Consumer app + business app model
- Strong in US barbershops specifically

### Public booking page (customer-facing)
- Standard flow: select service → popup with dates/barbers → confirm
- Barber profiles with photos, reviews, portfolio
- Under 60 seconds to book
- Real-time availability
- Mobile-first

### ✅ What to borrow
- Public booking page: service → date → time slots grid → name/phone → confirm
- Under-60-second booking flow
- Barber profile with photo is trust signal for customer

### ❌ What to avoid
- Discovery/marketplace features (Bapita clients have their own domain)
- Multi-barber staff selection (single owner)
- Account required to book — Bapita should allow guest booking

---

## Cross-Platform Navigation Patterns

| Pattern | Boulevard | GlossGenius | Fresha | Bapita — LOCKED |
|---|---|---|---|---|
| Desktop nav | Top horizontal bar | Calendar only | Top horizontal | Left sidebar (Google Cal model) |
| Mobile bottom nav | ~4 tabs (calendar-centric) | 5 tabs (Dashboard/Cal/Clients/Checkout/More) | Bottom tabs | **4 tabs: Calendar · Clients · Insights · Financials** |
| Settings location | Bottom-right gear icon | Top-right gear on Dashboard | N/A | **Hamburger drawer (☰)** |
| Add-ons location | N/A | Inside app settings | N/A | **Hamburger drawer (☰)** |
| Calendar as home | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| New booking | Button in calendar | FAB + tap slot | Tap slot | **FAB (amber +) + tap empty slot** |
| Availability blocking | Staff filter only | No | No | **✅ Long-press → block time (Airbnb model)** |
| Financials | Separate (Sales tab) | Checkout tab | N/A | **Bottom nav tab — premium connect page if Stripe inactive** |

---

## Public Booking Page — Best Practices (customer-facing)

From Fresha, Booksy, Calendly:
1. **Service first** — show list of services with duration + price immediately
2. **Date → time grid** — not dropdowns, not sequential multi-page
3. **Name + phone only** — don't require email or account creation
4. **Under 60 seconds** — total flow should be under 3 taps after service selection
5. **Mobile-first** — 90%+ of customers arrive on phone
6. **Success screen** — shows full booking details + "Add to calendar" (ICS)
7. **No Bapita branding override** — show the barber's name prominently, not platform

---

## Landing Page — Structural Benchmarks

| Element | Boulevard | GlossGenius | Bapita direction |
|---|---|---|---|
| Headline style | Aspirational | Pain-elimination | Pain-elimination (later) |
| Primary CTA | "Get a Demo" | "Start free trial" + "Get a demo" | "Book a free call" → WhatsApp |
| Social proof | Named clients + awards | Stats (%, hrs saved) | Client names + WhatsApp screenshots |
| Pricing visible | Yes (pricing page) | Yes (on page) | No — done-for-you service, custom quote |
| Hero visual | Product screenshots | App mockups + lifestyle photos | App mockup on phone |
| "Why us" section | Implicit (feature list) | Explicit comparison cards | Needed — vs. WhatsApp chaos |

---

*Research done: 2026-06-10. Sources: joinblvd.com, glossgenius.com, thesalonbusiness.com, support.boulevard.io, fresha.com, booksy.com*

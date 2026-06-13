# Bapita — Active Plan (v3)
**Updated:** 2026-06-13  
**Repos:** `bapita` (docs + LP) · `bapita-dashboard` (Next.js app)  
**Live:** bapita.com · dashboard.bapita.com

---

## Status

### Done
- [x] Design system doc
- [x] App shell + login
- [x] Calendar — week/day/month/agenda views, BookingDrawer, RescheduleSheet, EditBookingSheet, Labels, CalendarSelector, Search, booking chip polish, print
- [x] Clients list + client profile
- [x] New booking flow (4-step wizard)
- [x] Insights
- [x] Settings (Business Info / Services / Business Hours)
- [x] Profile, Add-ons (Extras), Financials, Usage
- [x] Nav/shell redesign — HP visual language, shared tokens in globals.css

### Remaining
- [ ] **Block 1** — Dashboard review + Acuity comparison (Chat 8.5)
- [ ] **Block 2** — Landing page rebuild (Chat 9)
- [ ] **Block 3** — Public booking page + 3 templates (Chat 10)

---

## Locked Decisions

### Navigation
- **Bottom nav (4 tabs):** Calendar · Clients · Insights · Extras
- **FAB:** Amber +, 56×56px, calendar page only, opens new booking
- **Hamburger drawer:** Settings → /settings | Financials → /financials | Profile → /profile | Sign out
- **Desktop:** Left sidebar, icons + labels, amber active state

### Booking entry points (canonical)
| Where | Control | Does |
|---|---|---|
| Calendar | FAB + | New appointment from scratch |
| Calendar | Tap empty slot | New appointment, time pre-filled |
| Clients tab | + in header | Add customer OR add appointment |
| Client profile | "New booking for X" | Appointment wizard, client pre-filled |

**Service management** (adding/editing services): ONLY from Settings → Services tab. No other entry point.

### Settings (3 tabs)
Business Info · Services · Business Hours

### Public booking page URL
`bapita.com/book/[slug]` — custom domain = Phase 2

### Templates
- Rami picks template based on barber research (Google Maps + Instagram). Not self-service by barber.
- 3 styles: Classic · Modern · Dark
- Personalization: 4 fields, 10-15 min to fill per client

---

## Block 1 — Dashboard Review + Nav Standardization (Chat 8.5)

**Effort:** high  
**Repo:** bapita-dashboard  
**Competitor reference:** `/Users/admin/Desktop/bapita_Competitor screens/acuity scheduling/`  
**Nav reference:** `/Users/admin/Desktop/bapita_Competitor screens/airbnb/tab:clanedar view.png`

### Step 1 — Extract style reference from Clients page
Clients page is fully done and visually correct. Before touching anything else:
- Read `src/app/(dashboard)/clients/page.tsx` and `clients/[id]/page.tsx`
- Note: token usage, card patterns, spacing, typography, empty states, mobile layout
- Use these as the visual standard for all other pages

### Step 2 — Standardize nav across all pages
**Problem:** Different pages currently have their own left menu; tabs above pages are inconsistent.  
**Fix:** Airbnb-style tab pattern across the board.

**Airbnb tab spec** (from screenshot):
- Horizontal tab row at top of content area
- Active tab: underline only (black/amber, 2px), no filled pill/background
- Inactive: plain text, no decoration
- Clean white/cream bar, no border, no shadow
- Font weight: active = 600, inactive = 400

**Apply to:**
- Settings (3 tabs: Business Info · Services · Business Hours) → Airbnb tabs
- Any other page that has sub-tabs → same pattern
- Audit every page's top section — remove any per-page left sidebar/nav that's not AppShell

### Step 3 — Per-page improvements

| Page | Status | Work |
|---|---|---|
| `/clients` | ✅ Done | Reference only — do not touch |
| `/clients/[id]` | ✅ Done | Reference only — do not touch |
| `/calendar` | Nearly done | Small improvements (see Acuity calendar screenshots for inspiration) |
| `/extras` | Nearly done | Small improvements |
| `/profile` | Nearly done | Small improvements |
| `/new-booking` | Done | No changes unless bugs found |
| `/insights` | Partial | Improvements (see Acuity Reports screenshots) |
| `/settings` | Partial | Improvements + Airbnb tabs |
| `/financials` | Not done | **Full restructure** (see Acuity financial screenshots) |
| `/usage` | Unknown | Audit + fix to match style |
| `/login` | Done | No changes unless bugs found |

**Acuity comparison focus:**
- Insights → `Reports:Insights for bapita/` screenshots — what metrics, how displayed
- Financials → `financial/invoices.png`, `financial/payments.png` — layout, data display
- Calendar → `calendar/` screenshots — booking block style, density

**General fixes on every page:**
- Design system tokens only — no raw colors (`bg-white`, `border-gray-200`, `bg-amber-500`, etc.)
- Mobile layout: tap targets ≥44px, no overflow, no clipped text
- Every list needs an empty state
- Every async action needs a loading state
- No `alert()` — use toast

---

## Block 2 — Landing Page (Chat 9)

**Effort:** high  
**Repo:** bapita (LP sub-git)  
**File:** `v2/src/dashboard/index.html`  
**Push:** `git -C /Users/admin/Desktop/bapita/v2/src/dashboard add index.html && git -C /Users/admin/Desktop/bapita/v2/src/dashboard commit -m "..." && git -C /Users/admin/Desktop/bapita/v2/src/dashboard push`

### Design direction (locked)

**Reference:** GlossGenius (editorial polish), Wix (verticals grid), Framer/Linear (mockups + whitespace)

**3 structural changes from current LP:**
1. Drop full-height scroll-snap → editorial natural flow, 64-80px section gaps, tone-shift breaks
2. Hero asymmetric: copy left, phone mockup right (booking page on phone, visible above fold)
3. Pill buttons (9999px). Cards stay 14-16px radius.

**Type scale (Heebo — tracking tightens with size):**
| Role | Size mobile→desktop | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| display | 2.75→4.5rem | 900 | 1.02 | -0.035em |
| h2 section | 1.875→2.75rem | 900 | 1.08 | -0.03em |
| h3 card | 1.1875→1.375rem | 700 | 1.2 | -0.02em |
| body-lg | 1.0625→1.1875rem | 300/400 | 1.6 | normal |
| body | 0.9375→1rem | 400 | 1.62 | normal |
| label/eyebrow | 0.75rem | 700 | 1.3 | 0.08em (caps) |

Caps only on Latin eyebrows/labels. Never on Hebrew. Min 15px mobile.

**Color usage (unchanged palette, new application):**
- Tokens: amber `#E8920A`, dark `#1E1A14`, cream `#FAF5EC`, cream-2 `#F5EFE3`, terra `#D4622A`, muted `#6B6052`
- Gradient washes for feature cards (no shadow — gradient IS the elevation):
  - amber: `linear-gradient(160deg, #F6D9A8, #E8920A)` — booking page mockup card
  - sand: `linear-gradient(160deg, #F5EFE3, #E8C9A0)` — dashboard mockup card
  - terra: `linear-gradient(160deg, #E8A87C, #D4622A)` — WhatsApp reminder card
- Dark bands: hero + why-bapita section + final CTA (3 dark anchors, cream everywhere else)

**Mockups (hand-built HTML/CSS, wired to nothing):**
1. Phone — booking page: believable barber shop ("Studio Avi"), services + durations, date row, time slots, name/phone field, amber Book button. Hero visual.
2. Phone or laptop — dashboard week view: calendar week strip, color-coded booking blocks, today amber pill.
3. WhatsApp bubble (optional, add-ons section): Hebrew reminder text, right-aligned.
Frame: rounded device bezel, soft warm shadow on device only (not the card).

**Section order (locked):**
Nav → Hero (phone mockup) → Stats bar → Verticals strip → Pain selector → How it works → What we build (3 layers: booking website / dashboard / add-ons) + dashboard mockup → Add-ons accordion → Why Bapita (dark band, comparison cards) → Testimonials → FAQ → Final CTA → Footer

**Motion (keep, refine):**
Preserve: nav shadow on scroll, mobile menu, hero/final-cta mouse glow, pain selector, accordions, fade-up IntersectionObserver, Plausible events. Add fade-up to new sections. Respect `prefers-reduced-motion`.

**Non-negotiables:**
- No dash in any customer-facing copy. Commas and periods only.
- No prices. Every CTA = book a free call (WhatsApp).
- Single file. Inline CSS vars, BEM-ish classes, vanilla JS.
- RTL-safe: logical CSS properties throughout.
- Verticals strip: Medspa · Salon · Spa · Barber · Massage · Nail Salon

---

## Block 3 — Public Booking Page + Templates (Chat 10)

**Effort:** high  
**Repo:** bapita-dashboard  
**Route:** `src/app/book/[slug]/`

### What it is
Customer-facing booking flow. Each barber gets `bapita.com/book/their-slug`. Their clients use this to book appointments.

### Flow (all 3 templates, same steps)
Service select → Date → Time slot → Contact (name + phone, email optional) → Confirm → Success screen

### Template system

**3 visual styles — same component tree, CSS theme layer only:**

| Style | Bg | Accent | Type feel | Default Hebrew tagline |
|---|---|---|---|---|
| Classic | `#FAF5EC` cream | amber `#E8920A` | warm, inviting | "ספרות מקצועית. שירות אישי." |
| Modern | `#F8F8F6` off-white | charcoal `#1E1A14` | clean, geometric | "גזירה מדויקת. כל פעם." |
| Dark | `#1A1A1A` dark | gold `#C9A84C` | premium, luxury | "המקום של הגברים." |

Templates are NOT generic — each has personality baked in (spacing rhythm, type weights, button style). They still look distinctive with only a name and tagline filled in.

### Template personalization fields
4 fields added to `businesses` table (Rami fills during onboarding, 10-15 min per client):

| Field | Type | Source |
|---|---|---|
| `template_style` | enum: classic/modern/dark | Rami picks based on barber's vibe |
| `tagline` | text, nullable | From Instagram bio or Google Maps description |
| `hero_image_url` | text, nullable | Best photo from their Instagram |
| `accent_color` | text, nullable | Override if they have strong brand color |

Existing fields already used: `business_name`, `logo_url`, active services from `services` table.

### How Rami fills them (per client onboarding)
1. Google Maps → business description → `tagline` (or use template default)
2. Instagram → best photo → `hero_image_url`
3. Look at their aesthetic → pick `template_style`
4. Strong brand color (e.g. red/black shop)? → `accent_color` override
5. Done. Page is live at `bapita.com/book/[slug]`

### Phase 2 (not built now)
- Custom domain mapping
- Client self-reschedule / cancel
- Add-ons upselling during booking

### Requirements
- Loads business info from Supabase by slug
- Available slots from `business_hours` JSONB + existing bookings (no double-booking)
- Email confirmation on success via Resend (noreply@bapita.com)
- Error states: business not found (404), no availability, booking failed
- Loading state every async step
- Success screen: booking summary + "Add to calendar" (ICS)
- Mobile-first. RTL-safe. Works on desktop too.

---

## Repos & Key Files

| Thing | Path |
|---|---|
| Dashboard repo | `/Users/admin/Desktop/bapita-dashboard/` |
| Dashboard dev | `npm run dev` → localhost:3000 |
| Dashboard push | `git -C /Users/admin/Desktop/bapita-dashboard add src/ && git commit -m "..." && git push` |
| LP + docs repo | `/Users/admin/Desktop/bapita/` |
| LP file | `v2/src/dashboard/index.html` |
| LP git | `git -C /Users/admin/Desktop/bapita/v2/src/dashboard [cmd]` |
| Design system | `bapita/v2/docs/design-system.md` ← READ BEFORE CODING |
| Brand doc | `bapita/v2/docs/brand/bapita-brand-doc.md` |
| Strategy | `bapita/v2/docs/strategy.md` |
| Competitors | `bapita/v2/docs/competitors.md` |
| Acuity screenshots | `/Users/admin/Desktop/bapita_Competitor screens/acuity scheduling/` |

**AGENTS.md rule (bapita-dashboard):** This is Next.js 16 with breaking changes. Read `node_modules/next/dist/docs/` before writing code.

---

## Architecture Notes (dashboard)

- `CalendarChrome` context in AppShell bridges calendar page state to top bar. Page publishes via `setChrome()`.
- `rangeFor(view, date)` in calendar/page.tsx controls Supabase fetch window per view.
- `visibleBookings` = filtered by `statusFilter`, used by all views.
- All booking mutations go through Supabase directly in the component, then `onUpdated(patch)` for local state.
- RTL: logical CSS only (`insetInlineStart`, `ms-`, `ps-`, `border-s`). No `left/right/ml/mr`.
- Design tokens: `--color-cream`, `--color-cream-2`, `--color-amber`, `--color-dark`, `--color-muted`, `--wash-amber`, `--line`, `--nav-bg`, `--nav-blur`.
- `STATUS_COLOR` and `STATUS_LABEL` imported from `@/types`.
- AppShell contract: page work in `page.tsx` only — do not modify AppShell.
- `extras/page.tsx` and `settings/page.tsx` have pre-existing uncommitted changes (only chmod diff) — these pages need a full visual rebuild in Block 1.

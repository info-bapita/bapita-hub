# Bapita — Launch Master Plan
**Created:** 2026-06-15  
**Last updated:** 2026-06-16  
**Status:** Phase 0 complete → Phase 0.5 Batches A–H deployed → Phase 1A double-booking fix deployed (commit 4ea5b0f) → All QA items manually verified and fixed by Rami 2026-06-17  
**Owner:** Rami  
**Brutal truth:** Read this top to bottom. Don't skip sections.

---

## Phase 0.5 — Technical Polish (2026-06-16, in progress)

These items were identified during QA session on 2026-06-16 and are being coded in this session. All block a credible first demo or first client onboarding.

### Batch A — SEO & Visibility ✅ DEPLOYED (commit 88f1d6c)
| # | Item | Detail | Status |
|---|------|--------|--------|
| 1 | Favicon | Bapita `.ico` in `public/` (no Turbopack processing), `icon.png` + `icon.svg` in app/ | ✅ Done |
| 2 | Icon SVG | `src/app/icon.svg` — pita icon, modern browsers | ✅ Done |
| 3 | Apple icon | `src/app/apple-icon.png` for iOS | ✅ Done |
| 4 | OG image | `public/og-image.png` | ✅ Done |
| 5 | Manifest icons | Fixed — references apple-icon.png (was pointing to missing files) | ✅ Done |
| 6 | robots.ts | Blocks all dashboard routes, allows `/{slug}`, declares sitemap | ✅ Done |
| 7 | sitemap.ts | Dynamic — fetches `status=live` slugs from Supabase | ✅ Done |
| 8 | `[slug]` metadata | title, description, OG tags, Twitter card, canonical, LocalBusiness JSON-LD | ✅ Done |
| 9 | Google Analytics | GA4 `G-XESDNYB9T6` via `next/script afterInteractive` | ✅ Done |
| 10 | `lang` attr | Root layout `lang="he"` | ✅ Done |

**Next manual step:** Google Search Console → Sitemaps → submit `https://bapita.com/sitemap.xml`

### Batch B — Skeleton Loaders ✅ DEPLOYED (commit 6047b94)
| # | Item | Detail | Status |
|---|------|--------|--------|
| 11 | CalendarSkeleton | Fixed colors: cream tokens | ✅ Done |
| 12 | SettingsSkeleton | Fixed colors: cream tokens | ✅ Done |
| 13 | InsightsSkeleton | Fixed colors: cream tokens | ✅ Done |

### Batch C — Optimistic UI ✅ DEPLOYED (commit 0a443da)
| # | Item | Detail | Status |
|---|------|--------|--------|
| 14 | Service toggle | Instant toggle, reverts on Supabase error | ✅ Done |
| 15 | Booking status | Instant status update, reverts on error | ✅ Done |

### Batch D — Admin Bugs ✅ DEPLOYED (commit 06ec9ac)
| # | Item | Detail | Status |
|---|------|--------|--------|
| 16 | Hebrew fields | `name_he`, `tagline_he`, `about_text_he` in Profile tab with RTL inputs | ✅ Done |
| 17 | Service edit bug | `startEdit` now loads `s.description` not `""` | ✅ Done |

### Batch E — Admin Round 1 ✅ DEPLOYED (commit 55cff94)
| # | Item | Detail | Status |
|---|------|--------|--------|
| 18 | Admin nav link | Hamburger drawer shows "Admin" entry only for ramikan96@gmail.com | ✅ Done |
| 19 | `default_lang` field | Dropdown (HE/EN) in Profile tab → saved to DB, controls booking page default language | ✅ Done |
| 20 | Gallery stable path | New businesses upload to `galleries/<uuid>/` not `galleries/temp/` | ✅ Done |
| 21 | Dirty state warning | Amber dot appears on unsaved changes; `beforeunload` blocks accidental tab close | ✅ Done |
| 22 | Section reorder — touch | Touch drag events added to section order list (mobile admin support) | ✅ Done |
| 23 | Cascade delete | Business delete now removes bookings + customers + services before business row | ✅ Done |

---

### Batch F — Admin Round 2 ✅ DEPLOYED (commits 0a839f4..8110e23, 2026-06-16)

> **Context for next Claude:** Full admin audit was done 2026-06-16. The BusinessForm is at `src/app/(dashboard)/admin/businesses/_components/BusinessForm.tsx`. The booking page templates are at `src/app/[slug]/themes/{classic,clean,dark}/`. All DB changes require Supabase SQL Editor + type update in `src/types/index.ts`.

#### F1 — Save & Preview button 🟡
**Problem:** Preview button opens `https://book.bapita.com/{slug}` immediately. In new mode: page 404s (not saved yet). In edit mode: shows last-saved version, not current edits.  
**Fix:** Replace "Preview ↗" link with a "Save & Preview" button that calls `handleSave()` then `window.open(previewUrl, "_blank")`.  
**File:** `BusinessForm.tsx` — header button section (~line 323)  
**Effort:** 5 min

#### F2 — Business Hours in admin form 🔴
**Problem:** BusinessForm has no hours editor. Rami can't set hours for a new client from admin — must log in as the client or use Supabase directly. Breaks the "done for you" model.  
**Fix:** Add a "Hours" tab to BusinessForm (alongside Profile/Gallery/Services/Plan). Copy the hours UI logic from `src/app/(dashboard)/settings/page.tsx` (the `HoursTab` component). Load `business_hours` JSONB from DB (already in the `select("*")` query). Save `business_hours` in the payload.  
**Files:** `BusinessForm.tsx` — new tab + hours UI  
**DB:** No migration needed — `business_hours` JSONB column already exists  
**Effort:** Medium (30–45 min)

#### F3 — Stats section in Classic template 🟡
**Problem:** Clean + Dark templates show stat chips (years, clients, rating). Classic template has none. Inconsistent.  
**Fix:** Add the same stats strip to `ClassicPage.tsx`. Should render in/below the hero section, same as Dark template logic. Conditionally shows only if at least one stat field is non-null.  
**File:** `src/app/[slug]/themes/classic/ClassicPage.tsx`  
**Effort:** Small (15 min)

#### F4 — `show_stats` toggle 🟡
**Problem:** No way to hide stats without deleting the values. Templates always render stats if fields are set.  
**Fix:**  
1. Supabase migration: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS show_stats boolean DEFAULT true;`  
2. Add `show_stats` to `Business` type in `src/types/index.ts`  
3. BusinessForm: Add toggle in "Section Visibility & Order" card  
4. All 3 templates: wrap stats block with `{business.show_stats !== false && hasStats && (...)}`  
**Effort:** Small (20 min)

#### F5 — `show_services` toggle 🟡
**Problem:** No way to hide the services section on the booking page. Templates always show it.  
**Fix:**  
1. Supabase migration: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS show_services boolean DEFAULT true;`  
2. Add to `Business` type  
3. BusinessForm: Add toggle in "Section Visibility & Order" card  
4. Also add "services" to `DEFAULT_SECTION_ORDER` array and `SECTION_LABELS` in BusinessForm  
5. All 3 templates: wrap services section with `{business.show_services !== false && (...)}`  
**Effort:** Small (20 min)

#### F6 — Wire `section_order` to booking page templates 🟡
**Problem:** Section reorder drag-and-drop saves to DB but booking page templates hardcode section order in JSX. Reordering has ZERO effect on what the customer sees. Dead feature.  
**Fix:** In each template (`ClassicPage`, `CleanPage`, `DarkPage`), build a `sections` map keyed by section name → JSX node. Then render by `(business.section_order || DEFAULT_SECTION_ORDER).map(key => sections[key])`.  
**Files:** All 3 template files  
**Effort:** Medium (45 min — must test all 3 templates)

#### F7 — Batch create (multiple templates/slugs at once) 🟡
**Problem:** To demo a client's barbershop in 3 templates, you must create 3 businesses one at a time (fill full form 3×).  
**Flow wanted:**
1. Fill shared info once (name, phone, address, about, services, gallery)
2. Under "Templates & URLs" section: define 2–3 rows, each with its own slug + template choice
3. Save → creates 2–3 separate `businesses` rows in DB, all same shared data, different `slug` + `template_style`
4. Edit each independently before delivering  

**Implementation:**
- New mode only. Add a "Templates & URLs" section under Business Info (replaces the single template/slug fields)
- State: `variants: { slug: string; template: string }[]` — starts with 1 row, "+ Add template" adds more (max 4)
- On save: loop through `variants`, call `supabase.from("businesses").insert(...)` for each with shared payload + variant slug/template
- After save: navigate to `/admin/businesses` (list shows all 3 new rows)
- For services: insert same services for each business_id created  
**File:** `BusinessForm.tsx` (new mode only), `new/page.tsx`  
**Effort:** Medium (45–60 min)

#### F8 — Google Reviews / Testimonials section 🟡
**Problem:** No reviews on booking pages. Big social proof gap — Google Maps reviews are the #1 trust signal for barbershops.  
**Flow wanted:** Paste real Google Maps reviews (name, text, star rating, optional date) → show as cards on booking page.  

**Implementation:**
1. Supabase migration:
```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS show_testimonials boolean DEFAULT true;
```
2. Add to `Business` type: `testimonials?: { name: string; text: string; rating: number; date?: string }[] | null; show_testimonials?: boolean | null;`
3. BusinessForm: New "Reviews" tab (edit mode only) — list of review cards, each editable inline (name, text, 1–5 star rating, optional date). "Paste from Google" helper text. Add/delete reviews.
4. Add `show_testimonials` toggle to Section Visibility & Order
5. Add "testimonials" to `SECTION_LABELS` and `DEFAULT_SECTION_ORDER`
6. All 3 templates: New `SectionTestimonials` component — horizontal scroll of cards on mobile, 3-col grid on desktop. Only renders if `show_testimonials !== false && testimonials?.length > 0`.  
**Files:** `BusinessForm.tsx`, all 3 template files, new shared component `src/app/[slug]/components/SectionTestimonials.tsx`  
**Effort:** Large (1.5–2 hours, needs its own session or sub-batch)

---

### Batch G — P1/P2 Bugs from Manual QA ✅ DEPLOYED (2026-06-16)

Found during Rami's manual testing on 2026-06-16 after Batch F deployed.

| # | Item | Detail | Status |
|---|------|--------|--------|
| G1 | **Time slots not appearing** 🔴 | Root cause: `SUPABASE_SERVICE_ROLE_KEY` was wrong/invalid in Vercel env vars → service client returned "Invalid API key" → business lookup failed → empty slots. Fix: corrected key in Vercel → redeployed. Confirmed working. | ✅ Done |
| G2a | **Admin new-booking can't save** 🔴 | `new-booking/page.tsx:255` inserts `appointment_datetime` (column doesn't exist) AND missing `customer_name` (NOT NULL). Fixed: removed `appointment_datetime`, added `customer_name`, `customer_phone`, `customer_email` to insert. Commit `8eb2ed0`. | ✅ Done |
| G2c | **Bookings never appear on calendar** 🔴 | Root cause: 8 files used `duration:duration_minutes` and `price:price_nis` as Supabase column aliases — columns don't exist, so every join silently returned `data: null`. Fixed: all queries now use `duration` and `price`. Affected: calendar (×2), clients, insights, financials, AddCustomerSheet (×2), RescheduleSheet, EditBookingSheet (×2). Commit `bd07817`. | ✅ Done |
| G2b | **Public booking customer upsert fails** 🔴 | Added unique index: `CREATE UNIQUE INDEX IF NOT EXISTS customers_business_phone_idx ON customers(business_id, phone);` | ✅ Done |

> **Note:** Debug `_debug` field still present in `/api/public/slots/route.ts` — remove before next client onboarding.

> **Email notifications:** BCC hardcoded to `info.bapita@gmail.com`. Emails silently fail until Resend domain verified (Phase 2D). Feature to add: `notification_email` per business (editable in Settings + admin) so each barber gets their own booking notification. Planned for next session.

---

### Batch H — Session 2026-06-16 ✅ COMPLETE

| # | Item | Status |
|---|------|--------|
| H1 | New-booking shows recent clients immediately | ✅ Done (commit aa78954) — fetches top-10 on mount, shows "Recent clients" list without typing |
| H2 | Booking drawer premium styling | ✅ Done (commit aa78954) — box-shadow on all section cards (label, contact, payment, history) |
| H3 | Contact copy-to-clipboard | ✅ Done (commit aa78954) — phone/email rows are buttons; "Copy" → "Copied ✓" (green, 2s); no longer opens dialer/mail app |
| H4 | + New client button moved above search | ✅ Done (commit 5f17266) |
| H5 | `notification_email` per business | ✅ Done (commits fe8256d + 86e2c0c) — DB column, Settings "Details" card field, BCC per-business in both email paths; fallback to `info.bapita@gmail.com` |
| H6 | Email provider: Resend → Gmail SMTP (nodemailer) | ✅ Done (commit e98fe20) — Resend needs domain DNS (Wix blocks this); switched to nodemailer via `smtp.gmail.com:465` using `info.bapita@gmail.com` app password. `GMAIL_USER` + `GMAIL_APP_PASSWORD` added to Vercel production. |

### Email infrastructure — current state
| What | Detail |
|------|--------|
| Provider | Gmail SMTP via nodemailer |
| Sender address | `info.bapita@gmail.com` |
| Customer confirmation | Sent on every booking with a customer email (public + dashboard) |
| BCC (barber notification) | Sent to `businesses.notification_email` if set, else `info.bapita@gmail.com` |
| Limit | ~500 outbound/day (Gmail free). Enough for launch. |
| App password | Stored in Vercel as `GMAIL_APP_PASSWORD` (encrypted). Gmail account: `info.bapita@gmail.com`. If revoked: Google Account → Security → App Passwords → regenerate. |
| Deferred | `notification_email` in admin `BusinessForm.tsx` — barbers set their own in Settings for now |
| Future upgrade | Once bapita.com DNS can be moved off Wix (Cloudflare recommended), switch back to Resend for better deliverability + analytics |

## ◀◀ WE ARE HERE — START NEXT SESSION HERE ▶▶

### Next up (Phase 1B + 1C)
| # | Task |
|---|------|
| 1 | Phase 1B — [see checklist below] |
| 2 | Phase 1C — [see checklist below] |

### How to verify email works (test before next session)
1. Go to `book.bapita.com/demo-classic`
2. Book appointment with a real email as customer
3. Customer inbox → should receive "Booking confirmed" from `info.bapita@gmail.com`
4. `info.bapita@gmail.com` Sent folder → confirm it went out
5. If notification_email set in Settings → that inbox should receive BCC

---

### Backup checkpoint ✅ DONE (2026-06-16)
Tags `phase0-E-complete` pushed to both repos:
- `github.com/ramikan96-collab/bapita` → tag pushed ✅
- `github.com/ramikan96-collab/bapita-dashboard` → tag pushed ✅

---

### Deferred (conscious decisions)
- **Tooltips** — UI already well-labeled, skip for now
- **Caching** — Supabase is client-side, Next.js cache doesn't apply; `[slug]` page could get `revalidate=3600` but low impact
- **Google ranking** — happens naturally 2–4 weeks after sitemap submitted

### Google Search Console status
- Property verified ✅ (Rami completed 2026-06-16)
- Indexing: "Processing data, please check again in a day or so" — normal, wait 24–48h
- Next step: submit sitemap after Batch A deploys

---

## The Honest Situation

You have a real, working product. That's rare. Most people never build it.  
But you have 6 gaps that will lose you deals tomorrow if not fixed today:

1. **Demo URLs may be broken/ugly** — your only sales tool
2. **No payment method** — you can't take money
3. **No contract** — you're exposed legally and professionally
4. **No sales script** — you'll improvise and lose confidence
5. **No support process** — first client issue and you'll panic
6. **No staging env** — one bad push breaks all clients

This file fixes all 6. Work through it in order.

---

## PHASE 0 — Triage (Do This First, 15 min)

Before anything else, open each URL on your phone and desktop right now.  
Write "✅ OK" or "❌ BROKEN — [what's wrong]" next to each.

### Public booking pages (your sales demo)
| URL | Desktop | Mobile (375px) | Both | Notes |
|---|---|---|---|---|
| book.bapita.com/demo-classic | | | | |
| book.bapita.com/demo-clean | | | | |
| book.bapita.com/demo-dark | | | | |

**✅ Fixed 2026-06-15 (commit db923ab — deployed to Vercel):**
- FloatingCTA was hardcoded "Book Appointment" → now translates with lang toggle
- RTL sticky header (Clean + Dark): business name was colliding with lang toggle in HE → fixed with `left/right` instead of logical CSS
- Clean hero: full redesign → split editorial (dark left panel + photo right), mobile stacked
- Stars strip added inside hero fold on all 3 templates (links to google_review_link if set)
- Gallery: `initialCount=4`, show-more/collapse button
- Bilingual (B): `name_he`, `tagline_he`, `about_text_he` on businesses; `name_he`, `description_he` on services — DB migrated, types updated, all 3 templates + Settings wired
- Demo rows: default_lang='he', Hebrew content seeded (businesses + 14 services)
- Settings: Hebrew version card + Hebrew fields per service in edit form

### Dashboard (owner experience)
| URL | Desktop | Mobile | Both | Notes |
|---|---|---|---|---|
| dashboard.bapita.com/login | | | | |
| dashboard.bapita.com/calendar | | | | |
| dashboard.bapita.com/clients | | | | |
| dashboard.bapita.com/new-booking | | | | |
| dashboard.bapita.com/settings | | | | |
| dashboard.bapita.com/insights | | | | |
| dashboard.bapita.com/addons | | | | |
| dashboard.bapita.com/profile | | | | |
| dashboard.bapita.com/admin/businesses | | | | |

### Landing page
| URL | Desktop | Mobile | Both | Notes |
|---|---|---|---|---|
| bapita.com | | | | |

---

## PHASE 1 — QA Checklist (Systematic, Today)

Run each check. Fix P1s before sleeping. P2s before first meeting. P3s later.

**Priority legend:**  
🔴 P1 = broken, kills the deal, fix today  
🟡 P2 = ugly or confusing, fix before first meeting  
🟢 P3 = nice to have, fix after first client

**How to work through this — 3 modes:**

| Tag | What it means | How to do it |
|---|---|---|
| `[YOU]` | Manual test on your phone/browser | Just do it. No AI needed. |
| `[AI-SHOT]` | Visual/layout bug | Screenshot → paste to Claude with the visual QA prompt (section 1A below) |
| `[AI-CODE]` | Logic/data bug | Paste save handler + schema to Claude with code review prompt (section 1A below) |

**Rule:** Do all `[YOU]` items first — they're fastest. Then `[AI-SHOT]` for anything that looks broken. Then `[AI-CODE]` for anything that might be broken but looks fine.

---

### 1X — Security & Edge Cases (Do This Before Anything Else) 🔴 ALL P1

These aren't in the UI. They're invisible. Skip them and you'll find out in production.

#### RLS Isolation (Multi-tenant — CRITICAL)
- [x] 🔴 `[YOU]` Create second Supabase user (different email). Log in as User B. Can you see User A's bookings? **You should see zero.** `[AI-CODE]` If unsure, paste your RLS policies to Claude: "Does this policy fully isolate tenant A from tenant B?"
- [x] 🔴 `[YOU]` Try accessing `dashboard.bapita.com/clients` as User B — should show 0 clients (User A's clients must not appear)

#### Empty State (New Business, No Data)
- [x] 🔴 `[YOU]` Sign up with brand-new email. Go to /settings. Does it load with empty form (not crash)?
- [x] 🔴 `[YOU]` New account → /calendar. Empty state or error?

#### Edge Cases on Booking Page
- [x] 🔴 `[YOU]` What does `book.bapita.com/demo-classic` show if services list is empty? (Temporarily delete all services, check, re-add)
- [x] 🔴 `[YOU]` What happens if all business hours are toggled OFF? Can a user still pick a time slot?

---

### 1A — Public Booking Pages (Your Sales Tool — Most Critical)

Do this for each of the 3 demo templates (classic, clean, dark):

#### Visual / Layout
- [x] 🔴 `[YOU→AI-SHOT if broken]` Hero renders on mobile (375px) — no overflow, no broken layout
- [x] 🔴 `[YOU]` Business name and tagline visible above the fold on mobile
- [x] 🟡 `[YOU→AI-SHOT if broken]` Font loads correctly (Playfair/Jakarta Sans/Oswald depending on template)
- [x] 🟡 `[YOU→AI-SHOT if broken]` Hero image loads (or placeholder looks intentional, not broken)
- [x] 🟡 `[YOU]` Service cards display name, price, duration correctly
- [x] 🟡 `[YOU→AI-SHOT if broken]` Gallery renders — no broken images, no layout shift
- [x] 🟢 `[YOU]` Gallery lightbox works on mobile (tap to open, tap outside to close)
- [x] 🟢 `[YOU]` Hours section shows correct open/closed state

#### Booking Flow (Full End-to-End)
Walk through the entire booking as if you're a real customer:
- [x] 🔴 Step 1: Service list loads — tap a service → advances to step 2
- [x] 🔴 Step 2: Calendar loads — can select a date → advances to step 3
- [x] ✅ 2026-06-17 🔴 Step 3: Time slots appear — select a slot → advances to step 4
- [x] ✅ 2026-06-17 🔴 Step 4: Name + phone form — fill and submit
- [x] ✅ 2026-06-17 🔴 Booking confirmation appears (no white screen, no error)
- [x] ✅ 2026-06-17 🔴 Booking appears in dashboard calendar after submitting
- [x] ✅ 2026-06-17 🟡 Email confirmation sent (check bcc: info.bapita@gmail.com)
- [x] 🟡 WhatsApp float button visible after scrolling past hero
- [x] 🟡 Waze / Google Maps links work
- [X] 🟡 Social links (Instagram, Facebook) link to correct pages or open correctly
- [ ] 🟡 **DEFERRED — F8** Manual testimonials/Google reviews section not yet built. See F8 spec in implementation plan. Next priority after demo.
 
#### Bilingual (HE/EN toggle)
- [X] 🔴 Toggle button visible in both languages
- [X] 🔴 Page switches to RTL layout in Hebrew — no layout breaks
- [X] 🟡 All text strings translated (no English text visible in Hebrew mode)
- [X] 🟡 Service names, prices display correctly in both languages
- [X] 🟡 Booking overlay — all 4 steps in Hebrew look correct
- [X] 🟢 Hours section RTL row looks correct in Hebrew

---

### 1B — Owner Dashboard

#### Login / Auth
- [x] 🔴 Login page loads at dashboard.bapita.com/login
- [x] 🔴 Signup with new email works — creates business row
- [x] 🔴 Login with existing account works
- [x] 🔴 Redirect after login goes to /calendar (not 404)
- [x] 🔴 Direct access to /calendar without login redirects to /login
- [x] ✅ 2026-06-17 🟡 "Forgot password" flow works

#### Onboarding (new business, no data)
- [x] 🔴 First login with empty business → Settings shows setup form
- [x] 🔴 Setup form saves successfully — business row created in Supabase
- [x] ✅ 2026-06-17 🟡 After setup, user lands on calendar with empty state (not error)

#### Calendar
- [X] 🔴 Day view loads, shows today's bookings
- [✅ fixed commit 50fdbc9] 🔴 Week view now always starts on today as leftmost column.
- [x] 🔴 Month view loads
- [x] ✅ 2026-06-17 🔴 Tap a booking → drawer opens with correct booking details
- [x] ✅ 2026-06-17 🔴 Update booking status (confirmed → completed) → saves → reflects immediately
- [x] ✅ 2026-06-17 🟡 New booking chip shows correct service + time
- [x] ✅ 2026-06-17 🟡 "Today strip" shows booking count, revenue, up-next
- [x] ✅ 2026-06-17 🟡 Swipe/navigation between dates works on mobile

#### New Booking Flow (manual, owner-created)
- [x] 🔴 Step 1: Search existing client by name → works
- [x] 🔴 Step 1: Create new client → saves → advances
- [x] 🔴 Step 2: Service list loads → select service → advances
- [x] 🔴 Step 3: Time slots load based on business_hours → select slot → advances
- [x] ✅ 2026-06-17 🔴 Step 4: Confirm → booking saved → appears in calendar
- [x] ✅ 2026-06-17 🟡 Booking confirmation email sent (check BCC inbox)

#### Clients
- [x] ✅ 2026-06-17 🔴 Client list loads with all clients — layout fixed on desktop + mobile
- [x] 🔴 Search by name works
- [x] 🔴 Tap client → profile page loads
- [x] 🟡 Profile shows booking history, total spent, notes
- [x] ✅ 2026-06-17 🟡 Internal notes — can add/edit → saves correctly on desktop + mobile

#### Settings
- [x] 🔴 Business info form loads with existing data (not blank)
- [x] 🔴 `[YOU]` Edit business name / phone / address → Save → refresh → data persists ← **this is your known bug** → if broken: `[AI-CODE]` paste save handler + businesses table schema
- [x] 🔴 Services: Add new service → saves → appears in list
- [x] 🔴 Services: Toggle service on/off → saves
- [x] 🔴 Services: Delete service → removed from list
- [x] 🔴 Business hours: Toggle day on/off → saves → reflects in booking page slots
- [x] 🔴 Business hours: Change start/end time → saves → reflects in booking page slots
- [x] 🟡 Default language toggle (HE/EN) → saves → booking page reflects it

#### Insights
- [x] ✅ 2026-06-17 🟡 Revenue card shows correct number
- [x] ✅ 2026-06-17 🟡 Bar chart renders (Recharts) — no console errors
- [x] ✅ 2026-06-17 🟡 Stats grid shows bookings count, no-shows, etc.
- [x] ✅ 2026-06-17 🟡 Top services list populates

#### Profile
- [x] ✅ 2026-06-17 🟡 Password change works — sign out redirects to bapita.com (fixed)
- [x] ✅ 2026-06-17 🟡 Delete account works

#### Admin
- [x] 🔴 dashboard.bapita.com/admin/businesses → loads list of all businesses
- [x] 🔴 Add new business → saves → slug appears in list
- [x] 🔴 New slug accessible at book.bapita.com/[slug] after push

---

### 1C — Landing Page (bapita.com)

- [x] 🔴 Page loads on mobile — no horizontal scroll, no broken layout
- [x] ✅ 2026-06-17 🔴 All CTAs work — footer email corrected to info.bapita@gmail.com, WhatsApp removed
- [X] 🔴 Pricing section is accurate (or intentionally absent — correct per your strategy)
- [x] ✅ 2026-06-17 🟡 Contact method clear — LP calendar widget fixed (was sending Google Calendar invite from wrong account)
- [X] 🟡 Demo links (classic/clean/dark) visible and working
- [X] 🟢 Page loads fast (< 3s on 4G mobile)







---

### AI Prompt for Visual QA (Use This Right Now)

For each screenshot you take of a broken/ugly screen, paste this into Claude:

```
You are a senior UX/QA engineer reviewing a SaaS booking product for Israeli barbershops.

Page: [PAGE NAME]
Device: [mobile 375px / desktop 1440px]
Language: [Hebrew / English]

Issues to identify:
1. Broken layout or overflow (anything cut off, overlapping, misaligned)
2. Missing user feedback (no loading state, no success/error message)
3. Trust-breaking elements (unprofessional look, broken images, wrong fonts)
4. Incomplete flows (dead-end screens, buttons that do nothing)
5. Mobile-specific issues (touch targets too small, scroll issues, font too small)

Be specific. Describe exact element, exact problem, severity (P1/P2/P3).
Suggest the fix if obvious.

[Attach screenshot]
```

### AI Prompt for Code/Data Issues (Settings Save Bug, etc.)

```
You are a senior Next.js + Supabase engineer.

I have a suspected bug: when I save [SETTINGS PAGE / SPECIFIC FORM], I'm not sure if the data persists.

Here is the relevant code:
[paste the save handler / API route / Supabase call]

Here is the Supabase table schema for the relevant table:
[paste schema]

Tell me:
1. Is the data actually being written to Supabase on save?
2. Is the UI giving proper success/error feedback?
3. Are there any race conditions or missing await/error handling?
4. What would you change to make this bulletproof?
```

---

## PHASE 2 — Business Gaps (Fix Today, Parallel to QA)

These are not code. These are the things that make you look like a real business.

---

### 2A — Payment Setup (CRITICAL — can't take money without this)

**Recommended for day 1 (Israel):**

Option A — Bit (ביט): Best for Israeli clients, they all have it. You receive to your personal account. Downside: no invoice, no record keeping.

Option B — PayPal: Works. Send invoice → client pays online. Looks professional. Creates a record.

Option C — Both: Use PayPal for setup fee (invoice them), Bit for monthly.

**What to do right now:**
1. Create a PayPal business account at paypal.com/il (if you don't have one)
2. Set up PayPal invoicing — you'll use this for the ₪2,500 setup fee
3. Have your Bit number ready for monthly ₪200 payments
4. Write down your payment details in a note so you can send them instantly

**What to say when client asks how to pay:**
> "Setup fee via PayPal invoice — I'll send it to your email. Monthly ₪200 via Bit."

---

### 2B — Client Contract (CRITICAL — don't onboard without this)

You need a 1-page agreement. Not a 10-page legal document. Just something that sets expectations.

**What it must cover:**
1. What you're building (booking page + dashboard access)
2. Setup fee amount and when it's due (before you start)
3. Monthly fee and what happens if they stop paying (you take page down)
4. What's NOT included (custom development, ads spend, WhatsApp messages beyond plan)
5. Turnaround time (2 business days after payment received)
6. Basic support terms (WhatsApp, response within 24 hours on weekdays)

**Where to keep it:** Google Drive. One folder per client. Share a PDF with them.

**How to send it:** WhatsApp message with PDF link. Or email. Don't overthink it.

**→ I'll generate a full Hebrew/English contract template for you. Just ask.**

---

### 2C — Support Process (Decide Now, Write It Down)

**The answer to "what do I do when a client messages me at 11pm" is:**

Set expectations upfront. Say this during onboarding:
> "Support is via WhatsApp. I respond within 24 hours on weekdays. For urgent issues affecting active bookings, I'll try to respond same day."

**Create one WhatsApp group per client.** Put them and yourself in it. All communication lives there. No scattered DMs.

**Your support tier for now:**
- Included in ₪200/month: Service/price updates, basic troubleshooting
- Not included: Building new features, ad campaigns, custom design changes

---

### 2D — Resend Domain Verification (Emails Are Silently Failing)

This is a P1 if you want email confirmations to work.

Steps:
1. Go to resend.com → Domains
2. Add bapita.com
3. Get the DNS records (3-4 records: SPF, DKIM, etc.)
4. Add them to your domain registrar (wherever you bought bapita.com)
5. Wait up to 24h for verification
6. Test: trigger a booking on demo-classic → check info.bapita@gmail.com for BCC

Do this right now in the background while you QA. It takes 10 minutes to set up, then you wait.

---

## PHASE 3 — Sales Preparation (Before First Outreach)

---

### 3A — Your Sales Script (Door-to-Door)

**The setup:**  
Walk in, phone in hand, demo-classic open. Ask for the owner. Don't pitch to the barber cutting hair.

**The script (Hebrew, adapt to feel natural):**

---

**Walk in, greet:**
> "שלום, אתה הבעלים? יש לי דקה?"

**If yes:**
> "אני בונה אתרי הזמנות לספרים. שם שלי [שם]. תראה מה הכנתי."

Open book.bapita.com/demo-classic on your phone. Hand it to him.

**Let him scroll. Say nothing for 30 seconds. Then:**
> "הלקוחות נכנסים, בוחרים שירות, בוחרים שעה — ומוזמנים. בלי וואטסאפ, בלי 'מתי אתה פנוי'."

**Ask questions before pitching price:**
> "איך אתה מקבל הזמנות עכשיו?"

Let him answer. Then:
> "כמה הודעות וואטסאפ אתה עונה ביום על שאלות 'מתי אתה פנוי'?"

Let him answer. Then:
> "אני בונה לך את הדף תוך יומיים. אחרי זה ₪200 בחודש — אחסון, גישה לדשבורד, תמיכה. ה-setup עולה ₪2,500."

**If he asks why that price:**
> "זה כולל את הבנייה, ההגדרה, העלאת השירותים והתמונות שלך, וחיבור הדומיין. יומיים עבודה."

**The preview close (best opener):**
> "רוצה שאבנה לך תצוגה מקדימה עם השם שלך? לא עולה כלום. תראה איך זה נראה עם המידע שלך — ואז תחליט."

**If he says yes:** Take his name, phone, Instagram handle, and a few photos on the spot.  
**If he says "תחשוב על זה":**
> "ברור. אשאיר לך את הקישור לדמו. שתף את זה עם מי שאתה רוצה שיראה. מתי תרצה שאחזור?"

---

**English version (for reference):**

> "Hey, are you the owner? Got a minute? I build booking pages for barbershops. Let me show you something."

Hand him the phone. Let him scroll.

> "Clients come in, pick a service, pick a time, done. No WhatsApp back and forth."
> "How do you take bookings right now?"
> "₪2,500 setup, ₪200/month. Live in 2 days."

---

### 3B — The Loom Video Script (Instagram DM Outreach)

**60–90 seconds. Screen recording. No camera needed.**

**Structure:**
1. (0:00–0:10) Open on their Instagram: "Hey [Name], saw your work on Instagram — love it. I work with barbers in [area]..."
2. (0:10–0:25) Name the pain: "I'm guessing you get a lot of DMs about 'when are you free' — it's a time suck."
3. (0:25–0:60) Switch to demo-classic: "I built this for a barber — your page would look exactly like this. Your name, your services, your photos. Clients pick a slot in under a minute."
4. (0:60–0:80) Show booking flow quickly
5. (0:80–0:90) CTA: "I'll build you a preview with your name, no cost. Just reply and I'll show you."

**The DM message:**
> "היי [שם], הכנתי לך סרטון קצר [Loom link] 👈"

That's it. No pitch in the message. The video is the pitch.

---

### 3C — Objection Handling (Memorize These)

| Objection | Response |
|---|---|
| "יש לי כבר אתר" | "האתר שלך לוקח הזמנות? Bapita כן. זה לא אתר — זה מערכת הזמנות." |
| "אני משתמש ב-Booksy" | "Booksy לוקחים ממך כסף על כל הזמנה. Bapita — ₪200 בחודש, לא משנה כמה הזמנות." |
| "יקר לי" | "לקוח אחד נוסף בחודש מכסה את כל השנה. תקבל הרבה יותר מזה." |
| "צריך לחשוב" | "רוצה שאבנה תצוגה מקדימה עם השם שלך? בחינם. תחליט אחרי שתראה." |
| "אין לי זמן" | "זה לא עוד דבר שצריך לנהל — זה הדבר שמוריד ממך את הניהול." |

---

## PHASE 4 — Onboarding Checklist (When You Close a Client)

This is your internal process. Do it in order, every time.

### Day 0 (Closing)
- [ ] Get verbal yes
- [ ] Send contract PDF via WhatsApp
- [ ] Send PayPal invoice for setup fee
- [ ] Confirm payment received before starting anything

### Day 1 (Build)
- [ ] dashboard.bapita.com/admin/businesses → Add New Business
  - [ ] Business name, slug, phone, address, tagline, about text
  - [ ] Template choice (Classic / Clean / Dark)
  - [ ] Default language (HE/EN)
- [ ] Add all services (name, price, duration)
- [ ] Set business hours
- [ ] Upload hero image
- [ ] Upload gallery images
- [ ] Set Instagram / Facebook / WhatsApp links
- [ ] Push to GitHub → live in 35 seconds at book.bapita.com/[slug]
- [ ] Verify page looks correct on mobile

### Day 2 (QA + Delivery)
- [ ] Do a full booking test as if you're the client
  - [ ] Select service → select date → select time → fill form → submit
  - [ ] Check booking appears in owner dashboard
  - [ ] Check BCC email received
- [ ] Screenshot the live page
- [ ] Record a 60-second Loom walkthrough of their page (personal touch)
- [ ] Send to client via WhatsApp:
  > "הדף שלך חי! 🎉 [link] תשתף אותו ב-Bio של האינסטגרם שלך ובסטוריז — ועדכן אותי כשמגיעה ההזמנה הראשונה"
- [ ] Add client to a dedicated WhatsApp group (you + them)
- [ ] Set up monthly payment reminder (Bit ₪200 on the same date every month)

### First Week (Check-in)
- [ ] After 3 days: "הכל עובד? קיבלת הזמנות?"
- [ ] After 7 days: Send them their stats from the dashboard (screenshot)
- [ ] Ask for a testimonial if they're happy (screenshot of them, quote, booking count)

---

## PHASE 5 — The Questions You Weren't Asking

These are the business questions that will hurt you later if you don't answer them now:

### Pricing & Money
- **How do you track who paid and who hasn't?** Right now: spreadsheet minimum. One Google Sheet with client name, setup paid (Y/N), date, monthly amount, next billing date, add-ons.
- **What happens when a client doesn't pay monthly?** You need a policy: 7-day grace period → page goes offline. Say this in the contract. Don't be surprised by this conversation.
- **Do you charge VAT (מע"מ)?** If you're operating as a business in Israel, you may need to issue invoices with VAT. Check if you're registered as עוסק מורשה or עוסק פטור. This affects your pricing.

### Operations
- **What if Vercel or Supabase goes down?** You have no SLA to clients right now. Your contract should say "best-effort uptime, not guaranteed." Vercel and Supabase free tiers have limits — check if you'll hit them with 10+ clients.
- **What's your Supabase free tier limit?** Free tier: 500MB DB, 2GB bandwidth, 50,000 MAUs. With 5–10 clients and light use, you're fine. At 20+ clients, check.
- **What happens when you're sick or traveling?** You need a backup plan or at least a "I respond within 48 hours" disclaimer in your contract.

### Product
- **How do you update a client's service prices remotely?** Via the admin dashboard or their own settings page. Make sure you've confirmed which one actually works.
- **Can clients log in to their own dashboard?** Yes — they get their own login. Make sure you've tested the multi-tenant isolation. Client A should NOT see Client B's bookings. (RLS should handle this but confirm.)
- **What happens when a client wants a custom design change?** Your policy: not included in ₪200/month. Quoted separately. Write this in the contract.

### Growth
- **What's your target for Month 1?** Be honest. 2 clients at ₪2,500 setup + ₪200/month = ₪5,400 in month 1. That's a real number. Set it.
- **When do you record the Loom?** Right after you polish the demos. Not next week. This week.
- **What's your Instagram / outreach channel?** You need a profile or at least a link in bio pointing to bapita.com for credibility when barbers Google you after you DM them.

---

## Today's Priority Order (Hours, Not Phases)

If you have 6 hours today, do this:

| Time | Task |
|---|---|
| Hour 1 | PHASE 0: Open every URL, write down what's broken |
| Hour 2–3 | Fix all P1 bugs (start with the settings save + mobile homepage) |
| Hour 3.5 | Set up Resend DNS (10 min, then wait) |
| Hour 4 | Set up PayPal business account + invoicing |
| Hour 4.5 | Test full booking flow end-to-end on demo-classic on mobile |
| Hour 5 | Read and internalize the sales script |
| Hour 5.5 | Ask me to generate the contract |
| Hour 6 | Record Loom of demo-classic (use this as your sales tool tomorrow) |

---

## Files to Create Next (Ask Me)

- [ ] **Client contract (Hebrew + English)** — 1 page, simple, professional
- [ ] **Client billing tracker** — Google Sheets template
- [ ] **AI QA prompts per specific page** — tailored to your exact screens
- [ ] **Loom script (full word-for-word)** — for the video DM
- [ ] **WhatsApp message templates** — for follow-up, delivery, check-in, monthly billing
- [ ] **Supabase RLS verification prompt** — confirm multi-tenant isolation is airtight

---

## Known Bugs to Fix (From Your Own Description + Docs)

| Bug | Page | Priority | AI Prompt to Fix |
|---|---|---|---|
| Mobile homepage layout breaks | bapita.com | 🔴 P1 | Paste mobile screenshot + code to Claude with visual QA prompt |
| Settings save may not persist | dashboard/settings | 🔴 P1 | Paste save handler code to Claude with code review prompt |
| Email confirmations silently fail | all booking flows | 🔴 P1 | Fix Resend DNS (Phase 2D above) |
| ~~demo-clean / demo-dark — status unclear~~ | book.bapita.com | ✅ Fixed 2026-06-15 | Hero redesign + RTL fixes + bilingual |
| Booking overlay Hebrew RTL | booking overlays | 🟡 P2 | Test and screenshot |
| Dark template: BookingOverlay bg color | demo-dark | 🟡 P2 | Should be #1A1A1A per v3 checklist |
| SectionGallery mobile touch dismiss | all templates | 🟡 P2 | Test on phone |

---

*This file is your single source of truth for launch. Update it as you complete items.*  
*Last updated: 2026-06-17 — all manual QA items verified ✅ by Rami. One deferred item: F8 Testimonials (not blocking demo).*

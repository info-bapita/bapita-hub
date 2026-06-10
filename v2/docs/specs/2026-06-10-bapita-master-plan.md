# Bapita — Master Plan: Design Overhaul & Feature Completion
**Date:** 2026-06-10  
**Status:** Active  
**Approach:** Design system first → page-by-page redesign + bug fixes → new features  

---

## What this plan covers

The dashboard (dashboard.bapita.com) currently looks unprofessional on both mobile and desktop — broken layouts, visual inconsistencies, not premium. The landing page (bapita.com) also needs polish.

This plan fixes everything in 10 ordered chat sessions. Each session ends with a GitHub push and Vercel auto-deploys the changes live.

**Design north star:** Google Calendar simplicity + Boulevard visual quality — premium but simple, built for a solo barber who has never used software like this before.

---

## Live URLs
- Dashboard: https://dashboard.bapita.com
- Landing page: https://bapita.com

## Repos
- Dashboard: `/Users/admin/Desktop/bapita-dashboard/` → github: `ramikan96-collab/bapita-dashboard`
- Docs + landing page: `/Users/admin/Desktop/bapita/` → github: `ramikan96-collab/bapita`
- Landing page has its own git: use `git -C /Users/admin/Desktop/bapita/v2/src/dashboard` for LP git ops

## Key docs
- Brand doc: `/Users/admin/Desktop/bapita/v2/docs/brand/bapita-brand-doc-v2.md`
- Design system (created in Chat 2): `/Users/admin/Desktop/bapita/v2/docs/design-system.md`
- This file: `/Users/admin/Desktop/bapita/v2/docs/specs/2026-06-10-bapita-master-plan.md`

---

## How to follow this guide

1. Work through chats **in order** — each builds on the previous
2. **Before pasting a prompt**, type the effort level command first (shown per chat)
3. **After each chat**, check the live URL to confirm the change is visible
4. **Do not skip** Chat 2 — the design system doc is required for all redesign chats
5. Each chat is self-contained — no need to reference prior chat history

---

## Progress tracker

- [x] Chat 1 — README & Organization
- [x] Chat 2 — Design System Document
- [ ] Chat 3 — App Shell + Login
- [ ] Chat 4 — Calendar
- [ ] Chat 5 — Clients List + Client Profile
- [ ] Chat 6 — New Booking Flow
- [ ] Chat 7 — Insights
- [ ] Chat 8 — Settings + Profile + Add-ons
- [ ] Chat 9 — Public Booking Page (/book/[slug])
- [ ] Chat 10 — Landing Page (bapita.com)

Check each box when the chat is pushed and live.

---

## Rules that apply to every chat

- Read all referenced files before writing any code
- Fix every visual bug and broken layout you find on the pages you touch
- Never use pure white (#FFFFFF) as page background — use cream (#FAF5EC)
- Never use cold blue, sharp corners, or enterprise/complex UI patterns
- Every chat ends with a GitHub push
- Chats 3–10: read the design system doc (`/Users/admin/Desktop/bapita/v2/docs/design-system.md`) before writing any code

---

## CHAT 1 — README & Organization

**Effort:** `/effort medium`  
**Repo:** bapita  
**Goal:** Clean, trackable README with progress tracker at top  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses (barbershops, salons, nail techs, etc.). I have two repos:

- Dashboard (Next.js app): /Users/admin/Desktop/bapita-dashboard/
- Docs + landing page: /Users/admin/Desktop/bapita/

Task: Restructure the README at /Users/admin/Desktop/bapita/README.md

Read it first. Then:

1. Add a PROGRESS TRACKER section near the top with checkboxes for all 10 implementation chats listed in /Users/admin/Desktop/bapita/v2/docs/specs/2026-06-10-bapita-master-plan.md. Format: "- [ ] Chat N — [name]"

2. Add a QUICK REFERENCE section with:
   - Live URLs: dashboard.bapita.com and bapita.com
   - Repo paths on disk
   - Key commands (how to push landing page — uses its own git at v2/src/dashboard/)
   - Vercel project names
   - Key env vars (names only, no values)

3. Keep all existing content — only add and reorganize, don't delete useful information.

4. Make sure the folder structure section in the README matches what actually exists on disk. Read the actual directory structure to verify.

When done, commit and push:
git -C /Users/admin/Desktop/bapita add README.md && git -C /Users/admin/Desktop/bapita commit -m "docs: restructure README with progress tracker and quick reference" && git -C /Users/admin/Desktop/bapita push
```

---

## CHAT 2 — Design System Document

**Effort:** `/effort medium`  
**Repo:** bapita  
**Goal:** Create the design system doc that all redesign chats reference  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses (barbershops, salons, nail techs, etc.). The dashboard is at dashboard.bapita.com.

Context:
- Target user: solo barber/nail tech/salon owner. No tech skills. Uses phone. Never had a website.
- Design goal: premium visual quality (like Boulevard / GlossGenius) but MUCH simpler. Not enterprise. One location, one owner.
- Brand: amber #E8920A, terra cotta #D4622A, cream #FAF5EC, dark #1E1A14, Heebo font (must support Hebrew RTL)
- Stack: Next.js 16, Tailwind CSS v4, Supabase

Read these files first:
- /Users/admin/Desktop/bapita/v2/docs/brand/bapita-brand-doc-v2.md
- /Users/admin/Desktop/bapita-dashboard/src/app/globals.css
- /Users/admin/Desktop/bapita-dashboard/src/components/AppShell.tsx

Step 1 — Research reference platforms:
Use WebSearch or WebFetch to look at Boulevard (boulevard.io) and GlossGenius mobile UI screenshots or documentation. Understand:
- Their mobile navigation pattern (bottom nav? tabs? drawer?)
- How they handle the calendar/schedule view
- What "premium" looks like at their quality level
Note what to borrow (visual quality, clean patterns) and what to avoid (enterprise complexity, multi-location features Bapita doesn't need).

Step 2 — Propose navigation structure:
The dashboard has these screens: Calendar, Clients, Insights, Settings, Add-ons, New Booking.
Design the mobile navigation. Rules:
- New Booking should NOT be a dedicated tab — users tap a time slot on the calendar to create a booking (like Google Calendar). A FAB (floating action button) serves as secondary shortcut.
- Add-ons lives inside Settings (used rarely, not daily)
- Bottom nav: max 4–5 items
- Calendar top bar: ☰ left + "Month Year ▾" center (opens date picker) + ⋮ right (Day/Week/Month view toggle + filter by status + calendar settings)
Recommend a structure with brief reasoning before finalizing.

Step 3 — Write the design system document at:
/Users/admin/Desktop/bapita/v2/docs/design-system.md

Document must cover:

### Colors
- Full token list with HEX values
- Usage rules for each (e.g. "amber: primary buttons, today highlight, confirmed status — never use as text on white")
- Status colors: pending/confirmed/completed/cancelled/no-show

### Typography (Heebo)
- Scale: H1 / H2 / H3 / H4 / body-lg / body / label / caption
- Size, weight, line-height for each
- Mobile vs desktop size differences if any
- Minimum font size: 15px on mobile

### Spacing
- Base unit and full scale (4/8/12/16/24/32/48/64px)
- When to use which size

### Border radius
- Cards: ?px
- Buttons: ?px
- Inputs: ?px
- Badges/pills: full rounded
- Drawers/modals: ?px top corners

### Shadows
- Card shadow spec
- Drawer shadow spec
- No harsh box shadows — warm, soft

### Components
For each: describe visually + give CSS/Tailwind guidance
- Card
- Button (primary / secondary / ghost / danger)
- Input + label
- Status badge/pill
- FAB
- Toast (success/error)
- Drawer/sheet (mobile)
- Loading skeleton

### Mobile navigation (finalized from Step 2)
- Bottom nav: exact items, icons, active state
- Top bar: structure per page type
- Calendar top bar: detailed spec
- FAB: size, color, position, behavior

### Calendar patterns
- Week strip: height, day cell size, today highlight style
- Time grid: pixels per hour, grid line style
- Booking block: height calculation, content (client name + service), status color rule (left border? background?)
- Auto-scroll: scroll to business opening hour on load (not midnight)
- Day view vs week view differences

### RTL / Hebrew
- All layouts must support RTL
- Text alignment rules
- Any known Tailwind RTL gotchas for this project

When done, commit and push:
git -C /Users/admin/Desktop/bapita add v2/docs/design-system.md && git -C /Users/admin/Desktop/bapita commit -m "docs: add comprehensive design system" && git -C /Users/admin/Desktop/bapita push
```

---

## CHAT 3 — App Shell + Login

**Effort:** `/effort high`  
**Repo:** bapita-dashboard  
**Goal:** Fix the navigation frame (AppShell) and login page — these are seen on every screen  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses. The dashboard is a Next.js 16 PWA at dashboard.bapita.com.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/components/AppShell.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/app/login/page.tsx
4. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/layout.tsx
5. /Users/admin/Desktop/bapita-dashboard/src/app/globals.css
6. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts

Context:
- Stack: Next.js 16 (App Router), Tailwind CSS v4, Supabase auth, Heebo font, PWA
- Target: solo barber using phone. Must work perfectly on mobile.
- Brand: amber/cream/dark/terra cotta — see design system doc for exact specs
- Note: This is Next.js 16 with potentially breaking changes. Read /Users/admin/Desktop/bapita-dashboard/AGENTS.md before writing code.

Task: Redesign AppShell.tsx and the login page to match the design system exactly. Fix ALL bugs you find.

AppShell — mobile:
- Bottom nav: implement exactly as specified in design system doc
- Top bar: hamburger left + page title center + context actions right
- Calendar-specific top bar (when on /calendar): ☰ + "Month Year ▾" + ⋮ menu (Day/Week/Month toggle, filter by status, settings link)
- Hamburger drawer: full-height slide-in, shows business name/logo, nav items, logout button
- FAB: amber circle, bottom-right, always visible on calendar page, opens new booking flow

AppShell — desktop:
- Slim sidebar: icons + labels, amber active indicator, cream bg
- Top bar on desktop: page title + context actions (no hamburger needed)
- Sidebar must not interfere with main content area

Login page:
- Clean, premium, Bapita branded
- Bapita wordmark/logo at top center
- Login and "Create account" tabs
- Email + password fields, amber focus ring, clear error states
- Primary button: amber fill, full width, bold text
- "Free consultation. No commitment." trust line
- Works perfectly on mobile (this is the first thing a client sees)

Fix every visual bug, layout break, and z-index issue you find in AppShell and login.

When done, run a quick check that the app builds without errors, then push:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: app shell + login — design system implementation" && git push

Verify live at https://dashboard.bapita.com after Vercel deploys (usually 1–2 min).
```

---

## CHAT 4 — Calendar

**Effort:** `/effort high`  
**Repo:** bapita-dashboard  
**Goal:** Rebuild the calendar as the premium home screen — week view, scrollable time grid, tap-to-book  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses. The calendar is the home screen — the first thing a barber sees every morning.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/calendar/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/components/calendar/WeekView.tsx
4. /Users/admin/Desktop/bapita-dashboard/src/components/calendar/DayView.tsx
5. /Users/admin/Desktop/bapita-dashboard/src/components/calendar/MonthView.tsx
6. /Users/admin/Desktop/bapita-dashboard/src/components/calendar/BookingDrawer.tsx
7. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
8. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Design reference: Google Calendar mobile app (UX pattern). Boulevard/GlossGenius (visual quality level).

Task: Redesign the calendar to match the design system. Fix ALL bugs.

Week view (default home screen):
- 7-day strip at top: M T W T F S S with date numbers
- Today: amber circle highlight (brand color, not blue)
- Tapping a day column = switches to day view for that day
- Scrollable time grid below the strip
- Time labels left column (e.g. "9:00", "10:00")
- Auto-scroll to business opening hour on load (not midnight, not top)
- Booking blocks: show client name + service name. Left border colored by status (amber=confirmed, green=completed, slate=pending, red=cancelled). Tap block = opens BookingDrawer.
- Tapping an EMPTY time slot = opens new booking flow pre-filled with that time
- FAB bottom-right (amber + circle): opens new booking flow (shortcut)
- Week navigation: swipe left/right OR arrow buttons
- Availability blocking: long-press empty slot → "Block time" sheet (date, start, end, label). Blocked slots show diagonal stripe pattern, tap to remove. See design-system.md for full spec.

Day view:
- Single column timeline, same time grid
- Shows full day for selected date
- Same booking block style
- "Today strip" at top: total bookings count + earned today + next appointment chip

Month view:
- Clean grid, dots/chips showing booking count per day
- Tap a day = switch to day view for that day

BookingDrawer (slide-up sheet on mobile):
- Shows full booking details: client name, service, time, status, price
- Status update buttons
- Checkout / mark complete action
- Clean, readable, no clutter

Fix every bug, layout break, and performance issue you find.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: calendar — premium week/day/month views with tap-to-book" && git push

Verify live at https://dashboard.bapita.com
```

---

## CHAT 5 — Clients List + Client Profile

**Effort:** `/effort high`  
**Repo:** bapita-dashboard  
**Goal:** Clean client management — list, search, profile with history  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/clients/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/clients/[id]/page.tsx
4. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
5. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Task: Redesign clients list and client profile to match the design system. Fix ALL bugs.

Clients list:
- Search bar at top: search by name or phone
- Sort options: Recent / Name A-Z / Most visits
- Client card: name, phone, total visits, last visit date — clean, readable
- Empty state: warm, encouraging, not generic
- No clutter. A barber scans this fast between clients.

Client profile:
- Header: name, phone number, total visits, total spent — prominent
- Booking history list: date, service, status badge, price — scannable
- Internal notes section: free text, saves to Supabase
- Action button: "New booking for this client" → opens new booking flow pre-filled with this client

Fix every bug and layout issue you find.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: clients list + client profile — design system implementation" && git push

Verify live at https://dashboard.bapita.com/clients
```

---

## CHAT 6 — New Booking Flow

**Effort:** `/effort high`  
**Repo:** bapita-dashboard  
**Goal:** 4-step booking wizard — clean, guided, no dead ends, works perfectly  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/new-booking/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
4. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Task: Redesign the new booking flow to match the design system. Fix ALL bugs and broken states.

The flow has 4 steps:
1. Client — search existing client by name/phone, or create new (name + phone)
2. Service — pick a service from the list (shows duration + price)
3. Time — pick a date, then available time slots
4. Confirm — review summary, confirm booking

Requirements:
- Step indicator at top: clear progress (Step 1 of 4)
- Back button: always works, doesn't lose data
- Mobile: each step is full screen, large tap targets
- No dead ends: if something fails, show a clear error with a path forward
- Time slot grid: clean, shows available vs unavailable, business hours respected
- Confirm screen: full summary before submitting, amber "Confirm booking" button
- Success state: clear confirmation, offer to add another or go to calendar
- If flow was triggered from calendar (pre-filled time slot): skip to step 1 (client) with time pre-set

Fix every bug, broken step, and validation gap you find.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: new booking flow — 4-step wizard, bug fixes" && git push

Verify live at https://dashboard.bapita.com/new-booking
```

---

## CHAT 7 — Insights

**Effort:** `/effort medium`  
**Repo:** bapita-dashboard  
**Goal:** Clean, readable stats page — glanceable on mobile  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/insights/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
4. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Task: Redesign the insights page to match the design system. Fix ALL bugs.

Requirements:
- Revenue hero card: this week's earnings, large and prominent, amber accent
- Stat grid (2 columns on mobile): total bookings, no-show rate, new vs returning clients, top service
- Bar chart (Recharts): weekly revenue, amber bars, readable on mobile, no excess labels
- Status breakdown: count + percentage per status (confirmed/completed/cancelled/no-show) as pill badges
- Top services: ranked list, shows service name + booking count
- Keep it simple — a barber checks this once a week. No enterprise analytics complexity.
- All numbers readable at a glance on mobile.

Fix every bug and layout issue you find.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: insights page — clean stats, design system implementation" && git push

Verify live at https://dashboard.bapita.com/insights
```

---

## CHAT 8 — Settings + Profile + Add-ons + Financials + Usage

**Effort:** `/effort medium`  
**Repo:** bapita-dashboard  
**Goal:** All pages accessible from the hamburger drawer — forms that work, add-ons as upsell cards, Financials with Stripe connect state  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/settings/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/profile/page.tsx
4. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/addons/page.tsx
5. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/financials/page.tsx
6. /Users/admin/Desktop/bapita-dashboard/src/app/(dashboard)/usage/page.tsx
7. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
8. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Navigation context: Settings, Add-ons, Usage, Profile are all accessed via the hamburger drawer (☰), NOT the bottom nav. Financials IS a bottom nav tab (4th tab).

Task: Redesign all these pages to match the design system. Fix ALL bugs.

Settings — Business Info tab:
- Form fields: business name, owner name, phone, address, slug (booking page URL)
- Save button: clear success/error feedback via toast

Settings — Services tab:
- List of services with name, duration, price
- Add / toggle active / delete per service
- Add service: inline form or modal

Settings — Business Hours tab:
- Per-day open/closed toggle + start/end time pickers
- Hebrew day names (Sun–Sat order for Israeli calendar)

Profile page:
- Password change form
- Email (read-only)

Add-ons page (accessed via hamburger):
- Cards for: WhatsApp Automations, Stripe Payments, Google Business, Social Media, Ads
- Each card: name, 1-line description, status (active/not active), "Contact us" CTA → WhatsApp
- Active add-ons show clearly with amber active badge
- Premium upsell feel — not a settings dump

Usage page (accessed via hamburger):
- Per-add-on stats: messages sent (WhatsApp), payments processed (Stripe), etc.
- Read-only dashboard, glanceable
- Only shows stats for active add-ons
- Empty state for inactive add-ons: "Activate [add-on] to see stats"

Financials page (bottom nav tab — 4th):
- If Stripe NOT connected: premium full-screen "Get paid online" page
  - Headline: "Accept payments for bookings"
  - Description: activate Stripe add-on to accept online payments
  - CTA: "Contact us to activate" → WhatsApp
  - Design: clean, premium, not a dead end
- If Stripe connected:
  - Revenue this month (hero number, amber)
  - Transaction history list: date, client, service, amount, status
  - Payout summary

Fix every bug and broken form interaction you find.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: settings + profile + add-ons + financials + usage — design system implementation" && git push

Verify live at https://dashboard.bapita.com/settings
```

---

## CHAT 9 — Public Booking Page

**Effort:** `/effort high`  
**Repo:** bapita-dashboard  
**Goal:** Customer-facing booking flow — the page a barber's clients use to book appointments  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses. Each client (barber) gets a public booking page at dashboard.bapita.com/book/[slug] where their customers can book appointments.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita-dashboard/src/app/book/[slug]/page.tsx
3. /Users/admin/Desktop/bapita-dashboard/src/app/book/[slug]/BookingFlow.tsx
4. /Users/admin/Desktop/bapita-dashboard/src/app/api/public/book/route.ts
5. /Users/admin/Desktop/bapita-dashboard/src/app/api/public/slots/route.ts
6. /Users/admin/Desktop/bapita-dashboard/src/app/api/send-confirmation/route.ts
7. /Users/admin/Desktop/bapita-dashboard/src/types/index.ts
8. /Users/admin/Desktop/bapita-dashboard/AGENTS.md

Context:
- This page is shown to the barber's CUSTOMERS — not the barber
- Must feel trustworthy and professional (this is how customers judge the barber)
- Mobile-first — customers are on phones
- Hebrew RTL support required
- Email confirmation is sent via Resend after booking (noreply@bapita.com)

Task: Build/redesign the public booking page to be complete, working, and premium.

The booking flow:
1. Landing: business name, photo/logo (from business profile), services listed with duration + price
2. Select service → pick a date → pick an available time slot
3. Enter name + phone (email optional)
4. Confirm booking → sends email confirmation + shows success screen

Requirements:
- Loads business info from Supabase by slug
- Available slots calculated from business_hours JSONB + existing bookings (no double-booking)
- Email confirmation sent on success
- Error states: business not found (404), no availability, booking failed
- Loading states for every async step
- Success screen: booking details summary, "Add to calendar" option (ICS file)
- Design: warm, branded with Bapita but adaptable to each business (show business name prominently)
- Works on mobile and desktop

Fix every bug in the API routes and booking flow. Make sure this works end-to-end.

When done:
cd /Users/admin/Desktop/bapita-dashboard && git add src/ && git commit -m "feat: public booking page — complete end-to-end customer booking flow" && git push

Verify live at https://dashboard.bapita.com/book/[your-test-slug]
```

---

## CHAT 10 — Landing Page (bapita.com)

**Effort:** `/effort medium`  
**Repo:** bapita (landing page sub-git)  
**Goal:** Polish the landing page — brand consistent, CTA clear, no broken elements  

```
I'm building Bapita — a done-for-you booking platform for Israeli appointment businesses. The landing page is at bapita.com — a single index.html file.

Read these files first (in order):
1. /Users/admin/Desktop/bapita/v2/docs/design-system.md  ← REQUIRED before writing any code
2. /Users/admin/Desktop/bapita/v2/docs/brand/bapita-brand-doc-v2.md
3. /Users/admin/Desktop/bapita/v2/src/dashboard/index.html

Important: The landing page has its own git repo inside the main repo. All git operations use:
git -C /Users/admin/Desktop/bapita/v2/src/dashboard [command]

Task: Polish the landing page to be consistent with the design system and brand doc. Fix ALL bugs.

Requirements:
- Colors and fonts must match the design system exactly (amber/cream/dark/Heebo)
- Mobile-first — test every section at mobile width
- Hero: strong pain-first or outcome-first headline, clear primary CTA ("Get a free demo" → WhatsApp), trust line below CTA
- Navigation: clean, WhatsApp CTA button visible
- Problem section: 3–4 real scenarios (barbers recognize themselves)
- Solution: what Bapita builds (booking site + dashboard)
- Services: cards — Booking Website, Owner Dashboard, Email Confirmation. No prices.
- Add-ons: accordion/dropdown, each with "Let's Talk" → WhatsApp
- How it works: 3 steps
- FAQ: objection handling (from brand doc)
- Final CTA: "Book a free 15-min call"
- Footer: bapita.com, WhatsApp, Instagram, trust line

Fix any broken sections, misaligned elements, or inconsistent styling.

When done:
git -C /Users/admin/Desktop/bapita/v2/src/dashboard add index.html && git -C /Users/admin/Desktop/bapita/v2/src/dashboard commit -m "redesign: landing page — design system polish, mobile fixes" && git -C /Users/admin/Desktop/bapita/v2/src/dashboard push

Verify live at https://bapita.com after Vercel deploys.
```

---

## After all 10 chats are complete

1. Test the full user journey end-to-end:
   - Visit bapita.com on mobile
   - Open dashboard.bapita.com → login → check calendar → add a booking → check clients → check insights → update settings
   - Visit a public booking page → complete a test booking → confirm email received
2. Mark all checkboxes in the Progress Tracker above
3. Update the README progress tracker

---

*Spec created: 2026-06-10 | Author: Rami Kandiyoti*

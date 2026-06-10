# Bapita

Done-for-you booking platform for Israeli appointment businesses.

**Domain:** bapita.com  
**Tagline:** Built for you. Runs without you.  
**Stack:** Next.js 16 + Supabase + Vercel

## What Bapita builds for clients
- Booking website (public): services, gallery, calendar, booking form, email confirmation — deployed on client's own domain
- Owner dashboard (private): today/week view, booking list, client history, stats — centralized at dashboard.bapita.com
- Add-ons: WhatsApp automations, Stripe payments, Google Business management

## Pricing (internal)
- Setup: ₪2,500 (flexible)
- Monthly maintenance: ₪200/mo (dashboard access + support)

---

## Deployments

| What | Where |
|---|---|
| Landing page (live) | https://bapita.com |
| Owner dashboard (live) | https://dashboard.bapita.com |
| Landing page GitHub | https://github.com/ramikan96-collab/bapita |
| Dashboard GitHub | https://github.com/ramikan96-collab/bapita-dashboard |
| Dashboard Vercel | `ramis-projects-ff4a249e / bapita-dashboard` |
| Landing page source | `v2/src/dashboard/index.html` |
| Dashboard source | `/Users/admin/Desktop/bapita-dashboard/` |

Push to `main` → Vercel auto-deploys (both repos).

---

## Folder structure

```
bapita/                         ← this repo (landing page + docs)
├── shared/                     — research and competitive intel
├── v1/                         — archived v1 (WhatsApp Cloud API stack)
└── v2/
    ├── docs/
    │   ├── strategy.md
    │   ├── mvp-design.md
    │   ├── brand/bapita-brand-doc-v2.md
    │   └── specs/2026-06-08-dashboard-design.md
    └── src/dashboard/
        ├── index.html          — landing page (bapita.com)
        └── img/

bapita-dashboard/               ← separate repo (Next.js app)
└── src/
    ├── app/
    │   ├── (dashboard)/        — all protected pages (auth-gated via middleware)
    │   │   ├── calendar/       — Day/Week/Month views, booking drawer
    │   │   ├── clients/        — client list + [id] profile page
    │   │   ├── insights/       — revenue, bookings, no-show stats
    │   │   ├── new-booking/    — 4-step manual booking flow
    │   │   ├── addons/         — add-on management (WhatsApp, Stripe)
    │   │   ├── settings/       — business info + services
    │   │   └── profile/        — password change
    │   ├── login/              — login + signup tabs
    │   └── manifest.ts         — PWA manifest
    ├── components/
    │   ├── AppShell.tsx        — top bar, desktop sidebar, mobile bottom nav, hamburger drawer
    │   ├── Toast.tsx           — toast notification system
    │   ├── LoadingSkeleton.tsx — per-page loading skeletons
    │   └── calendar/
    │       ├── DayView.tsx
    │       ├── WeekView.tsx
    │       ├── MonthView.tsx
    │       └── BookingDrawer.tsx
    ├── hooks/useBusiness.ts    — fetches current tenant's business row + refresh()
    ├── lib/supabase/           — client.ts + server.ts
    ├── types/index.ts          — Booking, Business, Customer, Service, status maps
    └── proxy.ts                — middleware route protection
```

---

## Key docs (v2)
- Strategy: `v2/docs/strategy.md`
- MVP design: `v2/docs/mvp-design.md`
- Brand: `v2/docs/brand/bapita-brand-doc-v2.md`
- Dashboard design spec: `v2/docs/specs/2026-06-08-dashboard-design.md`
- **Master plan (10 chat implementation guide):** `v2/docs/specs/2026-06-10-bapita-master-plan.md`
- Design system (created in Chat 2): `v2/docs/design-system.md`

---

## Dashboard status (as of Jun 10, 2026)

### Done
| Feature | Notes |
|---|---|
| Auth (login / signup) | Supabase email+password, session-gated routes |
| App shell | Top bar, desktop sidebar, mobile bottom nav, hamburger drawer |
| Calendar — Day/Week/Month | Fetches bookings from Supabase, swipe/nav between dates |
| Calendar — Today strip | Booking count, earned revenue, up-next chip on day view |
| Booking drawer | View booking details, update status, checkout |
| New booking flow | 4 steps: client search/create → service → time slots → confirm |
| Slot logic | Reads `business_hours` from DB — requires migration below |
| Clients list | Search, sort by recent/name/visits; visual empty state |
| Client profile | Booking history, total spent, internal notes |
| Insights | Revenue hero card, 2-col stat grid, pill-badge status, bar chart (Recharts), top services, new vs returning |
| Settings — Business | Business info save |
| Settings — Services | CRUD (add/toggle/delete) |
| Settings — Hours | Per-day open/closed toggles + time pickers; saves to `business_hours` JSONB |
| Add-ons page | Shows WhatsApp + Stripe cards, contact CTA |
| Profile page | Password change |
| Toast notifications | Success/error toasts wired to AppShell |
| Loading skeletons | Per-page skeleton components |
| PWA manifest | Installable on mobile |
| Multi-tenant RLS | All queries scoped to `business_id` |
| Email confirmations | `/api/send-confirmation` route via Resend — auth-protected, HTML-escaped |
| Onboarding flow | Settings detects no business row, shows setup form |

### Pending manual steps
| Item | Notes |
|---|---|
| ~~**Supabase migration**~~ | ✅ Done Jun 10 2026 — `business_hours` JSONB column added to businesses table |
| **Resend domain verification** | Add bapita.com to resend.com → get DNS records → add to domain registrar. Sender: `noreply@bapita.com`. **Until done: all emails silently fail** (app still works). BCC on all emails: `info.bapita@gmail.com`. |

### Not done / next priorities
| Item | Priority |
|---|---|
| Public booking page per client | High — customer-facing booking page, needed for demo |
| Blocked dates (Settings → Blocked dates tab) | Medium |
| Stripe payment collection | Low — add-on |
| WhatsApp automation | Low — add-on |
| Google Calendar sync | Low — nice-to-have |
| Test with real data / first client | High |

---

## Required: Supabase migration

Run once in Supabase → SQL Editor:

```sql
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{
  "monday":    {"open": true,  "start": "09:00", "end": "19:00"},
  "tuesday":   {"open": true,  "start": "09:00", "end": "19:00"},
  "wednesday": {"open": true,  "start": "09:00", "end": "19:00"},
  "thursday":  {"open": true,  "start": "09:00", "end": "19:00"},
  "friday":    {"open": true,  "start": "09:00", "end": "19:00"},
  "saturday":  {"open": true,  "start": "09:00", "end": "14:00"},
  "sunday":    {"open": false, "start": "09:00", "end": "17:00"}
}'::jsonb;
```

---

## Dashboard tech stack
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Hosting | Vercel |
| Database + Auth | Supabase (shared project, RLS per `business_id`) |
| Email | Resend — `noreply@bapita.com` (requires domain DNS verification) |

### Environment variables (dashboard Vercel project)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

WhatsApp add-on: `META_VERIFY_TOKEN`, `META_APP_SECRET`, `ANTHROPIC_API_KEY`, `CRON_SECRET`  
Stripe add-on: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## Landing page (bapita.com)

Single `index.html`. Deployed via Vercel on push to `main`.

Source: `v2/src/dashboard/index.html`  
Has its own `.git` at `v2/src/dashboard/.git` — use `git -C v2/src/dashboard` for all git ops on the LP.

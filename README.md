# Bapita

Done-for-you booking platform for Israeli appointment businesses.

**Domain:** bapita.com  
**Tagline:** Built for you. Runs without you.  
**Stack:** Next.js 16 + Supabase + Vercel

---

## Progress Tracker

- [x] Chat 1 — README & Organization
- [x] Chat 2 — Design System Document
- [x] Chat 3 — App Shell + Login
- [x] Chat 4 — Calendar
- [x] Chat 5 — Clients List + Client Profile
- [ ] Chat 6 — New Booking Flow
- [ ] Chat 7 — Insights
- [ ] Chat 8 — Settings + Profile + Add-ons
- [ ] Chat 9 — Public Booking Page (/book/[slug])
- [ ] Chat 10 — Landing Page (bapita.com)

Full prompt for each chat: `v2/docs/specs/2026-06-10-bapita-master-plan.md`

---

## Quick Reference

### Live URLs
| What | URL |
|---|---|
| Landing page | https://bapita.com |
| Owner dashboard | https://dashboard.bapita.com |

### Repos on disk
| Repo | Path |
|---|---|
| Docs + landing page | `/Users/admin/Desktop/bapita/` |
| Dashboard (Next.js) | `/Users/admin/Desktop/bapita-dashboard/` |

### GitHub
| Repo | GitHub |
|---|---|
| Landing page + docs | `ramikan96-collab/bapita` |
| Dashboard | `ramikan96-collab/bapita-dashboard` |

### Vercel projects
| What | Project |
|---|---|
| Dashboard | `ramis-projects-ff4a249e / bapita-dashboard` |
| Landing page | `ramikan96-collab / bapita` |

### Key commands
```bash
# Push dashboard changes
cd /Users/admin/Desktop/bapita-dashboard
git add src/ && git commit -m "..." && git push

# Push landing page (has its own git at v2/src/dashboard/)
git -C /Users/admin/Desktop/bapita/v2/src/dashboard add index.html
git -C /Users/admin/Desktop/bapita/v2/src/dashboard commit -m "..."
git -C /Users/admin/Desktop/bapita/v2/src/dashboard push

# Push docs/README changes
git -C /Users/admin/Desktop/bapita add README.md && git -C /Users/admin/Desktop/bapita commit -m "..." && git -C /Users/admin/Desktop/bapita push
```

### Environment variables (dashboard Vercel project)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=    # web-push — baked into client at BUILD time
VAPID_PRIVATE_KEY=               # web-push — server only
```

> ⚠️ `NEXT_PUBLIC_*` vars are inlined at **build** time, not runtime. After
> changing any of them you must **redeploy** for the new value to reach the
> browser bundle.

WhatsApp add-on: `META_VERIFY_TOKEN`, `META_APP_SECRET`, `ANTHROPIC_API_KEY`, `CRON_SECRET`  
Stripe add-on: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## Notifications

Two layers, both keyed to the owner's business (`getOwnerBusinessId` → oldest
business row for the owner; same rule client + server so they always agree).

**In-app bell** (always on)
- DB trigger `booking_notify_trigger` → `notify_on_booking_change()` inserts a
  row into `notifications` on booking insert/cancel/reschedule.
- `useNotifications` hook (`src/hooks/useNotifications.ts`) loads `/api/notifications`,
  polls every 60s, and subscribes to Supabase Realtime for live updates.
- Single bell, in the hamburger drawer header (`AppShell.tsx`). Tapping it opens
  the notifications sheet. RLS policy `notifications.owner_all` scopes reads to
  businesses the signed-in user owns.

**Push (PWA)** — opt-in
- `push_subscriptions` table holds one row per browser subscription.
- `PushInit.tsx`: on load registers the service worker (`public/sw.js`) and
  re-sends any existing subscription. It does **not** auto-prompt.
- The user enables push via the **"Enable push notifications"** button in the
  bell sheet. This is a deliberate user gesture because iOS Safari rejects
  `Notification.requestPermission()` outside one, and only allows push when the
  PWA is **installed to the home screen** (standalone). The button is hidden /
  shows an "add to home screen" hint accordingly.
- `/api/push/subscribe` saves the subscription; a Supabase `pg_net` webhook on
  new notifications calls `/api/push/send`, which signs with the VAPID keys.

Requires `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` (see env above).
Because the public key is build-time inlined, **redeploy after setting it**.

---

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
├── index.html                  — root-level LP copy (legacy)
├── img/                        — root-level assets (legacy)
├── shared/
│   └── research/               — market research and competitive intel
├── v1/                         — archived v1 (WhatsApp Cloud API stack)
│   ├── docs/
│   └── specs/
└── v2/
    ├── docs/
    │   ├── strategy.md
    │   ├── mvp-design.md
    │   ├── google-doc-summary.md
    │   ├── brand/bapita-brand-doc-v2.md
    │   ├── design/              — logo exports (SVG, HTML)
    │   └── specs/
    │       ├── 2026-06-08-dashboard-design.md
    │       └── 2026-06-10-bapita-master-plan.md  ← 10-chat guide
    ├── specs/                  — additional v2 specs
    └── src/
        ├── dashboard/          — landing page (bapita.com), own .git
        │   ├── index.html
        │   └── img/
        └── dashboard-app/      — old scaffolding / supabase config

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
    │   ├── book/[slug]/        — public customer booking page
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

---

## Landing page (bapita.com)

Single `index.html`. Deployed via Vercel on push to `main`.

Source: `v2/src/dashboard/index.html`  
Has its own `.git` at `v2/src/dashboard/.git` — use `git -C v2/src/dashboard` for all git ops on the LP.

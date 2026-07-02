# Google Calendar Integration + Staff Calendars — Design & Execution Plan

**Date:** 2026-06-23
**Repo:** `bapita-dashboard` (Next.js 16 App Router + Supabase + Vercel)
**Status:** Approved design. Execute task-by-task, one fresh chat per task.

---

## How to use this doc

Each task below has a **Model**, an **Effort**, and a **paste-ready prompt**.
Workflow per task:

1. Open a new chat in this repo.
2. Set the model (`/model`) and effort to the values listed for that task.
3. Paste the task's prompt block.
4. Review the diff, test, commit.
5. Move to the next task.

Build order is strict: **T1 → T9**. Tasks share files and have hard
dependencies. Do not parallelize. Layer 1 (T1–T3) needs no Google credentials
and is fully buildable today. Layer 2/3 need the Google Cloud setup in **T4**
done first (manual — only you can click through the console).

**Effort guide** (per owner preference): `medium` = routine/contained,
`high` = schema, security, data integrity, or multi-file refactor.

---

## Problem

The calendar sidebar shows a "Calendars" section (`AppShell.tsx:892`) with an
"Add calendar" button that only fires `showToast("Multiple calendars coming
soon")` and a "SOON" badge (`AppShell.tsx:915`). `CalendarSelectorPanel.tsx`
renders only "All calendars" + a single hard-coded `"owner"` row. There is **no
Google Calendar code anywhere** in `src/` (existing Google code is Places /
Reviews only). Staff exist only as a display-only JSONB array
(`businesses.staff_members`, shape `{id, name, role, photo_url}`); **bookings
have no `staff_id`**.

Goal: real per-staff calendars + two-way Google Calendar sync per staff.

---

## Architecture decisions (locked)

1. **Staff promoted to a real `staff` table.** JSONB can't hold OAuth tokens or
   per-staff sync state under RLS. Migrate existing JSONB rows into the table,
   preserving their UUIDs, then repoint all reads (settings CRUD, admin
   `BusinessForm`, public booking page staff section).
2. **Per-staff Google.** Each staff connects their own Google account. Their
   bookings sync to their own calendar; their external Google events become
   busy blocks for their slots.
3. **OAuth stays in "testing" mode.** Google Calendar scopes are *sensitive* and
   normally require app verification (weeks). Testing mode allows ≤100 named
   test users with **no verification**. Bapita onboards each client by hand, so
   add each client's Google account as a test user. Revisit only past ~100
   businesses.
4. **Token table is service-role only.** `staff_calendar_connections` has RLS
   that denies all client roles; only server routes (service role) read/write
   it. No tokens ever reach the browser.
5. **Sync is trigger-driven, reusing the existing pg_net pattern.** The repo
   already uses Supabase triggers + `pg_net` webhooks for push notifications.
   Booking changes fire a trigger → POST to a server route → Google API. This
   catches bookings from all three insert sites
   (`api/public/book`, `new-booking`, `AddCustomerSheet`) without touching each.

---

## Data model

### `staff` table (T1)
```sql
create table public.staff (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name        text not null,
  role        text not null default '',
  photo_url   text,
  color       text not null default '#E8920A', -- calendar color
  sort_order  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index staff_business_idx on public.staff(business_id);
alter table public.staff enable row level security;

-- Owners manage staff for businesses they own.
create policy staff_owner_all on public.staff
  for all using (business_id in (select id from public.businesses where owner_id = auth.uid()))
  with check (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- Public booking page reads active staff.
create policy staff_public_read on public.staff
  for select using (active = true);
```
> Confirm the businesses ownership column name (`owner_id` vs `user_id`) against
> the live schema before applying — match the existing `businesses` RLS policy.

**Migration of existing data:** for each `businesses` row, insert one `staff`
row per element of `staff_members` JSONB, **reusing the element's `id`** so any
existing references stay valid. Keep the `staff_members` JSONB column in place
(deprecated) until reads are switched and verified; drop it in a later cleanup.

### `bookings.staff_id` (T2)
```sql
alter table public.bookings
  add column if not exists staff_id uuid references public.staff(id) on delete set null;
create index if not exists bookings_staff_idx on public.bookings(staff_id);
```
Nullable — existing bookings stay unassigned.

### `staff_calendar_connections` table (T5)
```sql
create table public.staff_calendar_connections (
  id                 uuid primary key default gen_random_uuid(),
  staff_id           uuid not null unique references public.staff(id) on delete cascade,
  business_id        uuid not null references public.businesses(id) on delete cascade,
  google_account_email text,
  google_calendar_id text not null default 'primary',
  access_token       text,
  refresh_token      text not null,
  token_expiry       timestamptz,
  sync_token         text,          -- L3 incremental pull cursor
  watch_channel_id   text,          -- L3 optional push channel
  watch_resource_id  text,
  watch_expiry       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.staff_calendar_connections enable row level security;
-- Deny all to client roles; only the service role (server) touches this table.
-- (No policies = deny by default under RLS. Do NOT add client policies.)
```
> Optional hardening: encrypt `refresh_token` at rest with a `TOKEN_ENCRYPTION_KEY`
> env secret. Not required given service-role-only access; note as a follow-up.

### `bookings.gcal_event_id` (T6)
```sql
alter table public.bookings
  add column if not exists gcal_event_id text;
```
Maps a Bapita booking to its Google event for patch/delete.

### `external_events` table (T7) — pulled Google busy blocks
```sql
create table public.external_events (
  id            uuid primary key default gen_random_uuid(),
  staff_id      uuid not null references public.staff(id) on delete cascade,
  business_id   uuid not null references public.businesses(id) on delete cascade,
  gcal_event_id text not null,
  start_at      timestamptz not null,
  end_at        timestamptz not null,
  summary       text,
  updated_at    timestamptz not null default now(),
  unique(staff_id, gcal_event_id)
);
create index external_events_staff_time_idx
  on public.external_events(staff_id, start_at, end_at);
alter table public.external_events enable row level security;
create policy ext_owner_read on public.external_events
  for select using (business_id in (select id from public.businesses where owner_id = auth.uid()));
```
Service role writes; owner reads for calendar display. Slot logic reads via
service role.

---

# LAYER 1 — Internal staff calendars (no Google)

## T1 — `staff` table + migrate JSONB + repoint reads
**Model: Opus 4.8 · Effort: high**
Schema + data migration + multi-file refactor. Highest-risk task.

Scope:
- Apply `staff` table + RLS (above) via Supabase migration.
- Migrate `businesses.staff_members` JSONB → `staff` rows, reusing element ids.
- Repoint reads/writes from JSONB to the table in:
  - `src/app/(dashboard)/settings/page.tsx` (staff CRUD section, ~L1559–1618)
  - `src/app/(dashboard)/admin/businesses/_components/BusinessForm.tsx`
  - public booking page staff section (`src/app/[slug]/...` — locate the
    component reading `staff_members` / `show_staff`)
- Keep `show_staff` boolean on `businesses` (display toggle stays).
- Leave the `staff_members` JSONB column in place (deprecated) — do not drop yet.
- Add a `staff` type to `src/types/index.ts` reflecting the table (id,
  business_id, name, role, photo_url, color, sort_order, active).

Acceptance: staff CRUD in settings reads/writes the table; public page renders
staff from the table; existing staff data visible (migrated), nothing lost.

**Paste prompt:**
```
Read README.md and docs/specs/2026-06-23-google-calendar-staff-design.md
(sections "Data model" and "T1"). Implement T1 exactly: create the staff table
with RLS, migrate existing businesses.staff_members JSONB into it preserving
ids, and repoint all staff reads/writes (settings CRUD, admin BusinessForm,
public booking page staff section) from the JSONB column to the new table.
Keep the show_staff boolean and leave the staff_members JSONB column in place
(deprecated). First verify the businesses ownership column name against the live
schema and match the existing businesses RLS policy. Add a Staff type to
src/types/index.ts. Do not start any Google work.
```

## T2 — `bookings.staff_id` + assign staff in booking flows
**Model: Sonnet 4.6 · Effort: medium**

Scope:
- Add `bookings.staff_id` column + index (above).
- Add a staff picker (optional, defaults to none/unassigned) to:
  - `src/app/(dashboard)/new-booking/page.tsx` (insert at L298)
  - `src/components/calendar/EditBookingSheet.tsx`
  - `src/components/AddCustomerSheet.tsx` (insert at L151)
  - public booking page — staff selection step (only if `show_staff` and >1
    active staff); otherwise omit. Insert at `src/app/api/public/book/route.ts:167`.
- Add `staff` to the `Booking` type + calendar select queries
  (`calendar/page.tsx` fetchBookings select).

Acceptance: a booking can be assigned to a staff member from dashboard + (when
enabled) the public page; staff shows on the booking record.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (T2). T1 is done
(staff table exists). Implement T2: add bookings.staff_id (nullable FK to staff,
on delete set null) and let bookings be assigned to a staff member in the
new-booking flow, EditBookingSheet, AddCustomerSheet, and the public booking
page (public staff step only when show_staff and >1 active staff). Update the
Booking type and the calendar fetchBookings select to include staff. Keep
assignment optional. Do not start any Google work.
```

## T3 — Wire calendar filter to real staff + colors; kill the SOON stub
**Model: Sonnet 4.6 · Effort: medium**

Scope:
- Replace the hard-coded `"owner"` row in
  `src/components/calendar/CalendarSelectorPanel.tsx` with real staff rows
  (fetch active staff for the business; each row = staff name + color dot +
  checkbox).
- Feed staff list down from `calendar/page.tsx` (or AppShell) into the panel.
- Make `calendarFilter` filter bookings by `staff_id` (replace the no-op
  `setCalendarFilter([])` handlers; current logic in `calendar/page.tsx`
  computes `visibleBookings` — extend it to also filter by selected staff ids).
- Color bookings/blocks on the calendar by their staff `color` (DayView /
  WeekView / MonthView).
- Remove the "Add calendar / SOON" toast stub at `AppShell.tsx:915` (replaced by
  real staff rows). The "Connect Google" entry point comes in T5.

Acceptance: calendar sidebar lists real staff; toggling filters the grid by
staff; bookings are color-coded per staff.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (T3). T1–T2 are done.
Implement T3: replace the hard-coded "owner" row in CalendarSelectorPanel with
real active-staff rows (name + color dot + checkbox), feed the staff list from
calendar/page.tsx, make calendarFilter filter bookings by staff_id, color
bookings/blocks by staff color across Day/Week/Month views, and remove the "Add
calendar / SOON" toast stub in AppShell. Do not start any Google work.
```

---

# LAYER 2 — Push Bapita → Google (per staff)

## T4 — Google Cloud + OAuth setup (MANUAL — you, no model)
**This is clicks in console.cloud.google.com, not code. Do it before T5.**

1. Create a Google Cloud project (e.g. "Bapita").
2. **APIs & Services → Library →** enable **Google Calendar API**.
3. **OAuth consent screen:** User type **External**, publishing status
   **Testing**. App name "Bapita", support email, developer email. Add your
   homepage + privacy policy URL (bapita.com). Add scopes:
   - `https://www.googleapis.com/auth/calendar.events` (read/write events — push)
   - `https://www.googleapis.com/auth/calendar.readonly` (read other events — pull/busy, L3)
4. **Test users:** add each client's Google account email (≤100). Required —
   only listed users can connect while in Testing.
5. **Credentials → Create OAuth client ID → Web application.** Authorized
   redirect URIs:
   - `https://dashboard.bapita.com/api/google/oauth/callback`
   - `http://localhost:3000/api/google/oauth/callback` (dev)
6. Copy **Client ID** + **Client secret**.
7. Add to Vercel env (dashboard project), all environments:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_OAUTH_REDIRECT_URI=https://dashboard.bapita.com/api/google/oauth/callback
   ```
   (these are server-only — no `NEXT_PUBLIC_` prefix). Redeploy.

Output of T4: the three env vars set in Vercel + local `.env.local`.

## T5 — OAuth connect/callback routes + connection table
**Model: Opus 4.8 · Effort: high**
Security-sensitive (OAuth, refresh tokens). Treat carefully.

Scope:
- Apply `staff_calendar_connections` table + RLS (service-role-only).
- `GET /api/google/oauth/start?staff_id=...` → builds Google consent URL with
  `access_type=offline`, `prompt=consent` (force refresh token), `state`
  carrying signed staff_id + CSRF nonce. Owner-auth required.
- `GET /api/google/oauth/callback` → exchanges code for tokens, stores
  access/refresh/expiry + `google_account_email` + `google_calendar_id`
  (`primary`) in `staff_calendar_connections` via **service role**. Verify
  `state`. Redirect back to calendar with a success toast.
- `POST /api/google/disconnect` → revokes token + deletes the connection row.
- Token refresh helper: `getValidAccessToken(staff_id)` — refreshes when
  expired, persists new access token + expiry. Reused by T6/T7.
- UI: a "Connect Google" button per staff (in CalendarSelectorPanel row menu or
  the staff settings card) showing connected email + Disconnect when linked.

Acceptance: a staff member can connect their Google account end-to-end; a
connection row is created; tokens never reach the client; disconnect works.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (decisions 3–4,
"staff_calendar_connections", T5). T1–T4 done (Google OAuth client + env vars
exist). Implement T5: the staff_calendar_connections table (RLS deny-all to
clients, service-role only), OAuth start/callback/disconnect routes with state
CSRF protection and access_type=offline+prompt=consent, a getValidAccessToken
refresh helper, and a per-staff "Connect Google / Disconnect" UI. Tokens must
never reach the browser. Use the Google Calendar REST API directly (fetch) or a
minimal googleapis client — keep deps light. Do not implement push/pull yet.
```

## T6 — Push booking changes to Google (trigger-driven)
**Model: Opus 4.8 · Effort: high**
Data integrity across multiple booking sources. Reuse the existing pg_net
notification pattern.

Scope:
- Add `bookings.gcal_event_id` column.
- `POST /api/google/sync-push` (service-auth via a shared secret header, like
  the existing CRON/notification webhooks): given a booking id + change type:
  - **insert/confirm** → if booking has a `staff_id` with a connection →
    Calendar `events.insert` on that staff's calendar → save `gcal_event_id`.
  - **update** (time/date/service/status) → `events.patch`.
  - **cancel/delete** → `events.delete` + clear `gcal_event_id`.
- Supabase trigger on `bookings` (insert/update/delete) → `pg_net` POST to the
  route, mirroring `booking_notify_trigger`/notifications. This catches all
  three insert sites automatically.
- Event body: summary = customer name + service, start/end from
  appointment_date/time + service.duration, description = notes/phone.
- Idempotency: if `gcal_event_id` already set on insert, patch instead.

Acceptance: creating/editing/canceling a booking assigned to a connected staff
member creates/updates/removes the matching Google Calendar event. Bookings for
unassigned or unconnected staff are no-ops.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (decision 5, T6) and
the README "Notifications" section (the existing pg_net trigger pattern). T1–T5
done. Implement T6: add bookings.gcal_event_id, a /api/google/sync-push route
(service-secret auth) that inserts/patches/deletes the Google event for a
booking on its assigned staff's calendar using getValidAccessToken, and a
Supabase trigger on bookings (insert/update/delete) that fires pg_net to that
route — mirroring the existing booking_notify_trigger. No-op when staff is
unassigned or not connected. Make it idempotent on gcal_event_id.
```

---

# LAYER 3 — Pull Google → Bapita (busy blocks, completes two-way)

## T7 — Incremental pull of external Google events
**Model: Opus 4.8 · Effort: high**

Scope:
- Apply `external_events` table + RLS (above).
- `POST /api/google/sync-pull` (service-auth): for a given connection, call
  Calendar `events.list` using stored `sync_token` (incremental). First run:
  full list over a bounded window (e.g. now → +90d), then store `nextSyncToken`.
  On `410 Gone` (sync token expired) → reset and full-resync.
- Upsert results into `external_events` (skip events Bapita itself created — i.e.
  those whose id appears as a `bookings.gcal_event_id`, to avoid echo). Delete
  rows for events that were cancelled.
- Store the new `sync_token` on the connection.

Acceptance: a connected staff's external Google events land in `external_events`;
re-running pulls only deltas; Bapita-originated events are excluded.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md ("external_events",
T7). T1–T6 done. Implement T7: external_events table + RLS, and a
/api/google/sync-pull route that incrementally lists a connection's Google
events via stored sync_token (full bounded resync on first run or 410 Gone),
upserts them into external_events, deletes cancelled ones, excludes events
Bapita created (ids present in bookings.gcal_event_id), and persists
nextSyncToken. Service-secret auth, getValidAccessToken for tokens.
```

## T8 — Block double-booking on external events
**Model: Sonnet 4.6 · Effort: high**
Contained but correctness-critical.

Scope:
- In slot generation, subtract times overlapping a connected staff's
  `external_events` from available slots:
  - Public: `src/app/api/public/slots/route.ts` — when a staff is selected (or
    the business has a single staff), exclude slots overlapping that staff's
    external_events (read via service role).
  - Dashboard new-booking slot logic — same exclusion for the chosen staff.
- Optionally render external_events as faint busy blocks on the calendar
  (Day/Week views) for connected staff.

Acceptance: a time the staff is busy in Google cannot be booked in Bapita for
that staff; the calendar can show those busy ranges.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (T8). T1–T7 done.
Implement T8: exclude time ranges that overlap a staff's external_events from
available booking slots, in both src/app/api/public/slots/route.ts (per selected
staff) and the dashboard new-booking slot logic, reading external_events via the
service role. Optionally render external_events as faint busy blocks on the
Day/Week calendar for connected staff. Do not change push logic.
```

## T9 — Keep external events fresh (cron poll)
**Model: Sonnet 4.6 · Effort: medium**

Scope:
- A Vercel cron (or Supabase pg_cron) every ~15 min hitting a
  `/api/google/sync-pull-all` route (guarded by `CRON_SECRET`, which already
  exists) that iterates all connections and calls the T7 pull logic.
- Also refresh tokens proactively where near expiry.
- (Stretch / optional, note only — do not build now: Google `events.watch` push
  channels for near-realtime, with channel renewal. Cron is sufficient for v1.)

Acceptance: external busy blocks refresh automatically on a schedule without user
action.

**Paste prompt:**
```
Read docs/specs/2026-06-23-google-calendar-staff-design.md (T9). T1–T8 done.
Implement T9: a /api/google/sync-pull-all route guarded by CRON_SECRET that
iterates all staff_calendar_connections and runs the T7 pull for each, plus a
Vercel cron (~every 15 min) calling it. Refresh near-expiry tokens proactively.
Do not build Google watch webhooks — leave that as a noted future enhancement.
```

---

## Task summary

| # | Task | Layer | Model | Effort | Google creds needed |
|---|------|-------|-------|--------|---------------------|
| T1 | staff table + migrate + repoint reads | 1 | Opus 4.8 | high | no |
| T2 | bookings.staff_id + assign in flows | 1 | Sonnet 4.6 | medium | no |
| T3 | calendar filter → real staff + colors | 1 | Sonnet 4.6 | medium | no |
| T4 | Google Cloud + OAuth setup | 2 | manual (you) | — | sets them up |
| T5 | OAuth routes + connection table | 2 | Opus 4.8 | high | yes |
| T6 | push booking → Google (trigger) | 2 | Opus 4.8 | high | yes |
| T7 | incremental pull external events | 3 | Opus 4.8 | high | yes |
| T8 | block double-booking on busy | 3 | Sonnet 4.6 | high | yes |
| T9 | cron refresh | 3 | Sonnet 4.6 | medium | yes |

## Env vars added (Vercel, server-only)
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI
# reuse existing CRON_SECRET for T9
# optional: TOKEN_ENCRYPTION_KEY (hardening, not required)
```

## Risks / notes
- **Verify `businesses` ownership column** (`owner_id` vs `user_id`) before
  applying any RLS — match the existing businesses policy.
- **Testing-mode cap = 100 users.** Track client Google accounts; revisit
  verification before that ceiling.
- **Echo loop**: T7 must exclude Bapita-created events (via
  `bookings.gcal_event_id`) or pushed bookings re-import as busy blocks.
- **Refresh tokens**: Google only returns a refresh token with
  `access_type=offline` + `prompt=consent`. If missing, the connection is
  unusable — fail the callback loudly.
- **Timezones**: store/compare in the business timezone consistently; Google
  events carry their own tz. Normalize to UTC `timestamptz` in `external_events`.

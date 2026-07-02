# Bapita Security & Quality Audit
**Date:** 2026-06-17  
**Auditor:** Claude Sonnet 4.6 (read-only audit, code review of both repos)  
**Repos audited:** `/Users/admin/Desktop/bapita-dashboard/` + `/Users/admin/Desktop/bapita/v2/`  
**Status:** Findings documented → fixes in progress

---

## Top 3 Fixes (Pre-Demo Priority)

| # | Fix | Est. Time | Status |
|---|-----|-----------|--------|
| 1 | Rate limiting on `/api/public/book` (booking flood) | 45 min | ✅ Done |
| 2 | Delete-account wrong column (`user_id` → `owner_id`) | 5 min | ✅ Done |
| 3 | DB UNIQUE index for double-booking | 15 min | ✅ Done (SQL applied in Supabase 2026-06-17) |

---

## SECURITY

---

### Booking flood / schedule takeover — P0 (known gap)

**File:** `src/app/api/public/book/route.ts`  
**Issue:** Zero rate limiting on public booking endpoint. No IP throttle, no per-phone throttle, no CAPTCHA. Any script can POST with a real `businessId` + random name/phone and fill a barber's entire week in seconds. `businessId` is passed in every public booking page and is trivially extractable.  
**Impact:** Attacker fills every available slot across every demo page. Real customers see "no availability". During a live door-to-door demo this is catastrophic.  
**Fix applied:** Two-layer rate limiting added to `/api/public/book/route.ts`:
1. IP-based: 10 bookings per 60s per IP (module-level Map, resets per cold start — good enough for demo protection)
2. Phone-based: max 2 bookings per phone per business in last 2 hours (Supabase query)
**How to verify fix:** Submit 3 bookings from same phone for same business within 2 hours — 3rd should return 429.

---

### Double-booking race condition — P0

**File:** `src/app/api/public/book/route.ts:34-52`  
**Issue:** Conflict check is read-check-then-write with no DB transaction or UNIQUE constraint. Two simultaneous POST requests both read "slot is free", both pass overlap check, both insert. Result: two bookings for same slot.  
**Impact:** Barber shows up to two clients at same time. No automatic recovery.  
**Fix applied:** SQL UNIQUE partial index on `(business_id, appointment_date, appointment_time) WHERE status IN ('confirmed', 'pending')` applied in Supabase. Existing 409 conflict handler in the route catches any race-condition insert failures.  
**Status:** ✅ Done (2026-06-17)

---

### Email flood via public booking form — P1

**File:** `src/app/api/public/book/route.ts:89-126`  
**Issue:** Every booking with a `customerEmail` triggers Gmail SMTP send. No deduplication. Bot submitting 500 requests with different emails exhausts Gmail's 500/day limit. All legitimate confirmation emails then fail silently.  
**Impact:** All real customers stop receiving confirmations. Gmail account may be flagged for spam and suspended.  
**Fix:** Rate limiting (Fix #1) naturally limits email flood. Also added server-side email format check before sending.  
**Status:** Partially mitigated by Fix #1 rate limiting.

---

### Delete-account uses wrong column — P1

**File:** `src/app/api/delete-account/route.ts:18`  
**Issue:** Line 18 queries `.eq("user_id", user.id)` — column doesn't exist. Businesses table uses `owner_id`. Query silently returns 0 rows. All cascade deletes (bookings, customers, services, businesses) never run. Auth user is deleted but all data orphaned permanently.  
**Impact:** Every deleted account leaves ghost data. Ghost booking pages remain accessible.  
**Fix applied:** Changed `user_id` → `owner_id` on line 18.  
**How to verify:** Create test account → create business → delete account → confirm business row gone in Supabase.  
**Status:** ✅ Done

---

### Admin gate — CORRECT ✓

**File:** `src/app/(dashboard)/admin/layout.tsx`  
Server-side check against `user.email !== "ramikan96@gmail.com"` with `redirect("/calendar")`. Runs as Server Component before any child renders. Cannot be bypassed client-side. No action needed.

---

### Service role key exposure — CORRECT ✓

**File:** `src/lib/supabase/service.ts`  
`SUPABASE_SERVICE_ROLE_KEY` used only in server-side API routes. Not in any `NEXT_PUBLIC_` variable. Not exposed to browser. No action needed.

---

### No HTTP security headers — P2

**File:** `next.config.ts`  
**Issue:** Completely empty config. No `X-Frame-Options`, no `X-Content-Type-Options`, no `Referrer-Policy`. Booking page can be iframed by third parties (clickjacking).  
**How to fix:**
```ts
headers: async () => [{
  source: "/(.*)",
  headers: [
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ],
}]
```
**Status:** ⬜ Not yet fixed (low priority for demo day)

---

## BUSINESS LOGIC

---

### New-booking admin race condition — P1

**File:** `src/app/(dashboard)/new-booking/page.tsx:271-295`  
**Issue:** Admin new-booking does client-side conflict check (read → check → insert) using anon browser client. Same read-check-then-write race window as public flow. Also: conflict check uses `.in("status", ["confirmed", "pending"])` but slot fetch uses `.not("status", "eq", "cancelled")` — minor inconsistency that could miss `no_show` bookings.  
**Impact:** Rare in practice (single admin). DB UNIQUE index (Fix #3) serves as backstop.  
**Status:** ⬜ Mitigated by Fix #3 DB index

---

### Service delete — already null-safe ✓

**Reviewed 2026-06-17:** Every access to `booking.service` across `BookingDrawer`, `AgendaCard`, `DayView`, `WeekView` already uses optional chaining (`?.`) with safe fallbacks. Deleted service → chip shows customer name only, drawer shows `—` for price, duration defaults to 30 min. No crash possible.  
**Status:** ✅ Already safe — no action needed

---

### Cancelled status can be re-confirmed — P2

**File:** `src/types/index.ts:1`  
**Issue:** No status machine enforcement. UI likely allows any status → any status. Cancelled booking can be set back to confirmed without customer notification.  
**Impact:** Low. Operator error possible but unlikely.  
**Status:** ⬜ Acceptable at current scale

---

### Null `business_hours` shows slots when closed — P2

**File:** `src/lib/availability.ts:44`  
**Issue:** When `businessHours` is `null` (new business, no hours set), all days fall back to 9:00–19:00 as open. New barber who hasn't configured hours has all slots appear as bookable.  
**Impact:** Customer books at random time. Barber didn't know they were open. Appointment confusion.  
**How to fix:** Return `[]` when `businessHours` is `null`. Add "Set your hours to enable bookings" prompt in Settings.  
**Status:** ⬜ Not yet fixed

---

## UX / FLOW GAPS

---

### Phone field accepts any string — P2

**File:** `src/app/[slug]/booking/steps/ContactStep.tsx:43`, `src/app/api/public/book/route.ts:27`  
**Fix applied:** Server returns 400 if `customerPhone.trim().length < 7`. Client `canSubmit` now requires `phone.trim().length >= 7` before enabling submit button.  
**Status:** ✅ Done (commit 99ac1cb, 2026-06-17)

---

### No empty state for zero services on booking page — P2

**File:** `src/app/[slug]/themes/*/` all theme files  
**Issue:** If business has 0 active services, booking flow shows blank service list with no explanation. Looks broken.  
**Impact:** Demo-day risk if services are accidentally toggled off.  
**Status:** ⬜ Not yet fixed

---

### RTL hardcoded directional CSS — P2

**File:** Theme files — needs grep for `text-align: left`, `padding-left`, `margin-left`  
**Issue:** Some RTL fixes applied (QA doc), but directional CSS may remain in theme components.  
**Status:** ⬜ Not audited line-by-line

---

## CODE QUALITY

---

### `_debug` field — ALREADY REMOVED ✓

**File:** `src/app/api/public/slots/route.ts`  
QA doc note (line 157) says it's still present. Current code: no `_debug` field exists. Already removed. QA doc note is stale. No action needed.

---

### TypeScript `any` in admin page — P2

**File:** `src/app/(dashboard)/admin/businesses/page.tsx:155-159`  
**Issue:** `(b as any).status`, `(b as any).hero_image_url`, etc. All these fields exist on the `Business` type already. Casts unnecessary.  
**Status:** ⬜ Not yet fixed (cosmetic)

---

### `console.error` leaks Supabase error details — P3

**File:** `src/app/api/public/book/route.ts:65-86`  
**Issue:** Full Supabase error objects logged including potential PII. Anyone with Vercel log access sees customer data.  
**How to fix:** Log only `error.code` and `error.message`, not full object.  
**Status:** ⬜ Not yet fixed

---

## PERFORMANCE

---

### No `.limit()` on admin businesses list — P3

**File:** `src/app/(dashboard)/admin/businesses/page.tsx:30`  
Negligible today. Add `.limit(200)` when approaching scale.

---

### Calendar agenda view 90-day range, no limit — P2

**File:** `src/app/(dashboard)/calendar/page.tsx:33`  
Agenda view fetches 90 days with no `.limit()`. Add `.limit(500)` as safety net.

---

## DEMO-DAY VERDICT

Demoing tomorrow is viable **if** Fix #1 (rate limiting) is deployed. The booking flow is polished. The single highest-risk item was the booking flood — now mitigated. Fix #2 (delete-account column) is deployed. Fix #3 (DB UNIQUE index) needs a 1-minute SQL run in Supabase.

After those three: the product is demo-ready. All remaining findings are P2/P3 and don't block the first sale.

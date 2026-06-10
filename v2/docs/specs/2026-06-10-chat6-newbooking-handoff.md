# Chat 6 — New Booking Flow + Entry-Point Cleanup · HANDOFF (TODO)

**Date:** 2026-06-10
**Repo:** `~/Desktop/bapita-dashboard` → github `ramikan96-collab/bapita-dashboard`
**Branch:** `main`
**Status:** ✅ DONE — shipped `65aefa4`, live on Production. All TODOs below completed.
**Prereq reading:** design-system.md, master plan "Booking entry-point logic" section (canonical).

---

## The decision that triggered this chat (2026-06-10)

The "+" / new-booking entry points got mixed up. Rami's canonical logic:

- **Booking `+` lives ONLY on the calendar** (FAB + tap-empty-slot).
- **Clients tab gets its own `+`** = add a customer (name + phone). From that same flow the owner can optionally **attach a date + service + time → that creates a booking too**. Customer-first, booking optional.
- **Client profile** "New booking for X" books an existing customer.
- **Nowhere else.** No booking `+` on Insights / Financials / Clients.

Full table lives in the master plan ("Booking entry-point logic") and design-system.md ("Booking entry points"). Both updated this session.

---

## Current code state (what exists today)

### `src/components/AppShell.tsx`
- Renders the FAB (`+` → `router.push("/new-booking")`) on **every** dashboard screen (`AppShell.tsx:423-435`, inside `md:hidden`, gated only by `!drawerOpen`).
- **Bug per new logic:** FAB must be calendar-only. Gate it on `pathname === "/calendar"` (the shell already computes `onCalendar`). Move/condition the FAB render on `onCalendar`.

### `src/app/(dashboard)/new-booking/page.tsx` — the wizard (full page, Suspense-wrapped)
4 steps in local state (`step: "client" | "service" | "datetime" | "confirm"`), bottom button bar.
- **Reads** `?date=` + `?time=` query params → prefills `selectedDate` / `selectedTime`. ✅ works.
- **Does NOT read `?clientId=`** — clients profile passes it (Chat 5) but it's ignored. **Fix:** read it, fetch+preselect the customer, start at the Service step.
- Client search: `ilike("name", …)` only — **ignores phone** despite "name or phone" placeholder. Fix: `.or("name.ilike.%q%,phone.ilike.%q%")`.
- Errors use `alert("Error creating client")` / `alert("Error creating booking")` — **replace with `useToast()`** (provider already in AppShell).
- Service fetch alias is **correct already**: `select("id, name, duration:duration_minutes, price:price_nis, active, display_order, business_id")`. Keep.
- Slot-query alias correct: `service:services(duration:duration_minutes)`. Keep.
- `getAvailableSlots()` marks every returned slot `available: true` — no real unavailable state rendered; **past times on today are NOT filtered**; no "no slots" empty message.
- On success: hard `router.push("/calendar")` — **no success state**. Spec wants confirmation + "Add another" / "Go to calendar".
- Styling is off-system: `bg-white` page, `border-gray-200`, `bg-amber-500`, `bg-gray-100` slots, `border-amber-300`. Convert to tokens (cream bg, white cards, `var(--color-amber)`, `var(--color-cream-2)`).
- Back button preserves state (steps are persistent useState) — **keep that**, it's correct.
- New booking inserts `status: "confirmed"`, `payment_status: "none"`, writes `appointment_date` + `appointment_time` + `appointment_datetime` (ISO). Fires `/api/send-confirmation` if email present (fire-and-forget). Keep this logic.

### `src/app/(dashboard)/clients/page.tsx` — list (shipped Chat 5)
- Cream bg, white cards, debounced search (name + phone via `.or`), pill sort, warm empty state.
- **No `+` button yet.** Add an add-customer `+` in the header (amber, top-end). Empty-state CTA currently says "Take your first booking" → repoint to the add-customer flow.

### `src/app/(dashboard)/clients/[id]/page.tsx` — profile (shipped Chat 5)
- "New booking for {firstName}" button → `router.push(\`/new-booking?clientId=${client.id}\`)`. Already passes clientId — wizard just needs to consume it.

---

## TODO for Chat 6 (in order)

1. **AppShell** — gate FAB render on `onCalendar` only. Verify it disappears on clients/insights/financials, stays on calendar.
2. **new-booking wizard**:
   - Read `?clientId=` → fetch customer, preselect, start at Service step (still allow Back to client).
   - Client search: add phone to the `.or` filter.
   - Replace both `alert()` calls with `useToast(...,"error")`.
   - Redesign to design-system tokens (cream page, white cards, amber primary, cream-2 borders, status/spacing/radius per doc). Add a real step indicator (1 of 4).
   - Slot grid: filter past times when date == today; render unavailable distinct; "No times available" empty state.
   - Add a **success screen** (replace hard redirect): confirmation + "Add another" (reset wizard) / "Go to calendar".
3. **Clients add-customer `+`**:
   - Add `+` to clients list header → opens add-customer flow (name + phone, email optional).
   - Save = create customer. Offer to optionally attach date + service + time → create a booking in the same flow (reuse wizard pieces or a trimmed sheet — implementer's call, keep it design-system).
   - Repoint empty-state CTA to this flow.
4. **Build green** (`npm run build`), then commit + push:
   ```
   cd ~/Desktop/bapita-dashboard && git add src/ && git commit -m "redesign: new booking flow — 4-step wizard + entry-point cleanup, bug fixes" && git push
   ```
5. Verify live: `/new-booking` and `/clients` on dashboard.bapita.com.

---

## Decisions / notes
- "Add contact only" (no appointment) is reachable **only** via the Clients `+` (save customer, skip date). The calendar FAB always means a booking.
- The add-customer-with-optional-booking flow can reuse the wizard's service/date/time steps, or be a lighter sheet — not prescribed. Must stay design-system and must not introduce a second scattered booking `+`.
- `services` real columns are `duration_minutes` + `price_nis` (alias trap — already handled in new-booking; watch it anywhere new).
- Effort: keep `/effort high` for the whole chat (coding + reasoning). Only the final git push is trivial.
